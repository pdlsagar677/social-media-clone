import mongoose, { Document, Model, Schema } from "mongoose";

// 1. Define the TypeScript interface for the User document
interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  profilePicture: string;
  bio: string;
  gender?: 'male' | 'female';
  followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
  posts: mongoose.Types.ObjectId[];
  bookmarks: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// 2. Define the schema
const userSchema: Schema<IUser> = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  gender: {
    type: String,
    enum: ['male', 'female']
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }]
}, { timestamps: true });

// 3. Create the Model
const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

// 4. Export the Model
export default User;
export {IUser};