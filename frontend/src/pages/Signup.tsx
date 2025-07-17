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
                navigate("/home"); // Changed from "/" to "/home"
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
            navigate("/home"); // Changed from "/" to "/home"
        }
    }, [user, navigate]);

    return (
  <div className='flex items-center w-screen h-screen justify-center bg-black'>
    <form 
        onSubmit={signupHandler} 
        className='bg-gray-900 shadow-xl rounded-xl flex flex-col gap-6 p-10 w-full max-w-md border border-gray-800'
    >
        <div className='my-2 text-center'>
            <h1 className='text-center font-bold text-3xl bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-1'>SNAP_GRAM</h1>
            <p className='text-sm text-gray-400'>
                Join the community
            </p>
        </div>

        {/* Google Login Button */}
        <button
            type="button"
            onClick={() => {/* Add your Google auth handler here */}}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-gray-700 bg-gray-800 hover:bg-gray-750 transition-colors duration-200"
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                <path 
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" 
                    fill="#4285F4"
                />
                <path 
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" 
                    fill="#34A853"
                />
                <path 
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" 
                    fill="#FBBC05"
                />
                <path 
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" 
                    fill="#EA4335"
                />
            </svg>
            <span className='text-gray-200 font-medium'>Continue with Google</span>
        </button>

        <div className='flex items-center my-2'>
            <div className='flex-1 h-px bg-gray-700'></div>
            <span className='px-4 text-sm text-gray-500'>OR</span>
            <div className='flex-1 h-px bg-gray-700'></div>
        </div>

        {/* Username Field */}
        <div className='space-y-2'>
            <label className='font-medium text-gray-300 text-sm'>Username</label>
            <div className='relative'>
                <User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 h-4 w-4' />
                <input
                    type="text"
                    name="username"
                    value={input.username}
                    onChange={changeEventHandler}
                    placeholder="Enter your username"
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-100 placeholder-gray-500"
                    required
                />
            </div>
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
                    minLength={6}
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
            <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
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
                    Creating account...
                </>
            ) : (
                'Sign Up Now'
            )}
        </button>

        {/* Login Link */}
        <div className='text-center pt-2'>
            <span className='text-gray-400 text-sm'>
                Already registered?{' '}
                <Link 
                    to="/login" 
                    className='text-orange-500 hover:text-orange-400 font-medium hover:underline transition-colors duration-200'
                >
                    Sign In
                </Link>
            </span>
        </div>
    </form>
</div>
    );
};

export default Signup;