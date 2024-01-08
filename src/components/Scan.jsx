import React, { useState } from 'react';
import axios from 'axios';

const DiseaseScanner = () => {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleScan = async () => {
    if (!image) {
      alert('Please select an image first.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await axios.post('http://localhost:8000/predict', formData);
      setPrediction(response.data);
    } catch (error) {
      console.error('Error scanning image:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="container p-8 bg-white rounded-lg shadow-md shadow-black max-w-md ">
        <h2 className="text-3xl font-extrabold text-yellow-500 mb-6">Scan your Apple</h2>

        <div className="mb-6">
          <label className="block text-sm  text-black font-black">Choose an Image</label>
          <div className="flex items-center space-x-4 mt-2">
            <label
              className="flex-1 py-2 px-4 border border-gray-300 rounded cursor-pointer bg-gray-200 hover:bg-gray-300"
            >
              <span className="text-gray-700">Select Image</span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
            <button
              onClick={handleScan}
              className={`py-2 px-4 bg-yellow-500 text-black rounded ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-600'
              } focus:outline-none`}
              disabled={loading}
            >
              {loading ? 'Scanning...' : 'Scan'}
            </button>
          </div>
        </div>

        {prediction && (
          <div className="text-black font-black">
            <p className="mb-2">Disease: {prediction.disease_label}</p>
            <p className="mb-2">Medicine: {prediction.medicine}</p>
            <p className="mb-2">Instructions: {prediction.instructions}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiseaseScanner;
