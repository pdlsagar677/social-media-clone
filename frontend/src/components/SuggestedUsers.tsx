import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { User } from 'lucide-react'

interface SuggestedUser {
  _id: string
  username: string
  profilePicture?: string
  bio?: string
  // Add other user properties as needed
}

interface AuthState {
  suggestedUsers: SuggestedUser[]
}

interface RootState {
  auth: AuthState
}

const SuggestedUsers: React.FC = () => {
  const { suggestedUsers } = useSelector((store: RootState) => store.auth)

  return (
    <div className='my-10'>
      <div className='flex items-center justify-between text-sm'>
        <h1 className='font-semibold text-gray-600'>Suggested for you</h1>
        <span className='font-medium cursor-pointer'>See All</span>
      </div>
      {
        suggestedUsers.map((user) => {
          return (
            <div key={user._id} className='flex items-center justify-between my-5'>
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
              <span className='text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6]'>
                Follow
              </span>
            </div>
          )
        })
      }
    </div>
  )
}

export default SuggestedUsers