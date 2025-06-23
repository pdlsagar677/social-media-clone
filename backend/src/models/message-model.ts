import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { IUser } from "./user-model"; // Assuming you have IUser interface defined

// 1. Define the Message interface
export interface IMessage extends Document {
  senderId: Types.ObjectId | IUser; // Can be ObjectId or populated User
  receiverId: Types.ObjectId | IUser;
  message: string;
  createdAt?: Date; // Will be added by timestamps
  updatedAt?: Date;
}

// 2. Create the schema with TypeScript typing
const messageSchema: Schema<IMessage> = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Sender ID is required"],
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Receiver ID is required"],
    },
    message: {
      type: String,
      required: [true, "Message content is required"],
      trim: true, // Added for data consistency
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// 3. Create the typed model
const Message: Model<IMessage> = mongoose.model<IMessage>("Message", messageSchema);

// 4. Export the model
export default Message;