import React from 'react';
import Posts from './Posts';

const Feed: React.FC = () => {
  return (
    <div className='flex-1 my-8 flex flex-col items-center pl-[20%]'>
        <Posts/>
    </div>
  );
};

export default Feed;