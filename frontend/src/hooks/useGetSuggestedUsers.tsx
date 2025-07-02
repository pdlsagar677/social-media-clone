import { setSuggestedUsers } from "@/redux/authSlice";
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
}

interface SuggestedUsersApiResponse {
  success: boolean;
  users: User[];
  message?: string;
}

const useGetSuggestedUsers = (): void => {
    const dispatch = useDispatch();
    
    useEffect(() => {
        const fetchSuggestedUsers = async (): Promise<void> => {
            try {
                const res: AxiosResponse<SuggestedUsersApiResponse> = await axios.get(
                    'http://localhost:5000/api/user/suggested', 
                    { withCredentials: true }
                );
                if (res.data.success) { 
                    dispatch(setSuggestedUsers(res.data.users));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSuggestedUsers();
    }, [dispatch]);
};

export default useGetSuggestedUsers;