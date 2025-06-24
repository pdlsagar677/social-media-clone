import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User, { IUser } from '../models/user-model';
import Post, { IPost } from '../models/post-model';
import { v2 as cloudinary } from 'cloudinary';
import getDataUri from '../utils/datauri';

declare module 'express' {
  interface Request {
    id?: string;
    file?: MulterFileCompatible;
  }
}

interface MulterFileCompatible {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

interface RegisterRequestBody {
  username: string;
  email: string;
  password: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

interface UserResponse {
  _id: string;
  username: string;
  email: string;
  profilePicture: string;
  bio: string;
  followers: string[];
  following: string[];
  posts: Partial<IPost>[];
}

interface LeanUserDocumentPopulated {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  gender?: 'male' | 'female';
  followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
  posts: IPost[];
  bookmarks: IPost[];
  createdAt: Date;
  updatedAt: Date;
}

interface PopulatedProfileResponse {
  _id: string;
  username: string;
  email: string;
  profilePicture: string;
  bio: string;
  gender?: 'male' | 'female';
  followers: string[];
  following: string[];
  posts: IPost[];
  bookmarks: IPost[];
  createdAt: Date;
  updatedAt: Date;
}

interface EditProfileRequestBody {
  bio?: string;
  gender?: 'male' | 'female';
}

interface CloudinaryUploadResponse {
  secure_url: string;
}

export const register = async (req: Request<{}, {}, RegisterRequestBody>, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ message: "All fields are required", success: false });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: "Email already in use", success: false });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hashedPassword });

    const userResponse: UserResponse = {
      _id: (newUser._id as mongoose.Types.ObjectId).toString(),
      username: newUser.username,
      email: newUser.email,
      profilePicture: newUser.profilePicture || '',
      bio: newUser.bio || '',
      followers: newUser.followers.map(id => id.toString()),
      following: newUser.following.map(id => id.toString()),
      posts: []
    };

    res.status(201).json({
      message: "Account created successfully",
      success: true,
      data: userResponse
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Registration error:', errorMessage);
    res.status(500).json({ message: "Registration failed", success: false });
  }
}

export const login = async (req: Request<{}, {}, LoginRequestBody>, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required", success: false });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Incorrect email or password", success: false });
      return;
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      res.status(401).json({ message: "Incorrect email or password", success: false });
      return;
    }

    if (!process.env.SECRET_KEY) {
      throw new Error('JWT secret key not configured');
    }

    const token = jwt.sign(
      { userId: (user._id as mongoose.Types.ObjectId).toString() },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    const populatedPosts = await Promise.all(
      user.posts.map(async (postId) => {
        return await Post.findById(postId);
      })
    );

    const userResponse: UserResponse = {
      _id: (user._id as mongoose.Types.ObjectId).toString(),
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture || '',
      bio: user.bio || '',
      followers: user.followers.map(id => id.toString()),
      following: user.following.map(id => id.toString()),
      posts: populatedPosts.filter(post => post !== null) as Partial<IPost>[]
    };

    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        message: `Welcome back ${user.username}`,
        success: true,
        user: userResponse,
      });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Login error:', errorMessage);
    res.status(500).json({ message: "Login failed", success: false });
  }
}

export const logout = async (req: Request, res: Response): Promise<Response> => {
  try {
    return res
      .cookie("token", "", {
        maxAge: 0,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === 'production'
      })
      .status(200)
      .json({ message: 'Logged out successfully', success: true });
  } catch (error: unknown) {
    console.error('Logout error:', error instanceof Error ? error.message : error);
    return res.status(500).json({ message: 'Logout failed', success: false });
  }
};

export const editProfile = async (req: Request<{}, {}, EditProfileRequestBody>, res: Response): Promise<Response> => {
  try {
    const userId: string | undefined = req.id;
    const { bio, gender } = req.body;
    const profilePicture: MulterFileCompatible | undefined = req.file;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User ID not found in request.', success: false });
    }

    let cloudResponse: CloudinaryUploadResponse | undefined;

    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found.', success: false });
    }

    if (bio !== undefined) {
      user.bio = bio;
    }
    if (gender !== undefined) {
      user.gender = gender;
    }
    if (cloudResponse && cloudResponse.secure_url) {
      user.profilePicture = cloudResponse.secure_url;
    }

    await user.save();

    const userResponse: Partial<IUser> = user.toObject();
    delete userResponse.password;

    return res.status(200).json({
      message: 'Profile updated successfully.',
      success: true,
      user: userResponse
    });

  } catch (error: unknown) {
    console.error('Error editing profile:', error);
    return res.status(500).json({
      message: 'Failed to update profile.',
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred.'
    });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId: string = req.params.id;

    const user = await User.findById(userId)
      .populate({
        path: 'posts',
        options: { sort: { createdAt: -1 } }
      })
      .populate('bookmarks')
      .lean() as unknown as LeanUserDocumentPopulated;

    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }

    const userResponse: PopulatedProfileResponse = {
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture || '',
      bio: user.bio || '',
      gender: user.gender,
      followers: user.followers.map((id: mongoose.Types.ObjectId) => id.toString()),
      following: user.following.map((id: mongoose.Types.ObjectId) => id.toString()),
      posts: user.posts,
      bookmarks: user.bookmarks,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return res.status(200).json({
      user: userResponse,
      success: true
    });

  } catch (error: unknown) {
    console.error('Failed to fetch profile:', error instanceof Error ? error.message : error);
    return res.status(500).json({
      message: 'Failed to fetch profile',
      success: false,
    });
  }
};
