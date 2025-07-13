import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react'; // Added Eye and EyeOff imports
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '../redux/authSlice';

interface LoginFormInput {
    email: string;
    password: string;
}

interface AuthUser {
    _id: string;
    email: string;
    username: string;
}

interface RootState {
    auth: {
        user: AuthUser | null;
    };
}

const Login: React.FC = () => {
    const [input, setInput] = useState<LoginFormInput>({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const { user } = useSelector((store: RootState) => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e: ChangeEvent<HTMLInputElement>): void => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const loginHandler = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post('http://localhost:5000/api/users/login', input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            
            if (res.data.success) {
                dispatch(setAuthUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
                setInput({
                    email: "",
                    password: ""
                });
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            navigate("/home");
        }
    }, [user, navigate]);

    return (
        <div className='flex items-center w-screen h-screen justify-center bg-black'>
            <form 
                onSubmit={loginHandler} 
                className='bg-gray-900 shadow-xl rounded-xl flex flex-col gap-6 p-10 w-full max-w-md border border-gray-800'
            >
                <div className='my-2 text-center'>
                    <h1 className='text-center font-bold text-3xl bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-1'>SNAP_GRAM</h1>
                    <p className='text-sm text-gray-400'>
                        Welcome back to the community
                    </p>
                </div>

                {/* Email Field */}
                <div className='space-y-2'>
                    <label className='font-medium text-gray-300 text-sm'>Email</label>
                    <div className='relative'>
                        <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 h-4 w-4' />
                        <input
                            type="email"
                            name="email"
                            value={input.email}
                            onChange={changeEventHandler}
                            placeholder="Enter your email"
                            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-100 placeholder-gray-500"
                            required
                        />
                    </div>
                </div>

                {/* Password Field */}
                <div className='space-y-2'>
                    <label className='font-medium text-gray-300 text-sm'>Password</label>
                    <div className='relative'>
                        <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 h-4 w-4' />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={input.password}
                            onChange={changeEventHandler}
                            placeholder="Enter your password"
                            className="w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-100 placeholder-gray-500"
                            required
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-500 hover:text-orange-400 transition-colors duration-200"
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type='submit'
                    disabled={loading}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center mt-2 ${
                        loading 
                            ? 'bg-gray-700 cursor-not-allowed text-gray-500' 
                            : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white hover:shadow-orange-500/20 hover:shadow-lg transform hover:-translate-y-0.5'
                    }`}
                >
                    {loading ? (
                        <>
                            <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                            Signing in...
                        </>
                    ) : (
                        'Login'
                    )}
                </button>

                {/* Signup Link */}
                <div className='text-center pt-2'>
                    <span className='text-gray-400 text-sm'>
                        Don't have an account?{' '}
                        <Link 
                            to="/" 
                            className='text-orange-500 hover:text-orange-400 font-medium hover:underline transition-colors duration-200'
                        >
                            Sign Up
                        </Link>
                    </span>
                </div>
            </form>
        </div>
    );
};

export default Login;