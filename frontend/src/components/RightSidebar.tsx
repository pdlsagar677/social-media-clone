import React from 'react'
import { User } from 'lucide-react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import SuggestedUsers from './SuggestedUsers'

interface User {
  _id: string
  username: string
  profilePicture?: string
  bio?: string
  // Add other user properties as needed
}

interface AuthState {
  user: User
}

interface RootState {
  auth: AuthState
}

const RightSidebar: React.FC = () => {
  const { user } = useSelector((store: RootState) => store.auth)
  
  return (
    <div className='w-fit my-10 pr-32'>
      <div className='flex items-center gap-2'>
        <Link to={`/profile/${user?._id}`}>
          <div className="relative">
            {user?.profilePicture ? (
              <img 
                src={user.profilePicture} 
                alt="profile"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
            )}
          </div>
        </Link>
        <div>
          <h1 className='font-semibold text-sm'>
            <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
          </h1>
          <span className='text-gray-600 text-sm'>{user?.bio || 'Bio here...'}</span>
        </div>
      </div>
      <SuggestedUsers />
    </div>
  )
}

export default RightSidebar