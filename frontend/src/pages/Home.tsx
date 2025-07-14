import React from 'react';
import { Outlet } from 'react-router-dom';
import LeftSidebar from '../components/Headerbar'; // Ensure this path is correct relative to MainLayout.tsx

const Home: React.FC = () => {
  return (
    <div>
      <LeftSidebar/>
      <div>
        <Outlet/>
      </div>
    </div>
  );
};

export default Home;
