// src/redux/chatSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Export the interface
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  username?: string;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date | string;
  createdAt?: Date | string;
}

interface ChatState {
  onlineUsers: User[];
  messages: Message[];
}

const initialState: ChatState = {
  onlineUsers: [],
  messages: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setOnlineUsers: (state, action: PayloadAction<User[]>) => {
      state.onlineUsers = action.payload;
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    }
  }
});

export const { setOnlineUsers, setMessages } = chatSlice.actions;
export default chatSlice.reducer;