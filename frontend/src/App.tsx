import './App.css';
import { Toaster } from 'sonner';
 import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />

        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />

      </Routes>
            <Toaster position="top-center" richColors />

    </BrowserRouter>
  );
}       

export default App;
