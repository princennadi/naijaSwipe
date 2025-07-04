import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { properties } from '../data/properties';
import PropertyCard from '../components/PropertyCard';

function PropertyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  const property = properties.find((p) => p.id.toString() === id);

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      {/* Sticky Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center p-4 shadow-md">
        <h1
          onClick={() => navigate('/')}
          className="cursor-pointer text-xl font-bold text-blue-700 dark:text-blue-300"
        >
          🏡 ShortLet
        </h1>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600"
          >
            Home
          </button>
          <button
            onClick={() => navigate('/liked')}
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600"
          >
            Liked
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600"
          >
            {darkMode ? '🌞' : '🌙'}
          </button>
        </div>
      </nav>

      {/* Property Details */}
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-6">
        {property ? (
          <>
            <PropertyCard property={property} large />
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate(-1)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded shadow"
              >
                ⬅ Back
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-red-500">
            <p>Property not found.</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 text-blue-600 underline"
            >
              Go back home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PropertyPage;
