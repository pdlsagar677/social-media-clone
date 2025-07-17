import React from 'react';
import './App.css';
import { Toaster } from 'sonner';
import Mainlayout from './pages/MainLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Profile from './components/Profile';
import ChatPage from './components/ChatPage';
import CreatePost from './components/CreatePost';
import CommentDialog from './components/CommentDialog';
import Home from './pages/MainLayout';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
       <Route path="/home" element={<Home />} />

       <Route path="/mainlayout" element={<Mainlayout />} />
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/chatpage" element={<ChatPage />} />
        <Route path="/createpost" element={<CreatePost />} />
        <Route path="/commentdialog" element={<CommentDialog />} />
      </Routes>
      <Toaster position="top-center" richColors />
    </BrowserRouter>
  );
};

export default App;