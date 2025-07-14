import { setUserProfile } from "../redux/authSlice";
import axios, { AxiosResponse } from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

// Types for the hook
interface User {
  _id: string;
  id: string;
  name: string;
  email: string;
  avatar?: string;
  username?: string;
  bio?: string;
  followers?: string[];
  following?: string[];
  posts?: string[];
}

interface UserProfileApiResponse {
  success: boolean;
  user: User;
  message?: string;
}

interface UseGetUserProfileProps {
  userId: string | undefined;
}

const useGetUserProfile = (userId: string | undefined): void => {
    const dispatch = useDispatch();
    
    useEffect(() => {
        const fetchUserProfile = async (): Promise<void> => {
            try {
                const res: AxiosResponse<UserProfileApiResponse> = await axios.get(
                    `http://localhost:5000/api/users/:id/profile`, 
                    { withCredentials: true }
                );
                if (res.data.success) { 
                    dispatch(setUserProfile(res.data.user));
                }
            } catch (error) {
                console.log(error);
            }
        }
        
        if (userId) {
            fetchUserProfile();
        }
    }, [userId, dispatch]);
};

export default useGetUserProfile;