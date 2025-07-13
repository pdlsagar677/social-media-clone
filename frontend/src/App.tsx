import './App.css';
import { Toaster } from 'sonner';
 import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
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
