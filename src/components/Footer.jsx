import React from 'react';

const TransparentFooter = () => {
  return (
    <footer className="bg-black backdrop-filter backdrop-blur-lg text-white py-4 mt-20">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        <div className="text-left">
          <p>Email: codecrafterslb@gmail.com</p>
          <p>Phone: +961 81 713 314</p>
        </div>
        <div className="text-right">
          <p>&copy; {new Date().getFullYear()} CodeCrafterslb. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default TransparentFooter;
