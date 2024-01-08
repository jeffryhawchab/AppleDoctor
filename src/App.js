import React, { useState, useEffect } from 'react';
import LoadingScreen from './components/Loading';
import Navbar from './components/Navbar';
import ScanComponent from './components/Scan';
import Footer from './components/Footer';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app loading
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Set the time it takes to load your app
  }, []);

  return (
    <div>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="App">
          <Navbar />
          <ScanComponent />
          <Footer />
        </div>
      )}
    </div>
  );
}

export default App;
