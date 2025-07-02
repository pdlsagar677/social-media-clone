import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useSelector } from 'react-redux';

// Types
interface SignupInput {
    username: string;
    email: string;
    password: string;
}

interface User {
    id: string;
    username: string;
    email: string;
    avatar?: string;
}

interface RootState {
    auth: {
        user: User | null;
        suggestedUsers: User[];
        userProfile: User | null;
        selectedUser: User | null;
    };
}

interface SignupApiResponse {
    success: boolean;
    message: string;
    user?: User;
}

interface ApiErrorResponse {
    message: string;
}

const Signup: React.FC = () => {
    const [input, setInput] = useState<SignupInput>({
        username: "",
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    
    // Add error handling for useSelector
    const user = useSelector((store: RootState) => store.auth?.user);
    const navigate = useNavigate();

    const changeEventHandler = (e: ChangeEvent<HTMLInputElement>): void => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const signupHandler = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        
        // Basic validation
        if (!input.username || !input.email || !input.password) {
            toast.error('Please fill in all fields');
            return;
        }

        if (input.password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }

        try {
            setLoading(true);
            const res: AxiosResponse<SignupApiResponse> = await axios.post(
                'http://localhost:5000/api/users/register', 
                input, 
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );
            
            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
                setInput({
                    username: "",
                    email: "",
                    password: ""
                });
            }
        } catch (error) {
            console.log(error);
            const axiosError = error as AxiosError<ApiErrorResponse>;
            const errorMessage = axiosError.response?.data?.message || 'Something went wrong';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = (): void => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <div className='flex items-center w-screen h-screen justify-center bg-gray-50'>
            <form 
                onSubmit={signupHandler} 
                className='bg-white shadow-lg rounded-lg flex flex-col gap-5 p-8 w-full max-w-md border border-gray-200'
            >
                <div className='my-4'>
                    <h1 className='text-center font-bold text-2xl text-gray-800 mb-2'>LOGO</h1>
                    <p className='text-sm text-center text-gray-600'>
                        Signup to see photos & videos from your friends
                    </p>
                </div>

                <div className='space-y-1'>
                    <label className='font-medium text-gray-700 text-sm'>Username</label>
                    <div className='relative'>
                        <User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                        <input
                            type="text"
                            name="username"
                            value={input.username}
                            onChange={changeEventHandler}
                            placeholder="Enter your username"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            required
                        />
                    </div>
                </div>

                <div className='space-y-1'>
                    <label className='font-medium text-gray-700 text-sm'>Email</label>
                    <div className='relative'>
                        <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                        <input
                            type="email"
                            name="email"
                            value={input.email}
                            onChange={changeEventHandler}
                            placeholder="Enter your email"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            required
                        />
                    </div>
                </div>

                <div className='space-y-1'>
                    <label className='font-medium text-gray-700 text-sm'>Password</label>
                    <div className='relative'>
                        <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={input.password}
                            onChange={changeEventHandler}
                            placeholder="Enter your password"
                            className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            required
                            minLength={6}
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
                </div>

                <button
                    type='submit'
                    disabled={loading}
                    className={`w-full py-2 px-4 rounded-md font-medium transition-all duration-200 flex items-center justify-center ${
                        loading 
                            ? 'bg-gray-400 cursor-not-allowed text-white' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md transform hover:-translate-y-0.5'
                    }`}
                >
                    {loading ? (
                        <>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Please wait...
                        </>
                    ) : (
                        'Sign Up'
                    )}
                </button>

                <div className='text-center'>
                    <span className='text-gray-600 text-sm'>
                        Already have an account?{' '}
                        <Link 
                            to="/login" 
                            className='text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200'
                        >
                            Login
                        </Link>
                    </span>
                </div>
            </form>
        </div>
    );
};

export default Signup;