import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

const Liked = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [liked, setLiked] = useState([]);

  useEffect(() => {
    if (user) {
      // Logged in: Read from Firestore
      const unsub = onSnapshot(collection(db, "users", user.uid, "likes"), (snap) => {
        setLiked(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      });
      return () => unsub();
    } else {
      // Logged out: Read from LocalStorage
      const stored = localStorage.getItem('likedProperties');
      if (stored) {
        setLiked(JSON.parse(stored));
      }
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 dark:bg-gray-900 dark:text-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Liked Properties</h2>
      
      {!user && liked.length > 0 && (
        <p className="text-center text-amber-600 mb-4 text-sm">
          ⚠️ These likes are only saved on this device. <Link to="/login" className="underline">Log in</Link> to sync them.
        </p>
      )}

      {liked.length === 0 ? (
        <div className="text-center text-gray-600">
          <p>No liked properties yet.</p>
        </div>
      ) : (
       liked.map((property) => (
         <div key={property.id} className="mb-6 relative max-w-xl mx-auto">
          <Link to={`/property/${property.id}`}>
            <PropertyCard property={property} />
          </Link>
          </div>
        ))
      )}
      <div className="text-center mt-4">
        <button
          onClick={() => navigate('/')}
          className="underline text-blue-600"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Liked;