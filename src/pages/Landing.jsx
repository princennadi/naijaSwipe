import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { properties } from '../data/properties';
import PropertyCard from '../components/PropertyCard';
import UserMenu from '../components/UserMenu';
import { useAuth } from "../context/AuthContext";

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  const isInvalidDate = checkIn && checkOut && new Date(checkIn) > new Date(checkOut);

  const handleSearch = () => {
    navigate('/browse');
  };
function TempOwnerButton() {
  const { setIsOwner } = useAuth();
  return <button onClick={() => setIsOwner(true)}>Become Host</button>;
}
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-y-auto">
      {/* Sticky Header */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center p-4 shadow-md">
        <h1
          onClick={() => navigate('/')}
          className="cursor-pointer text-xl font-bold text-blue-700 dark:text-blue-300"
        >
          🏡 ShortLet
        </h1>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleSearch}
            className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl"
          >
            Browse
          </button>

          {user ? (
            <>
              <button
                onClick={() => navigate('/dashboard')}
                className="hidden sm:inline-block text-sm bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-xl"
              >
                Host
              </button>
              <UserMenu />
            </>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl"
            >
              Login
            </button>
          )}
        </div>
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
            {isInvalidDate && (
              <p className="col-span-2 text-red-500 text-sm">❌ Check-out must be after check-in.</p>
            )}
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
            disabled={isInvalidDate}
            onClick={handleSearch}
            className={`w-full px-4 py-2 rounded-md text-white ${
              isInvalidDate ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'
            }`}
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
