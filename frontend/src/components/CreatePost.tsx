import React, { useRef, useState } from 'react';
import { Loader2, ImagePlus, X } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '../redux/postSlice';
import { readFileAsDataURL } from '../lib/utils';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  username?: string;
  profilePicture?: string;
}

interface Post {
  _id: string;
  image?: string;
  caption?: string;
  likes: string[];
  comments: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  suggestedUsers: User[];
  userProfile: User | null;
  selectedUser: User | null;
}

interface PostState {
  posts: Post[];
}

interface RootState {
  auth: AuthState;
  post: PostState;
}

interface CreatePostProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreatePost: React.FC<CreatePostProps> = ({ open, setOpen }) => {
  const imageRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((store: RootState) => store.auth);
  // Safely destructure posts, providing an empty array as a fallback
  const { posts = [] } = useSelector((store: RootState) => store.post || {});
  const dispatch = useDispatch();

  const fileChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const dataUrl = await readFileAsDataURL(selectedFile);
      setImagePreview(dataUrl);
    }
  };

  const createPostHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("caption", caption);
    if (file) formData.append("image", file);

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5000/api/post/addpost', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });

      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]));
        toast.success("Post created successfully!");
        setOpen(false);
        setFile(null);
        setCaption("");
        setImagePreview("");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <X
            className="h-6 w-6 text-gray-400 hover:text-orange-500 cursor-pointer"
            onClick={() => setOpen(false)}
          />
          <h2 className="text-xl font-bold text-center text-gray-200">Create Post</h2>
          <div className="w-6"></div>
        </div>

        <div className="flex gap-3 items-center mb-4">
          <div className="h-10 w-10 rounded-full bg-gray-800 border border-orange-500 flex items-center justify-center overflow-hidden">
            {user?.profilePicture || user?.avatar ? (
              <img src={user.profilePicture || user.avatar} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <span className="text-gray-300 font-medium">
                {user?.username?.charAt(0).toUpperCase() || user?.name?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <p className="font-semibold text-gray-200">{user?.username || user?.name || 'Guest'}</p>
            <p className="text-xs text-gray-400">Share your moment</p>
          </div>
        </div>

        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4"
          placeholder="Write a caption..."
          rows={3}
        />

        {imagePreview && (
          <div className="mb-4 rounded-lg overflow-hidden border border-gray-700">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-64 object-contain bg-gray-800"
            />
          </div>
        )}

        <input
          ref={imageRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={fileChangeHandler}
        />

        <div className="flex flex-col gap-3">
          <button
            onClick={() => imageRef.current?.click()}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white py-2 px-4 rounded-lg font-medium"
          >
            <ImagePlus className="h-5 w-5" />
            Select Image
          </button>

          {imagePreview && (
            <button
              onClick={createPostHandler}
              disabled={loading}
              className={`flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white py-2 px-4 rounded-lg font-medium ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Posting...
                </>
              ) : (
                'Share Post'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePost;