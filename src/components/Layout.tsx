import React from 'react';
import Navbar from './Navbar';
import BottomNav from './BottomNav';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className='flex flex-col min-h-screen bg-background font-sans text-textPrimary selection:bg-accent/20 selection:text-accent'>
      {/* Navbar muncul di Desktop & Mobile (mode simpel) */}
      <Navbar />
      
      {/* Main Content */}
      <main className='flex-1 w-full max-w-7xl mx-auto animate-fade-in'>
        {children}
      </main>

      {/* Footer hanya muncul di Desktop (diatur di dalam component Footer md:block) */}
      <Footer />
      
      {/* Bottom Nav hanya muncul di Mobile */}
      <BottomNav />
    </div>
  );
};

export default Layout;
