import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import TinderCard from "react-tinder-card";
import { Toaster, toast } from "react-hot-toast";
import PropertyCard from "./components/PropertyCard";
import Header from "./components/Header";
import { db } from './firebase';
import { 
  collection, onSnapshot, query, where, orderBy, 
  doc, setDoc, deleteDoc, serverTimestamp 
} from 'firebase/firestore';

// FIX: Changed ".." to "." because App.jsx is in the same folder as the context folder
import { useAuth } from "./context/AuthContext"; 

function App() {
  const { user } = useAuth(); // Get current user
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState([]);
  const [history, setHistory] = useState([]);
  const [viewingLikes, setViewingLikes] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const navigate = useNavigate();
  const locationState = useLocation().state || {};
  const { location: searchLocation, guests: searchGuests } = locationState;

  const [feed, setFeed] = useState([]);

  // 1. Fetch Feed Data (Properties)
  useEffect(() => {
    const q = query(
      collection(db, 'properties'),
      // In production, you might only want 'active'
      where('status', 'in', ['active', 'pending']),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(q, (snap) => {
      let list = snap.docs.map(d => ({ id: d.id, ...d.data() }));

      // Client-side filtering
      if (searchLocation) {
        const term = searchLocation.toLowerCase();
        list = list.filter(p => 
          p.location.toLowerCase().includes(term) || 
          p.title.toLowerCase().includes(term)
        );
      }

      if (searchGuests) {
        list = list.filter(p => (p.bedrooms * 2) >= Number(searchGuests));
      }

      if (list.length === 0 && (searchLocation || searchGuests)) {
        toast.error("No properties found matching your search.");
      }

      setFeed(list);
      setIndex(0);
      setHistory([]);
    });
    return () => unsub();
  }, [searchLocation, searchGuests]);

  // 2. Real-time Listener for LIKES (Database vs LocalStorage)
  useEffect(() => {
    if (user) {
      // If logged in: Listen to Firestore
      const likesRef = collection(db, "users", user.uid, "likes");
      const unsub = onSnapshot(likesRef, (snap) => {
        setLiked(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      });
      return () => unsub();
    } else {
      // If logged out: Load from LocalStorage
      const stored = localStorage.getItem("likedProperties");
      if (stored) setLiked(JSON.parse(stored));
    }
  }, [user]);

  // 3. Handle Swipe (Save Like)
  const handleSwipe = async (direction, property) => {
    if (direction === "right") {
      if (user) {
        // Save to Database
        try {
          await setDoc(doc(db, "users", user.uid, "likes", property.id), {
            ...property,
            likedAt: serverTimestamp()
          });
          toast.success("Saved to your account!");
        } catch (e) {
          console.error(e);
          toast.error("Failed to save like");
        }
      } else {
        // Save to LocalStorage
        setLiked((prev) => {
          const newLikes = [...prev, property];
          localStorage.setItem("likedProperties", JSON.stringify(newLikes));
          return newLikes;
        });
        toast("Liked! Log in to save permanently.", { icon: '💾' });
      }
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

  // 4. Remove Like
  const removeLiked = async (id) => {
    if (user) {
      // Remove from Database
      await deleteDoc(doc(db, "users", user.uid, "likes", id));
      toast.error("Removed from favorites");
    } else {
      // Remove from LocalStorage
      setLiked((prevLiked) => {
        const updated = prevLiked.filter((property) => property.id !== id);
        localStorage.setItem("likedProperties", JSON.stringify(updated));
        return updated;
      });
      toast.error("Removed from favorites");
    }
  };

  const right = (
    <button
      onClick={() => setDarkMode((v) => !v)}
      className="text-sm text-gray-700 dark:text-gray-200 hover:text-blue-600"
      title="Toggle dark mode"
    >
      {darkMode ? "🌞" : "🌙"}
    </button>
  );

  return (
    <div className={darkMode ? "dark" : ""}>
      <Header right={right} />

      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 flex flex-col items-center">
        <Toaster position="top-center" reverseOrder={false} />

        {searchLocation && (
          <div className="mb-4 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm flex items-center gap-2">
            <span>🔍 Searching: "{searchLocation}"</span>
            <button 
              onClick={() => navigate('/browse', { state: {} })}
              className="font-bold hover:text-blue-600"
            >
              ✕ Clear
            </button>
          </div>
        )}

        {!viewingLikes ? (
          <>
            {index < feed.length ? (
              <div className="relative w-80 h-[400px]">
                <TinderCard
                  key={feed[index].id}
                  onSwipe={(dir) => handleSwipe(dir, feed[index])}
                  preventSwipe={["up", "down"]}
                  className="absolute"
                >
                  <div className="w-80 transition-transform duration-300 ease-in-out">
                    <PropertyCard property={feed[index]} />
                  </div>
                </TinderCard>
              </div>
            ) : (
              <div className="text-center mt-10">
                <h2 className="text-2xl font-bold mb-4">No more properties!</h2>
                <button
                   onClick={() => navigate('/')}
                   className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg"
                >
                  Back to Home
                </button>
              </div>
            )}

            {index < feed.length && (
              <div className="mt-4 flex flex-col items-center space-y-2">
                <button
                  onClick={handleGoBack}
                  className="bg-yellow-500 hover:bg-yellow-400 text-white px-4 py-2 rounded-xl shadow"
                >
                  ⬅ Back
                </button>
                <button
                  onClick={() => setViewingLikes(true)}
                  className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-xl shadow"
                >
                  View Liked ({liked.length})
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-300">
              Your Liked Properties
            </h2>
            {liked.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">
                You haven’t liked any properties yet.
              </p>
            ) : (
              liked.map((property) => (
                <div key={property.id} className="mb-6 relative">
                  <Link to={`/property/${property.id}`}>
                    <PropertyCard property={property} />
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
              className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-xl shadow"
            >
              ⬅ Back to Browse
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;