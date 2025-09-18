import React, { useEffect } from 'react';
import './App.css';
import ChatPage from './components/ChatPage';
import EditProfile from './components/EditProfile';
import Home from './pages/Home';
import Login from './pages/Login';
import MainLayout from './pages/MainLayout';
import Profile from './components/Profile';
import Signup from './pages/Signup';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { setOnlineUsers, User as ChatUser } from './redux/chatSlice'; 
import { setLikeNotification, LikeNotification } from './redux/rtnSlice'; 
import ProtectedRoutes from './routes/ProtectedRoutes';

interface AuthUser {
  _id: string;
  username: string;
}

interface AuthState {
  user: AuthUser | null;
}

interface RootState {
  auth: AuthState;
}

const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoutes>
        <MainLayout />
      </ProtectedRoutes>
    ),
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/home',
        element: <Home />,
      },
      {
        path: '/profile/:id',
        element: <Profile />,
      },
      {
        path: '/account/edit',
        element: <EditProfile />,
      },
      {
        path: '/chat',
        element: <ChatPage />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
]);

const App: React.FC = () => {
  const { user } = useSelector((store: RootState) => store.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const socketio: Socket = io('http://localhost:5000', {
        query: {
          userId: user._id,
        },
        transports: ['websocket'],
      });

      socketio.on('getOnlineUsers', (onlineUsers: ChatUser[]) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketio.on('notification', (notification: LikeNotification) => {
        dispatch(setLikeNotification(notification));
      });

      return () => {
        socketio.close();
      };
    }
  }, [user, dispatch]);

  return <RouterProvider router={browserRouter} />;
};

export default App;
