
// src/components/ContactForm.js
import React, { useState } from 'react';
import lottie from 'lottie-web';
import animationData from '../assets/Contact-animation.json';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  function onSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    fetch("https://formcarry.com/s/G7gICwzOry", {
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, message })
    })
      .then(response => response.json())
      .then(response => {
        if (response.code === 200) {
          // Handle successful form submission
          setSuccessMessage("Form submitted successfully!");
          setError('');
          setName('');
          setEmail('');
          setMessage('');
        } else if (response.code === 422) {
          // Field validation failed
          setError(response.message);
        } else {
          // Other error from Formcarry
          setError(response.message);
        }
      })
      .catch(error => {
        // Request-related error
        setError(error.message ? error.message : error);
      });
  }

  const animationContainer = React.useRef(null);

  React.useEffect(() => {
    const anim = lottie.loadAnimation({
      container: animationContainer.current,
      animationData: animationData,
      loop: true,
      autoplay: true,
    });

    return () => {
      // Cleanup animation on unmount
      anim.destroy();
    };
  }, []);

  return (
    <div id="contact" className="relative bg-gradient-to-r from-yellow-500 to-white flex justify-center items-center h-screen pt-8">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-yellow-500 transform -skew-y-6 z-0"></div>

      <div className="w-full md:w-1/2 p-8  rounded-md z-10">
        <h2 className="pt-8 text-black underline font-extrabold text-3xl mb-4">Contact Us</h2>
        {successMessage && <div className="text-black">{successMessage}</div>}
        {error && <div className="text-black">{error}</div>}
        <form onSubmit={(e) => onSubmit(e)} className="space-y-4">
          <div className="mb-4">
            <label htmlFor="name" className="block text-black text-lg font-extrabold">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} id="name" className="w-full p-2 border rounded" required />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-black font-extrabold">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} id="email" className="w-full p-2 border rounded" required />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block text-black font-extrabold">Message</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} id="message" rows="4" className="w-full p-2 border rounded" required></textarea>
          </div>
          <button type="submit" className="bg-black text-white py-2 px-6 rounded-md shadow-md hover:bg-black w-full">
            Submit
          </button>
        </form>
      </div>
      <div className="hidden md:block md:w-1/2 relative z-10">
        <div ref={animationContainer} style={{ width: '100%', height: '100%' }}></div>
      </div>

      {/* Additional decorative elements */}
      <div className="absolute bottom-0 right-0 w-full h-32 bg-yellow-500 transform -skew-y-6 z-0"></div>
    </div>
  );
}
