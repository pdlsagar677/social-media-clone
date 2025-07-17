import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

interface User {
  _id: string
  username: string
  // Add other user properties as needed
}

interface AuthState {
  user: User | null
}

interface RootState {
  auth: AuthState
}

interface ProtectedRoutesProps {
  children: React.ReactNode
}

const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({ children }) => {
  const { user } = useSelector((store: RootState) => store.auth)
  const navigate = useNavigate()
  
  useEffect(() => {
    if (!user) {
      navigate("/login")
    }
  }, [user, navigate])
  
  return <>{children}</>
}

export default ProtectedRoutes