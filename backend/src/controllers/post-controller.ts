import sharp from "sharp";
import { Request, Response } from "express";
import cloudinary from "../utils/cloudinary";
import Post from "../models/post-model";
import User from "../models/user-model";
import Comment from "../models/comment-model";
import { getReceiverSocketId, io } from "../socket/socket";

// Extend Express Request interface to include custom properties
interface AuthenticatedRequest extends Request {
  id: string;
  file?: Express.Multer.File;
}

interface PostBody {
  caption?: string;
}

interface CommentBody {
  text: string;
}

interface NotificationData {
  type: 'like' | 'dislike';
  userId: string;
  userDetails: {
    username: string;
    profilePicture: string;
  };
  postId: string;
  message: string;
}

export const addNewPost = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const { caption }: PostBody = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image) return res.status(400).json({ message: 'Image required' });

    // image upload 
    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: 'inside' })
      .toFormat('jpeg', { quality: 80 })
      .toBuffer();

    // buffer to data uri
    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    
    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId
    });

    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id as any);
      await user.save();
    }

    await post.populate({ path: 'author', select: '-password' });

    return res.status(201).json({
      message: 'New post added',
      post,
      success: true,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error', success: false });
  }
};

export const getAllPost = async (req: Request, res: Response): Promise<Response> => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 })
      .populate({ path: 'author', select: 'username profilePicture' })
      .populate({
        path: 'comments',
        options: { sort: { createdAt: -1 } },
        populate: {
          path: 'author',
          select: 'username profilePicture'
        }
      });

    return res.status(200).json({
      posts,
      success: true
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error', success: false });
  }
};

export const getUserPost = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId }).sort({ createdAt: -1 }).populate({
      path: 'author',
      select: 'username profilePicture'
    }).populate({
      path: 'comments',
      options: { sort: { createdAt: -1 } },
      populate: {
        path: 'author',
        select: 'username profilePicture'
      }
    });

    return res.status(200).json({
      posts,
      success: true
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error', success: false });
  }
};

export const likePost = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const likeKrneWalaUserKiId = req.id;
    const postId = req.params.id;
    
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found', success: false });

    // like logic started
    await post.updateOne({ $addToSet: { likes: likeKrneWalaUserKiId } });
    await post.save();

    // implement socket io for real time notification
    const user = await User.findById(likeKrneWalaUserKiId).select('username profilePicture');
     
    const postOwnerId = post.author.toString();
    if (postOwnerId !== likeKrneWalaUserKiId) {
      // emit a notification event
      const notification: NotificationData = {
        type: 'like',
        userId: likeKrneWalaUserKiId,
        userDetails: user!,
        postId,
        message: 'Your post was liked'
      };
      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      if (postOwnerSocketId) {
        io.to(postOwnerSocketId).emit('notification', notification);
      }
    }

    return res.status(200).json({ message: 'Post liked', success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error', success: false });
  }
};

export const dislikePost = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const likeKrneWalaUserKiId = req.id;
    const postId = req.params.id;
    
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found', success: false });

    // dislike logic started
    await post.updateOne({ $pull: { likes: likeKrneWalaUserKiId } });
    await post.save();

    // implement socket io for real time notification
    const user = await User.findById(likeKrneWalaUserKiId).select('username profilePicture');
    const postOwnerId = post.author.toString();
    
    if (postOwnerId !== likeKrneWalaUserKiId) {
      // emit a notification event
      const notification: NotificationData = {
        type: 'dislike',
        userId: likeKrneWalaUserKiId,
        userDetails: user!,
        postId,
        message: 'Your post was disliked'
      };
      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      if (postOwnerSocketId) {
        io.to(postOwnerSocketId).emit('notification', notification);
      }
    }

    return res.status(200).json({ message: 'Post disliked', success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error', success: false });
  }
};

export const addComment = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const postId = req.params.id;
    const commentKrneWalaUserKiId = req.id;
    const { text }: CommentBody = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found', success: false });

    if (!text) return res.status(400).json({ message: 'text is required', success: false });

    const comment = await Comment.create({
      text,
      author: commentKrneWalaUserKiId,
      post: postId
    });

    await comment.populate({
      path: 'author',
      select: "username profilePicture"
    });
    
    post.comments.push(comment._id as any);
    await post.save();

    return res.status(201).json({
      message: 'Comment Added',
      comment,
      success: true
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error', success: false });
  }
};

export const getCommentsOfPost = async (req: Request, res: Response): Promise<Response> => {
  try {
    const postId = req.params.id;

    const comments = await Comment.find({ post: postId }).populate('author', 'username profilePicture');

    if (!comments || comments.length === 0) {
      return res.status(404).json({ message: 'No comments found for this post', success: false });
    }

    return res.status(200).json({ success: true, comments });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error', success: false });
  }
};

export const deletePost = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found', success: false });

    // check if the logged-in user is the owner of the post
    if (post.author.toString() !== authorId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // delete post
    await Post.findByIdAndDelete(postId);

    // remove the post id from the user's post
    const user = await User.findById(authorId);
    if (user) {
      user.posts = user.posts.filter(id => id.toString() !== postId);
      await user.save();
    }

    // delete associated comments
    await Comment.deleteMany({ post: postId });

    return res.status(200).json({
      success: true,
      message: 'Post deleted'
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error', success: false });
  }
};

export const bookmarkPost = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found', success: false });
    
    const user = await User.findById(authorId);
    if (!user) return res.status(404).json({ message: 'User not found', success: false });

    if (user.bookmarks.includes(post._id as any)) {
      // already bookmarked -> remove from the bookmark
      await user.updateOne({ $pull: { bookmarks: post._id } });
      await user.save();
      return res.status(200).json({ type: 'unsaved', message: 'Post removed from bookmark', success: true });
    } else {
      // bookmark krna pdega
      await user.updateOne({ $addToSet: { bookmarks: post._id } });
      await user.save();
      return res.status(200).json({ type: 'saved', message: 'Post bookmarked', success: true });
    }

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error', success: false });
  }
};