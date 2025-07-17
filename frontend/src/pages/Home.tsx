import React from 'react'
import Feed from '../components/Feed'
import { Outlet } from 'react-router-dom'
import RightSidebar from '../components/RightSidebar'
import useGetAllPost from '@/hooks/useGetAllPost'
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers'

const Home: React.FC = () => {
    useGetAllPost()
    useGetSuggestedUsers()
    
    return (
        <div className='flex'>
            <div className='flex-grow'>
                <Feed />
                <Outlet />
            </div>
            <RightSidebar />
        </div>
    )
}

export default Home