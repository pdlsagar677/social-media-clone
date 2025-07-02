import { setMessages } from "@/redux/chatSlice";
import axios, { AxiosResponse } from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// Types for the hook
interface User {
  _id: string;
  id: string;
  name: string;
  email: string;
  avatar?: string;
  username?: string;
}

interface Message {
  _id: string;
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date | string;
  createdAt?: Date | string;
}

interface MessageApiResponse {
  success: boolean;
  messages: Message[];
  message?: string;
}

interface RootState {
  auth: {
    user: User | null;
    selectedUser: User | null;
    suggestedUsers: User[];
    userProfile: User | null;
  };
  chat: {
    messages: Message[];
    onlineUsers: User[];
  };
  socketio: {
    socket: any;
  };
}

const useGetAllMessage = (): void => {
    const dispatch = useDispatch();
    const { selectedUser } = useSelector((store: RootState) => store.auth);
    
    useEffect(() => {
        const fetchAllMessage = async (): Promise<void> => {
            try {
                const res: AxiosResponse<MessageApiResponse> = await axios.get(
                    `http://localhost:5000/api/message/all/${selectedUser?._id}`, 
                    { withCredentials: true }
                );
                if (res.data.success) {  
                    dispatch(setMessages(res.data.messages));
                }
            } catch (error) {
                console.log(error);
            }
        }
        
        if (selectedUser?._id) {
            fetchAllMessage();
        }
    }, [selectedUser, dispatch]);
};

export default useGetAllMessage;