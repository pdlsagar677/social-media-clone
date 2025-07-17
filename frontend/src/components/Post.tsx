import React, { useState } from 'react'
import { Bookmark, MessageCircle, MoreHorizontal, Send, Heart, User, X } from 'lucide-react'
import CommentDialog from './CommentDialog'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { setPosts, setSelectedPost } from '@/redux/postSlice'

interface Author {
    _id: string
    username: string
    profilePicture?: string
}

interface Comment {
    _id: string
    author: Author
    text: string
    createdAt: string
}

interface Post {
    _id: string
    image: string
    caption: string
    author: Author
    likes: string[]
    comments: Comment[]
}

interface User {
    _id: string
    username: string
    profilePicture?: string
}

interface PostState {
    posts: Post[]
    selectedPost: Post | null
}

interface AuthState {
    user: User | null
}

interface RootState {
    auth: AuthState
    post: PostState
}

interface PostProps {
    post: Post
}

const Post: React.FC<PostProps> = ({ post }) => {
    const [text, setText] = useState<string>("")
    const [open, setOpen] = useState<boolean>(false)
    const [showMoreOptions, setShowMoreOptions] = useState<boolean>(false)
    
    const user = useSelector((store: RootState) => store.auth?.user)
    const posts = useSelector((store: RootState) => store.post?.posts || [])
    
    const [liked, setLiked] = useState<boolean>(post.likes.includes(user?._id || '') || false)
    const [postLike, setPostLike] = useState<number>(post.likes.length)
    const [comment, setComment] = useState<Comment[]>(post.comments)
    const dispatch = useDispatch()

    const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputText = e.target.value
        if (inputText.trim()) {
            setText(inputText)
        } else {
            setText("")
        }
    }

    const likeOrDislikeHandler = async () => {
        try {
            const action = liked ? 'dislike' : 'like'
            const res = await axios.get(`http://localhost:5000/api/post/${post._id}/${action}`, { withCredentials: true })
            console.log(res.data)
            if (res.data.success) {
                const updatedLikes = liked ? postLike - 1 : postLike + 1
                setPostLike(updatedLikes)
                setLiked(!liked)

                // Update post data
                const updatedPostData = posts.map(p =>
                    p._id === post._id ? {
                        ...p,
                        likes: liked ? p.likes.filter(id => id !== user?._id) : [...p.likes, user?._id || '']
                    } : p
                )
                dispatch(setPosts(updatedPostData))
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const commentHandler = async () => {
        try {
            const res = await axios.post(`https://localhost:5000/api/post/${post._id}/comment`, { text }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            })
            console.log(res.data)
            if (res.data.success) {
                const updatedCommentData = [...comment, res.data.comment]
                setComment(updatedCommentData)

                const updatedPostData = posts.map(p =>
                    p._id === post._id ? { ...p, comments: updatedCommentData } : p
                )

                dispatch(setPosts(updatedPostData))
                toast.success(res.data.message)
                setText("")
            }
        } catch (error) {
            console.log(error)
        }
    }

    const deletePostHandler = async () => {
        try {
            const res = await axios.delete(`https://localhost:5000/api/post/delete/${post?._id}`, { withCredentials: true })
            if (res.data.success) {
                const updatedPostData = posts.filter((postItem) => postItem?._id !== post?._id)
                dispatch(setPosts(updatedPostData))
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error((error as any).response?.data?.message || 'Error deleting post')
        }
    }

    const bookmarkHandler = async () => {
        try {
            const res = await axios.get(`https://localhost:5000/api/post/${post?._id}/bookmark`, { withCredentials: true })
            if (res.data.success) {
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='my-8 w-full max-w-sm mx-auto'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <div className='w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden'>
                        {post.author?.profilePicture ? (
                            <img 
                                src={post.author.profilePicture} 
                                alt={`${post.author.username}'s profile`}
                                className='w-full h-full object-cover'
                            />
                        ) : (
                            <User className='w-4 h-4 text-gray-500' />
                        )}
                    </div>
                    <div className='flex items-center gap-3'>
                        <h1 className='font-medium'>{post.author?.username}</h1>
                        {user?._id === post.author._id && (
                            <span className='px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full'>Author</span>
                        )}
                    </div>
                </div>
                
                <div className='relative'>
                    <MoreHorizontal 
                        className='cursor-pointer hover:text-gray-600' 
                        onClick={() => setShowMoreOptions(!showMoreOptions)}
                    />
                    {showMoreOptions && (
                        <div className='absolute right-0 top-8 bg-white shadow-lg rounded-lg border z-10 min-w-[150px]'>
                            {post?.author?._id !== user?._id && (
                                <div className='cursor-pointer w-full text-[#ED4956] font-bold p-3 hover:bg-gray-50 text-sm text-center'>
                                    Unfollow
                                </div>
                            )}
                            <div className='cursor-pointer w-full p-3 hover:bg-gray-50 text-sm text-center'>
                                Add to favorites
                            </div>
                            {user && user?._id === post?.author._id && (
                                <div 
                                    onClick={deletePostHandler} 
                                    className='cursor-pointer w-full p-3 hover:bg-gray-50 text-sm text-center text-red-600'
                                >
                                    Delete
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            
            <img
                className='rounded-sm my-2 w-full aspect-square object-cover'
                src={post.image}
                alt="post_img"
            />

            <div className='flex items-center justify-between my-2'>
                <div className='flex items-center gap-3'>
                    <Heart 
                        onClick={likeOrDislikeHandler}
                        className={`cursor-pointer hover:text-gray-600 ${liked ? 'fill-red-500 text-red-500' : ''}`}
                        size={24}
                    />
                    <MessageCircle 
                        onClick={() => {
                            dispatch(setSelectedPost(post))
                            setOpen(true)
                        }} 
                        className='cursor-pointer hover:text-gray-600' 
                        size={24}
                    />
                    <Send className='cursor-pointer hover:text-gray-600' size={24} />
                </div>
                <Bookmark 
                    onClick={bookmarkHandler} 
                    className='cursor-pointer hover:text-gray-600' 
                    size={24}
                />
            </div>
            
            <span className='font-medium block mb-2'>{postLike} likes</span>
            <p>
                <span className='font-medium mr-2'>{post.author?.username}</span>
                {post.caption}
            </p>
            
            {comment.length > 0 && (
                <span 
                    onClick={() => {
                        dispatch(setSelectedPost(post))
                        setOpen(true)
                    }} 
                    className='cursor-pointer text-sm text-gray-400'
                >
                    View all {comment.length} comments
                </span>
            )}
            
            <CommentDialog open={open} setOpen={setOpen} />
            
            <div className='flex items-center justify-between mt-2'>
                <input
                    type="text"
                    placeholder='Add a comment...'
                    value={text}
                    onChange={changeEventHandler}
                    className='outline-none text-sm w-full p-2 border-b border-gray-200 focus:border-gray-400'
                />
                {text && (
                    <span 
                        onClick={commentHandler} 
                        className='text-[#3BADF8] cursor-pointer font-medium ml-2'
                    >
                        Post
                    </span>
                )}
            </div>
        </div>
    )
}

export default Post