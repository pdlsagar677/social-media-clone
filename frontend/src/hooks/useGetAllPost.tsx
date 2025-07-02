import { setPosts } from "@/redux/postSlice";
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

interface Comment {
  _id: string;
  id: string;
  userId: string;
  content: string;
  createdAt: Date | string;
  user?: User;
}

interface Post {
  _id: string;
  id: string;
  userId: string;
  content: string;
  image?: string;
  likes: string[];
  comments: Comment[];
  createdAt: Date | string;
  updatedAt?: Date | string;
  user?: User;
}

interface PostApiResponse {
  success: boolean;
  posts: Post[];
  message?: string;
}

const useGetAllPost = (): void => {
    const dispatch = useDispatch();
    
    useEffect(() => {
        const fetchAllPost = async (): Promise<void> => {
            try {
                const res: AxiosResponse<PostApiResponse> = await axios.get(
                    'http://localhost:5000/api/post/all', 
                    { withCredentials: true }
                );
                if (res.data.success) { 
                    console.log(res.data.posts);
                    dispatch(setPosts(res.data.posts));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllPost();
    }, [dispatch]);
};

export default useGetAllPost;