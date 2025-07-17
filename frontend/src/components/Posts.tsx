import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux'

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

interface PostState {
    posts: Post[]
    selectedPost: Post | null
}

interface RootState {
    post: PostState
}

const Posts: React.FC = () => {
    const posts = useSelector((store: RootState) => store.post?.posts || [])
    
    return (
        <div>
            {posts.length > 0 ? (
                posts.map((post) => <Post key={post._id} post={post} />)
            ) : (
                <div className="text-center text-gray-500 py-8">
                    No posts available
                </div>
            )}
        </div>
    )
}

export default Posts