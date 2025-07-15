import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MessageCircle, Send } from 'lucide-react';
import { setSelectedUser } from '../redux/authSlice';
import { setMessages } from '../redux/chatSlice';
import axios from 'axios';
import { RootState } from '../redux/store';

interface User {
  id: string;
  username: string;
  name?: string;
  profilePicture?: string;
}

interface Message {
  _id: string;
  sender: string;
  text: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  suggestedUsers: User[];
  selectedUser: User | null;
}

interface ChatState {
  onlineUsers: string[];
  messages: Message[];
}

const ChatPage: React.FC = () => {
    const [textMessage, setTextMessage] = useState<string>("");
    const { user, suggestedUsers, selectedUser } = useSelector((store: RootState) => store.auth);
    const { onlineUsers, messages } = useSelector((store: RootState) => store.chat);
    const dispatch = useDispatch();

    const sendMessageHandler = async (receiverId: string) => {
        if (!textMessage.trim()) return;

        try {
            const res = await axios.post(`http://localhost:5000/api/message/send/${receiverId}`,
                { textMessage },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );
            if (res.data.success && res.data.newMessage) {
                dispatch(setMessages([...messages, res.data.newMessage as Message]));
                setTextMessage("");
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    useEffect(() => {
        return () => {
            dispatch(setSelectedUser(null));
        };
    }, [dispatch]);

    return (
        <div className='flex ml-[16%] h-screen bg-gray-100'>
            <section className='w-full md:w-1/4 my-8 bg-white rounded-lg shadow-sm overflow-hidden'>
                <h1 className='font-bold mb-4 px-3 text-xl p-4 border-b'>{user?.username || user?.name || 'Your Chats'}</h1>
                <div className='overflow-y-auto h-[80vh]'>
                    {suggestedUsers && suggestedUsers.length > 0 ? (
                        suggestedUsers.map((suggestedUser) => {
                            const isOnline = onlineUsers.includes(suggestedUser.id);
                            return (
                                <div
                                    key={suggestedUser.id}
                                    onClick={() => dispatch(setSelectedUser(suggestedUser))}
                                    className='flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer border-b'
                                >
                                    <div className='relative'>
                                        <div className='w-14 h-14 rounded-full overflow-hidden bg-gray-200'>
                                            {suggestedUser.profilePicture || suggestedUser.avatar ? (
                                                <img
                                                    src={suggestedUser.profilePicture || suggestedUser.avatar}
                                                    alt={suggestedUser.username || suggestedUser.name || 'User'}
                                                    className='w-full h-full object-cover'
                                                />
                                            ) : (
                                                <div className='w-full h-full flex items-center justify-center text-gray-500'>
                                                    {suggestedUser.username?.charAt(0).toUpperCase() || suggestedUser.name?.charAt(0).toUpperCase() || 'U'}
                                                </div>
                                            )}
                                        </div>
                                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                    </div>
                                    <div className='flex flex-col'>
                                        <span className='font-medium'>{suggestedUser.username || suggestedUser.name || 'Unknown User'}</span>
                                        <span className={`text-xs font-bold ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                                            {isOnline ? 'online' : 'offline'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className='p-4 text-center text-gray-500'>No suggested users.</div>
                    )}
                </div>
            </section>

            {selectedUser ? (
                <section className='flex-1 flex flex-col h-full bg-white rounded-lg shadow-sm ml-4'>
                    <div className='flex gap-3 items-center px-4 py-3 border-b sticky top-0 bg-white z-10'>
                        <div className='w-10 h-10 rounded-full overflow-hidden bg-gray-200'>
                            {selectedUser.profilePicture || selectedUser.avatar ? (
                                <img
                                    src={selectedUser.profilePicture || selectedUser.avatar}
                                    alt={selectedUser.username || selectedUser.name || 'User'}
                                    className='w-full h-full object-cover'
                                />
                            ) : (
                                <div className='w-full h-full flex items-center justify-center text-gray-500'>
                                    {selectedUser.username?.charAt(0).toUpperCase() || selectedUser.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                            )}
                        </div>
                        <div className='flex flex-col'>
                            <span className='font-medium'>{selectedUser.username || selectedUser.name || 'Unknown User'}</span>
                        </div>
                    </div>

                    <div className='flex-1 overflow-y-auto p-4 space-y-2'>
                        {messages && messages.length > 0 ? (
                            messages.map((message) => (
                                <div
                                    key={message._id}
                                    className={`flex ${message.sender === user?.id ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`rounded-lg py-2 px-3 max-w-xs ${message.sender === user?.id ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                                        {message.text}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className='p-4 text-center text-gray-500'>No messages yet. Start the conversation!</div>
                        )}
                    </div>

                    <div className='flex items-center p-4 border-t'>
                        <input
                            value={textMessage}
                            onChange={(e) => setTextMessage(e.target.value)}
                            onKeyPress={(e) => selectedUser && e.key === 'Enter' && sendMessageHandler(selectedUser.id)}
                            type="text"
                            className='flex-1 mr-2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                            placeholder="Type a message..."
                        />
                        <button
                            onClick={() => selectedUser && sendMessageHandler(selectedUser.id)}
                            disabled={!textMessage.trim()}
                            className='bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg flex items-center justify-center disabled:opacity-50'
                        >
                            <Send className='w-5 h-5' />
                        </button>
                    </div>
                </section>
            ) : (
                <div className='flex-1 flex flex-col items-center justify-center mx-auto bg-white rounded-lg shadow-sm ml-4'>
                    <MessageCircle className='w-32 h-32 my-4 text-gray-300' />
                    <h1 className='font-medium text-xl text-gray-700'>Your messages</h1>
                    <span className='text-gray-500'>Send a message to start a chat.</span>
                </div>
            )}
        </div>
    );
};

export default ChatPage;