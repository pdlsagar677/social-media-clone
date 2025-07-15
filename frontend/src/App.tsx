import './App.css';
import { Toaster } from 'sonner';
 import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Profile from './components/Profile';
import ChatPage from './components/ChatPage';
import CreatePost from './components/CreatePost';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />

        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/chatpage" element={<ChatPage />} />
        <Route path="/createpost" element={<CreatePost />} />


      </Routes>
            <Toaster position="top-center" richColors />

    </BrowserRouter>
  );
}       

export default App;
