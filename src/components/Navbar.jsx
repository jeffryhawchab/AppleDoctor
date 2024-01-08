import React, { useState, useEffect } from 'react';
import logo from '../assets/robot-icon.svg';

const Navbar = () => {
  const [isOpen] = useState(false);
  const [scrolling, setScrolling] = useState(false);



  const handleScroll = () => {
    if (window.scrollY > 50) {
      setScrolling(true);
    } else {
      setScrolling(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

 
  return (
    <nav className={`w-full bg-${scrolling ? 'black' : 'black'} text-white p-4 z-50 transition-all duration-300 ease-in-out `}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="w-8 h-8 mr-2" />
          <span className="text-xl font-bold">𝕬𝖕𝖕𝖑𝖊𝕯𝖔𝖈𝖙𝖔𝖗</span>
        </div>
        <div className={`lg:flex items-center ${isOpen ? 'block' : 'hidden'}`}>
          {/* You can customize the content here or remove it if not needed */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
