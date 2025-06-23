import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { IUser } from "./user-model"; 

// 1. Define TypeScript interface for the Post document
interface IPost extends Document {
  caption: string;
  image: string;
  author: Types.ObjectId | IUser; 
  likes: Types.ObjectId[] | IUser[]; 
  comments: Types.ObjectId[]; 
  createdAt?: Date;
  updatedAt?: Date;
}

// 2. Define the schema with TypeScript typing
const postSchema: Schema<IPost> = new mongoose.Schema({
  caption: { 
    type: String, 
    default: '' 
  },
  image: { 
    type: String, 
    required: [true, 'Image is required'] 
  },
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Author is required'] 
  },
  likes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  comments: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Comment' 
  }]
}, { 
  timestamps: true // Adds createdAt and updatedAt automatically
});

// 3. Create the Post model with TypeScript typing
const Post: Model<IPost> = mongoose.model<IPost>('Post', postSchema);

// 4. Export the model
export default Post;
export { IPost }; // Optional: Export the interface if needed elsewhere