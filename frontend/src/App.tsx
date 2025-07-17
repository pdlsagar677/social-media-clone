import React, { useEffect } from 'react'
import './App.css'
import ChatPage from './components/ChatPage'
import EditProfile from './components/EditProfile'
import Home from './pages/Home'
import Login from './pages/Login'
import MainLayout from './pages/MainLayout'
import Profile from './components/Profile'
import Signup from './pages/Signup'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { io, Socket } from 'socket.io-client'
import { useDispatch, useSelector } from 'react-redux'
import { setSocket } from './redux/socketSlice'
import { setOnlineUsers } from './redux/chatSlice'
import { setLikeNotification } from './redux/rtnSlice'
import ProtectedRoutes from './routes/ProtectedRoutes'

interface User {
  _id: string
  username: string
  // Add other user properties as needed
}

interface AuthState {
  user: User | null
}

interface SocketState {
  socket: Socket | null
}

interface RootState {
  auth: AuthState
  socketio: SocketState
}

interface OnlineUser {
  userId: string
  // Add other online user properties as needed
}

interface Notification {
  id: string
  type: string
  message: string
  // Add other notification properties as needed
}

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoutes><MainLayout /></ProtectedRoutes>,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/home',
        element: <Home />
      },
      {
        path: '/profile/:id',
        element: <Profile />
      },
      {
        path: '/account/edit',
        element: <EditProfile />
      },
      {
        path: '/chat',
        element: <ChatPage />
      },
    ]
  },
 
  {
    path: '/login',
    element: <Login />
  },
   {
    path: '/signup',
    element: <Signup />
  },
])

const App: React.FC = () => {
  const { user } = useSelector((store: RootState) => store.auth)
  const socketState = useSelector((store: RootState) => store.socketio)
  const socket = socketState?.socket || null
  const dispatch = useDispatch()
  
  useEffect(() => {
    if (user) {
      const socketio = io('http://localhost:8000', {
        query: {
          userId: user._id
        },
        transports: ['websocket']
      })
      dispatch(setSocket(socketio))
      
      // listen all the events
      socketio.on('getOnlineUsers', (onlineUsers: OnlineUser[]) => {
        dispatch(setOnlineUsers(onlineUsers))
      })
      
      socketio.on('notification', (notification: Notification) => {
        dispatch(setLikeNotification(notification))
      })
      
      return () => {
        socketio.close()
        dispatch(setSocket(null))
      }
    } else if (socket) {
      socket.close()
      dispatch(setSocket(null))
    }
  }, [user, dispatch, socket])
  
  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  )
}

export default App