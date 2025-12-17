import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // ✅ ADDED Link here
import PropertyCard from '../components/PropertyCard';
import UserMenu from '../components/UserMenu';
import { useAuth } from "../context/AuthContext";
import { db } from '../firebase';
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  
  const [featuredProperties, setFeaturedProperties] = useState([]);

  const isInvalidDate = checkIn && checkOut && new Date(checkIn) > new Date(checkOut);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const q = query(
          collection(db, "properties"),
          orderBy("createdAt", "desc"),
          limit(6)
        );
        const querySnapshot = await getDocs(q);
        const list = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFeaturedProperties(list);
      } catch (error) {
        console.error("Error fetching featured properties:", error);
      }
    };

    fetchProperties();
  }, []);

  const handleSearch = () => {
    navigate('/browse', { state: { location, guests } });
  };

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
                onClick={() => navigate('/owner')}
                className="text-sm bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-xl"
              >
                Host Property
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
          <h2 className="text-2xl font-bold mb-6 text-left">Newest Properties</h2>
          
          {featuredProperties.length === 0 ? (
            <div className="text-gray-500">
              No properties found. <span className="font-bold cursor-pointer text-blue-600" onClick={() => navigate('/owner')}>Add one now!</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {featuredProperties.map((property) => (
                // ✅ CHANGED: Wrapped in Link
                <Link key={property.id} to={`/property/${property.id}`} className="block hover:scale-105 transition-transform duration-300">
                  <PropertyCard property={property} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Landing;