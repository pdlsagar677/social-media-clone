import { Request, Response } from "express";
import Conversation from "../models/conversation-model";
import { getReceiverSocketId, io } from "../socket/socket";
import Message from "../models/message-model";

interface AuthenticatedRequest extends Request {
  id: string;
}

interface SendMessageBody {
  textMessage: string;
}


export const sendMessage = async (req: Request, res: Response): Promise<Response> => {
  try {
    const authenticatedReq = req as AuthenticatedRequest;
    const senderId = authenticatedReq.id;
    const receiverId = req.params.id;
    const { textMessage: message }: SendMessageBody = req.body;

    if (!receiverId) {
      return res.status(400).json({
        success: false,
        message: "Receiver ID is required"
      });
    }

    if (!message || message.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Message content is required"
      });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId]
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id as any);
    }

    await Promise.all([conversation.save(), newMessage.save()]);

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', newMessage);
    }

    return res.status(201).json({
      success: true,
      newMessage
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const getMessage = async (req: Request, res: Response): Promise<Response> => {
  try {
    const authenticatedReq = req as AuthenticatedRequest;
    const senderId = authenticatedReq.id;
    const receiverId = req.params.id;

    if (!receiverId) {
      return res.status(400).json({
        success: false,
        message: "Receiver ID is required"
      });
    }

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    }).populate('messages');

    if (!conversation) {
      return res.status(200).json({
        success: true,
        messages: []
      });
    }

    return res.status(200).json({
      success: true,
      messages: conversation.messages || []
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};