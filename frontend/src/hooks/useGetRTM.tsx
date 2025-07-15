import { setMessages } from "../redux/chatSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// Types for the hook
interface Message {
  _id: string;
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date | string;
  createdAt?: Date | string;
}

interface Socket {
  on: (event: string, callback: (data: any) => void) => void;
  off: (event: string) => void;
  emit: (event: string, data?: any) => void;
}

interface RootState {
  chat: {
    messages: Message[];
    onlineUsers: any[];
  };
  socketio: {
    socket: Socket | null;
  };
}

const useGetRTM = (): void => {
    const dispatch = useDispatch();
    const { socket } = useSelector((store: RootState) => store.socketio);
    const { messages } = useSelector((store: RootState) => store.chat);
    
    useEffect(() => {
        const handleNewMessage = (newMessage: Message): void => {
            dispatch(setMessages([...messages, newMessage]));
        };

        socket?.on('newMessage', handleNewMessage);
        
        return () => {
            socket?.off('newMessage');
        }
    }, [messages, dispatch, socket]);
};

export default useGetRTM;