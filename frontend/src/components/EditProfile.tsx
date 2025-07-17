import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { User, Loader2, ChevronDown } from 'lucide-react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { setAuthUser } from '@/redux/authSlice'

interface User {
  _id: string
  username: string
  profilePicture?: string
  bio?: string
  gender?: string
}

interface AuthState {
  user: User | null
}

interface RootState {
  auth: AuthState
}

interface EditProfileInput {
  profilePhoto: File | string | undefined
  bio: string
  gender: string
}

const EditProfile: React.FC = () => {
  const imageRef = useRef<HTMLInputElement>(null)
  const { user } = useSelector((store: RootState) => store.auth)
  const [loading, setLoading] = useState<boolean>(false)
  const [input, setInput] = useState<EditProfileInput>({
    profilePhoto: user?.profilePicture,
    bio: user?.bio || '',
    gender: user?.gender || 'male'
  })
  const [isGenderOpen, setIsGenderOpen] = useState<boolean>(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setInput({ ...input, profilePhoto: file })
  }

  const selectChangeHandler = (value: string) => {
    setInput({ ...input, gender: value })
    setIsGenderOpen(false)
  }

  const editProfileHandler = async () => {
    console.log(input)
    const formData = new FormData()
    formData.append('bio', input.bio)
    formData.append('gender', input.gender)
    if (input.profilePhoto && input.profilePhoto instanceof File) {
      formData.append('profilePhoto', input.profilePhoto)
    }
    try {
      setLoading(true)
      const res = await axios.post('http://localhost:5000/api/user/profile/edit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      })
      if (res.data.success) {
        const updatedUserData = {
          ...user,
          bio: res.data.user?.bio,
          profilePicture: res.data.user?.profilePicture,
          gender: res.data.user.gender
        }
        dispatch(setAuthUser(updatedUserData))
        navigate(`/profile/${user?._id}`)
        toast.success(res.data.message)
      }
    } catch (error: any) {
      console.log(error)
      toast.error(error.response?.data?.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex max-w-2xl mx-auto pl-10'>
      <section className='flex flex-col gap-6 w-full my-8'>
        <h1 className='font-bold text-xl'>Edit Profile</h1>
        <div className='flex items-center justify-between bg-gray-100 rounded-xl p-4'>
          <div className='flex items-center gap-3'>
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
            <div>
              <h1 className='font-bold text-sm'>{user?.username}</h1>
              <span className='text-gray-600'>{user?.bio || 'Bio here...'}</span>
            </div>
          </div>
          <input 
            ref={imageRef} 
            onChange={fileChangeHandler} 
            type='file' 
            className='hidden' 
            accept='image/*'
          />
          <button 
            onClick={() => imageRef?.current?.click()} 
            className='bg-[#0095F6] text-white px-4 py-2 rounded-md h-8 hover:bg-[#318bc7] text-sm font-medium'
          >
            Change photo
          </button>
        </div>
        <div>
          <h1 className='font-bold text-xl mb-2'>Bio</h1>
          <textarea 
            value={input.bio} 
            onChange={(e) => setInput({ ...input, bio: e.target.value })} 
            name='bio' 
            className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Tell us about yourself..."
          />
        </div>
        <div>
          <h1 className='font-bold mb-2'>Gender</h1>
          <div className="relative">
            <button
              onClick={() => setIsGenderOpen(!isGenderOpen)}
              className="w-full p-3 border border-gray-300 rounded-md bg-white text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span className="capitalize">{input.gender}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isGenderOpen ? 'rotate-180' : ''}`} />
            </button>
            {isGenderOpen && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md mt-1 shadow-lg z-10">
                <button
                  onClick={() => selectChangeHandler('male')}
                  className="w-full p-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                >
                  Male
                </button>
                <button
                  onClick={() => selectChangeHandler('female')}
                  className="w-full p-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                >
                  Female
                </button>
              </div>
            )}
          </div>
        </div>
        <div className='flex justify-end'>
          {loading ? (
            <button 
              disabled
              className='w-fit bg-[#0095F6] text-white px-6 py-2 rounded-md hover:bg-[#2a8ccd] flex items-center gap-2'
            >
              <Loader2 className='h-4 w-4 animate-spin' />
              Please wait
            </button>
          ) : (
            <button 
              onClick={editProfileHandler} 
              className='w-fit bg-[#0095F6] text-white px-6 py-2 rounded-md hover:bg-[#2a8ccd]'
            >
              Submit
            </button>
          )}
        </div>
      </section>
    </div>
  )
}

export default EditProfile