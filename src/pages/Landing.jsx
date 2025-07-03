import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { properties } from '../data/properties';
import PropertyCard from '../components/PropertyCard';

const Landing = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  const handleSearch = () => {
    navigate('/browse');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-y-auto">
      {/* Sticky Header */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center p-4 shadow-md">
        <h1
          onClick={() => navigate('/')}
          className="cursor-pointer text-xl text-3xl font-bold text-blue-700 dark:text-blue-300"
        >
          🏡 ShortLet
        </h1>
        <button
          onClick={handleSearch}
          className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl"
        >
          Browse
        </button>
      </nav>

      <div className="p-6 text-center">
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Book your next stay in seconds
        </p>

        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl mx-auto shadow-md space-y-4 mb-12">
          <div>
            <label className="block text-left mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Where</label>
            <input
              type="text"
              placeholder="Enter a city or neighborhood"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-left mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Check-in</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
              />
            </div>
            <div>
              <label className="block text-left mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Check-out</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-left mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Guests</label>
            <input
              type="number"
              min="1"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
            />
          </div>

          <button
            onClick={handleSearch}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-semibold"
          >
            Search
          </button>
        </div>

        <div className="w-full max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-left">Best Selling Properties</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {properties.slice(0, 6).map((property) => (
              <div key={property.id}>
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
