import React, { useEffect } from 'react';
import lottie from 'lottie-web';
import loadingAnimation from '../assets/16754127_MotionElements_loader-01-lottie.json'; // Update the path

const LoadingScreen = () => {
  useEffect(() => {
    const animationContainer = document.getElementById('loading-animation');

    if (animationContainer) {
      const animation = lottie.loadAnimation({
        container: animationContainer,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: loadingAnimation,
      });

      // Clean up the animation when the component is unmounted
      return () => {
        animation.destroy();
      };
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="text-center">
        <div
          id="loading-animation"
          className="loading-animation mx-auto w-60 h-60" // Adjust the size as needed
        ></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
