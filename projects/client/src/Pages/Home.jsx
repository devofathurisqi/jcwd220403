import React from 'react';
import NavBar from '../Components/NavBar';
import NavBot from '../Components/NavBot';
import { Outlet } from 'react-router-dom';
import { SearchProvider } from '../context/SearchProvider';

const Home = () => {
  return (
    <div>
      <SearchProvider>
        <NavBar />
        <Outlet />
        {/* <NavBot /> */}
      </SearchProvider>
    </div>
  );
};

export default Home;
