import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TinderCard from 'react-tinder-card';
import { Toaster, toast } from 'react-hot-toast';
import { properties } from './data/properties';
import PropertyCard from './components/PropertyCard';

function App() {
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState(() => {
    const stored = localStorage.getItem('likedProperties');
    return stored ? JSON.parse(stored) : [];
  });
  const [history, setHistory] = useState([]);
  const [viewingLikes, setViewingLikes] = useState(false);
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
    const updated = liked.filter((property) => property.id !== id);
    setLiked(updated);
    toast.error('Removed from favorites');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Branding Header */}
      <header className="w-full max-w-xl flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-blue-700 tracking-tight">🏡 SwipeNest</h1>
        <span className="text-sm text-gray-500">Find your next home</span>
      </header>

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
            <h1 className="text-2xl font-bold mb-4">No more properties!</h1>
          )}

          <div className="mt-4 flex flex-col items-center space-y-2">
            <button
              onClick={handleGoBack}
              className="bg-yellow-500 hover:bg-yellow-400 text-white px-4 py-2 rounded-xl shadow"
            >
              Back
            </button>
            <button
              onClick={() => setViewingLikes(true)}
              className="underline text-blue-700 hover:text-blue-500"
            >
              View Liked Properties ({liked.length})
            </button>
          </div>
        </>
      ) : (
        <div className="w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">Your Liked Properties</h2>
          {liked.length === 0 ? (
            <p className="text-gray-600">You haven’t liked any properties yet.</p>
          ) : (
            liked.map((property) => (
              <div key={property.id} className="mb-6 relative">
                <PropertyCard property={property} />
                <button
                  onClick={() => removeLiked(property.id)}
                  className="mt-2 bg-red-500 hover:bg-red-400 text-white px-3 py-1 rounded shadow-sm"
                >
                  Remove
                </button>
              </div>
            ))
          )}
          <button
            onClick={() => setViewingLikes(false)}
            className="mt-6 underline text-blue-600"
          >
            Back to Browse
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
