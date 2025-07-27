import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TinderCard from 'react-tinder-card';
import { Toaster, toast } from 'react-hot-toast';
import { properties } from './data/properties';
import PropertyCard from './components/PropertyCard';
import { Link } from 'react-router-dom'; 



function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState(() => {
    const stored = localStorage.getItem('likedProperties');
    return stored ? JSON.parse(stored) : [];
  });
  const [history, setHistory] = useState([]);
  const [viewingLikes, setViewingLikes] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('likedProperties', JSON.stringify(liked));
  }, [liked]);

  const handleSwipe = (direction, property) => {
    if (direction === 'right') {
      setLiked((prev) => [...prev, property]);
      toast.success('You liked a property!');
    }
    setHistory((prev) => [...prev, index]);
    setIndex((prev) => prev + 1);
  };

  const handleGoBack = () => {
    if (history.length > 0) {
      const prevIndex = history[history.length - 1];
      setHistory((prev) => prev.slice(0, -1));
      setIndex(prevIndex);
    }
  };

  const removeLiked = (id) => {
    setLiked((prevLiked) => {
      const updated = prevLiked.filter((property) => property.id !== id);
      localStorage.setItem('likedProperties', JSON.stringify(updated));
      return updated;
    });
    setTimeout(() => {
      toast.error('Removed from favorites');
    }, 500);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

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
        <button
          onClick={() => setShowLoginModal(true)}
          className="text-sm text-blue-700 dark:text-blue-300 hover:underline"
          >
          Login
        </button>

        <div className="flex space-x-4">
          <button
            onClick={() => setViewingLikes(false)}
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600"
          >
            Home
          </button>
          <button
            onClick={() => setViewingLikes(true)}
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600"
          >
            Liked
          </button>
          <button
            onClick={toggleDarkMode}
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600"
          >
            {darkMode ? '🌞' : '🌙'}
          </button>
        </div>
      </nav>

      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 flex flex-col items-center">

        {/* Toast Notifications */}
        <Toaster position="top-center" reverseOrder={false} />

        {!viewingLikes ? (
          <>
            {index < properties.length ? (
              <div className="relative w-80 h-[400px]">
                <TinderCard
                  key={properties[index].id}
                  onSwipe={(dir) => handleSwipe(dir, properties[index])}
                  preventSwipe={['up', 'down']}
                  className="absolute"
                >
                  <div className="w-80 transition-transform duration-300 ease-in-out">
                    <PropertyCard property={properties[index]} />
                  </div>
                </TinderCard>
              </div>
            ) : (
              <h2 className="text-2xl font-bold mb-4">No more properties!</h2>
            )}

            <div className="mt-4 flex flex-col items-center space-y-2">
              <button
                onClick={handleGoBack}
                className="bg-yellow-500 hover:bg-yellow-400 text-white px-4 py-2 rounded-xl shadow"
              >
                ⬅ Back
              </button>
              <button
                onClick={() => setViewingLikes(true)}
                className="bg-blue-700 hover:bg-blue-300 text-white px-4 py-2 rounded-xl shadow"
              >
                View Liked Properties ({liked.length})
              </button>
            </div>
          </>
        ) : (
          <div className="w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-300">Your Liked Properties</h2>
            {liked.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">You haven’t liked any properties yet.</p>
            ) : (
              liked.map((property) => (
                <div key={property.id} className="mb-6 relative">
                  <Link to={`/property/${property.id}`}>
                    <PropertyCard property = {property} />
                  </Link>
                  <button
                    onClick={() => removeLiked(property.id)}
                    className="mt-2 bg-red-500 hover:bg-red-400 text-white px-3 py-1 rounded shadow-sm"
                  >
                    ✕ Remove
                  </button>
                </div>
              ))
            )}
            <button
              onClick={() => setViewingLikes(false)}
              className="bg-blue-700 hover:bg-blue-300 text-white px-4 py-2 rounded-xl shadow"
              >
              ⬅ Back to Browse
            </button>
          </div>
        )}
      </div>
      {showLoginModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-80">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Login</h2>
      <input
        type="email"
        placeholder="Email"
        className="w-full px-3 py-2 mb-3 border border-gray-300 dark:border-gray-600 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full px-3 py-2 mb-4 border border-gray-300 dark:border-gray-600 rounded"
      />
      <div className="flex justify-between">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
        >
          Log In
        </button>
        <button
          onClick={() => setShowLoginModal(false)}
          className="text-gray-500 hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default App;
