import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Outlet /> {/* This renders the matched child route */}
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;