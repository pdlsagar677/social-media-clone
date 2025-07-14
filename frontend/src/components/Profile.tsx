import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AtSign, Heart, MessageCircle, Edit, Archive, Megaphone, Mail } from 'lucide-react';
import useGetUserProfile from '../hooks/useGetUserProfile';
import { RootState } from '../redux/store';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  username?: string;
}

interface AuthState {
  user: User | null;
  suggestedUsers: User[];
  userProfile: User | null;
  selectedUser: User | null;
}

const Profile: React.FC = () => {
  const params = useParams<{ id: string }>();
  const userId = params.id;

  useGetUserProfile(userId);

  const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts');

  const { userProfile, user } = useSelector((store: RootState) => (store.auth as AuthState));

  const isLoggedInUserProfile = user?.id === userProfile?.id;

  const isFollowing = false;

  const handleTabChange = (tab: 'posts' | 'saved') => {
    setActiveTab(tab);
  };

  const displayedPost: [] = [];

  return (
    <div className='flex max-w-5xl justify-center mx-auto pl-10 bg-gray-900 text-gray-100'>
      <div className='flex flex-col gap-20 p-8 w-full'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <section className='flex items-center justify-center'>
            <div className='relative'>
              <div className='h-32 w-32 rounded-full overflow-hidden border-2 border-orange-500'>
                <img
                  src={userProfile?.avatar || '/default-profile.png'}
                  alt='profile'
                  className='w-full h-full object-cover'
                />
              </div>
            </div>
          </section>
          <section>
            <div className='flex flex-col gap-5'>
              <div className='flex items-center gap-2 flex-wrap'>
                <span className='text-xl font-semibold'>{userProfile?.username || userProfile?.name || 'Loading...'}</span>
                {
                  userProfile && (
                    isLoggedInUserProfile ? (
                      <div className='flex gap-2 flex-wrap'>
                        <Link to='/account/edit'>
                          <button className='flex items-center gap-1 bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-md text-sm'>
                            <Edit size={16} /> Edit profile
                          </button>
                        </Link>
                        <button className='flex items-center gap-1 bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-md text-sm'>
                          <Archive size={16} /> View archive
                        </button>
                        <button className='flex items-center gap-1 bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-md text-sm'>
                          <Megaphone size={16} /> Ad tools
                        </button>
                      </div>
                    ) : (
                      isFollowing ? (
                        <div className='flex gap-2'>
                          <button className='bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-md text-sm'>
                            Unfollow
                          </button>
                          <button className='flex items-center gap-1 bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-md text-sm'>
                            <Mail size={16} /> Message
                          </button>
                        </div>
                      ) : (
                        <button className='bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-3 py-1 rounded-md text-sm'>
                          Follow
                        </button>
                      )
                    )
                  )
                }
              </div>
              <div className='flex items-center gap-4'>
                <p>
                  <span className='font-semibold'>0</span> posts
                </p>
                <p>
                  <span className='font-semibold'>0</span> followers
                </p>
                <p>
                  <span className='font-semibold'>0</span> following
                </p>
              </div>
              <div className='flex flex-col gap-1'>
                <span className='font-semibold'>No bio yet</span>
                <div className='flex items-center gap-1 text-orange-400'>
                  <AtSign size={16} />
                  <span>{userProfile?.username || userProfile?.name || ''}</span>
                </div>
                <span>🤯 Learn code with patel mernstack style</span>
                <span>🤯 Turing code into fun</span>
                <span>🤯 DM for collaboration</span>
              </div>
            </div>
          </section>
        </div>
        <div className='border-t border-gray-800'>
          <div className='flex items-center justify-center gap-10 text-sm'>
            <button
              className={`py-3 cursor-pointer ${activeTab === 'posts' ? 'font-bold border-t-2 border-orange-500' : 'text-gray-400'}`}
              onClick={() => handleTabChange('posts')}
            >
              POSTS
            </button>
            <button
              className={`py-3 cursor-pointer ${activeTab === 'saved' ? 'font-bold border-t-2 border-orange-500' : 'text-gray-400'}`}
              onClick={() => handleTabChange('saved')}
            >
              SAVED
            </button>
            <button className='py-3 cursor-pointer text-gray-400'>REELS</button>
            <button className='py-3 cursor-pointer text-gray-400'>TAGS</button>
          </div>
          <div className='grid grid-cols-3 gap-1 mt-4'>
            <div className='col-span-3 text-center py-10 text-gray-400'>
              {userProfile ? `No ${activeTab === 'posts' ? 'posts' : 'saved items'} yet` : 'Loading profile...'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;