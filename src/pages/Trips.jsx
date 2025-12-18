import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export default function Trips() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Fetch bookings for this user
    const q = query(
      collection(db, "bookings"),
      where("guestId", "==", user.uid)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      list.sort((a, b) => b.createdAt - a.createdAt); // Newest first
      setTrips(list);
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
          My Trips ✈️
        </h1>

        {loading ? (
          <p>Loading trips...</p>
        ) : trips.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2 dark:text-gray-200">No trips booked yet</h2>
            <button onClick={() => navigate("/")} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg">
              Start Exploring
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {trips.map((trip) => (
              <div key={trip.id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex gap-4">
                <img 
                  src={trip.propertyImage || "https://via.placeholder.com/150"} 
                  alt={trip.propertyTitle} 
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold dark:text-white">{trip.propertyTitle}</h3>
                  <div className="flex gap-4 text-sm text-gray-500 mt-2">
                    <p>Check-in: {trip.checkIn}</p>
                    <p>Check-out: {trip.checkOut}</p>
                  </div>
                  <p className="mt-4 font-bold text-blue-600">₦{trip.totalPrice?.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}