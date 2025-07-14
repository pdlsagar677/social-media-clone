import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Home, 
  Search, 
  TrendingUp, 
  MessageCircle, 
  Heart, 
  PlusSquare, 
  LogOut 
} from 'lucide-react';
import { setAuthUser } from '../redux/authSlice';
import { setPosts, setSelectedPost } from '../redux/postSlice';

interface AuthUser {
  _id: string;
  email: string;
  username: string;
}

interface Post {
  _id: string;
  caption: string;
  imageUrl: string;
  userId: string;
}

interface RealTimeNotificationState {
  likeNotification: any[];
}

interface AuthState {
  user: AuthUser | null;
}

interface PostState {
  posts: Post[];
  selectedPost: Post | null;
}

interface RootState {
  auth: AuthState;
  realTimeNotification?: RealTimeNotificationState; // Make optional to handle cases where it might be undefined
  post: PostState;
}

interface SidebarItem {
  icon: React.ReactNode;
  text: string;
}

const LeftSidebar: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useSelector((store: RootState) => store.auth);
    // Safely access likeNotification, providing a default empty array if realTimeNotification is undefined
    const { likeNotification } = useSelector((store: RootState) => store.realTimeNotification || { likeNotification: [] });
    const dispatch = useDispatch();

    const logoutHandler = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/user/logout', { 
                withCredentials: true 
            });
            if (res.data.success) {
                dispatch(setAuthUser(null));
                dispatch(setSelectedPost(null));
                dispatch(setPosts([]));
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error: any) {
            console.error("Logout error:", error);
            toast.error(error.response?.data?.message || "Logout failed");
        }
    };

    const handleNavClick = (textType: string) => {
        switch(textType) {
            case 'Logout':
                logoutHandler();
                break;
            case "Create":
                console.log("Open create post modal"); 
                break;
            case "Profile":
                if (user && user._id) {
                    navigate(`/profile/${user._id}`);
                } else {
                    toast.error("User profile not available. Please log in.");
                    navigate("/login");
                }
                break;
            case "Home":
                navigate("/");
                break;
            case "Messages":
                navigate("/chat");
                break;
            case "Search":
                console.log("Open search functionality");
                break;
            case "Explore":
                console.log("Navigate to explore page");
                break;
            case "Notifications":
                console.log("Navigate to notifications page");
                break;
            default:
                break;
        }
    };

    const navItems: SidebarItem[] = [
        { icon: <Home className="w-5 h-5" />, text: "Home" },
        { icon: <Search className="w-5 h-5" />, text: "Search" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Explore" },
        { icon: <MessageCircle className="w-5 h-5" />, text: "Messages" },
        { icon: <Heart className="w-5 h-5" />, text: "Notifications" },
        { icon: <PlusSquare className="w-5 h-5" />, text: "Create" },
        { 
            icon: (
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white text-xs font-bold">
                    {user?.username?.charAt(0).toUpperCase() || '?'}
                </div>
            ), 
            text: "Profile" 
        },
        { icon: <LogOut className="w-5 h-5" />, text: "Logout" },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800 h-16 px-4">
            <div className="max-w-6xl mx-auto flex justify-between items-center h-full">
                <h1 
                    className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent cursor-pointer"
                    onClick={() => navigate('/')}
                >
                    SNAP_GRAM
                </h1>

                <nav className="flex items-center gap-6">
                    {navItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => handleNavClick(item.text)}
                            className="relative p-2 rounded-lg hover:bg-gray-800 transition-colors group focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                            aria-label={item.text}
                        >
                            <div className="text-gray-300 group-hover:text-orange-500 transition-colors">
                                {item.icon}
                            </div>
                            
                            {item.text === "Notifications" && likeNotification.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                                    {likeNotification.length}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>
            </div>
        </header>
    );
};

export default LeftSidebar;
