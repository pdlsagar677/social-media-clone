import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
  User,
} from "lucide-react";
import CreatePost from "./CreatePost";
import { setAuthUser } from "@/redux/authSlice";
import { setPosts, setSelectedPost } from "@/redux/postSlice";

interface AuthUser {
  _id: string;
  username: string;
  email: string;
  profilePicture?: string;
}

interface Notification {
  userId: string;
  userDetails: {
    username: string;
    profilePicture?: string;
  };
}

interface RootState {
  auth: { user: AuthUser | null };
  realTimeNotification: { likeNotification: Notification[] };
}

const LeftSidebar: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store: RootState) => store.auth);
  const { likeNotification } = useSelector(
    (store: RootState) => store.realTimeNotification || { likeNotification: [] }
  );
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const handleNavClick = (textType: string) => {
    switch (textType) {
      case "Logout":
        logoutHandler();
        break;
      case "Create":
        setOpen(true);
        break;
      case "Profile":
        if (user?._id) {
          navigate(`/profile/${user._id}`);
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
    }
  };

  const navItems = [
    { icon: <Home className="w-5 h-5" />, text: "Home" },
    { icon: <Search className="w-5 h-5" />, text: "Search" },
    { icon: <TrendingUp className="w-5 h-5" />, text: "Explore" },
    { icon: <MessageCircle className="w-5 h-5" />, text: "Messages" },
    { icon: <Heart className="w-5 h-5" />, text: "Notifications" },
    { icon: <PlusSquare className="w-5 h-5" />, text: "Create" },
    {
      icon: user?.profilePicture ? (
        <img
          src={user.profilePicture}
          alt="Profile"
          className="w-6 h-6 rounded-full object-cover"
        />
      ) : (
        <User className="w-5 h-5" />
      ),
      text: "Profile",
    },
    { icon: <LogOut className="w-5 h-5" />, text: "Logout" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800 h-16 px-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center h-full">
          <h1
            className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent cursor-pointer"
            onClick={() => navigate("/")}
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

      {/* Render create post modal outside the header */}
      {open && <CreatePost open={open} setOpen={setOpen} />}
    </>
  );
};

export default LeftSidebar;
