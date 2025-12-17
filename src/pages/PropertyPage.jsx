import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { db } from '../firebase';
import { doc, onSnapshot, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import PropertyCard from "../components/PropertyCard";
import { useAuth } from "../context/AuthContext";
import { Toaster, toast } from "react-hot-toast";

function PropertyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  // Booking State
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'properties', id), (d) => {
      setProperty(d.exists() ? { id: d.id, ...d.data() } : null);
      setLoading(false);
    });
    return () => unsub();
  }, [id]);

  // Calculate Total Price
  const getDays = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays > 0 ? diffDays : 0;
  };

  const nights = getDays();
  const totalPrice = property ? nights * property.price : 0;

  const handleBooking = async () => {
    if (!user) {
      toast.error("Please login to book a stay.");
      navigate("/login");
      return;
    }
    if (!checkIn || !checkOut) {
      toast.error("Select check-in and check-out dates.");
      return;
    }

    try {
      setBookingLoading(true);
      
      // 1. Create Booking
      await addDoc(collection(db, "bookings"), {
        propertyId: property.id,
        propertyTitle: property.title,
        propertyImage: property.images?.[0] || "",
        hostId: property.ownerId,
        guestId: user.uid,
        checkIn,
        checkOut,
        totalPrice,
        nights,
        status: "confirmed",
        createdAt: serverTimestamp(),
      });

      toast.success("Booking Confirmed! 🎉");
      
      // 2. Redirect (optional)
      setTimeout(() => navigate("/"), 2000);

    } catch (error) {
      console.error(error);
      toast.error("Booking failed. Try again.");
    } finally {
      setBookingLoading(false);
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

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className={darkMode ? "dark" : ""}>
      <Toaster />
      <Header right={right} />

      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4 sm:p-6">
        {property ? (
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Left: Property Details */}
            <div className="md:col-span-2 space-y-6">
               {/* Image Gallery (Simple) */}
               <div className="rounded-xl overflow-hidden shadow-lg h-64 sm:h-96">
                <img 
                  src={property.images?.[0] || "https://via.placeholder.com/800"} 
                  alt={property.title} 
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h1 className="text-3xl font-bold">{property.title}</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">{property.location}</p>
              </div>

              <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-300 border-y py-4 border-gray-200 dark:border-gray-700">
                <span>🛏 {property.bedrooms} Bedrooms</span>
                <span>🛁 {property.bathrooms} Bathrooms</span>
                <span>📐 {property.sqft} sqft</span>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Description</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {property.description}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {property.amenities?.map((amenity) => (
                    <span key={amenity} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-xs">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Booking Box */}
            <div className="md:col-span-1">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 sticky top-24">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-2xl font-bold text-blue-600">₦{property.price?.toLocaleString()}</span>
                  <span className="text-gray-500 text-sm">/ night</span>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-bold uppercase text-gray-500">Check-In</label>
                      <input 
                        type="date" 
                        className="w-full p-2 border rounded bg-transparent dark:border-gray-600"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase text-gray-500">Check-Out</label>
                      <input 
                        type="date" 
                        className="w-full p-2 border rounded bg-transparent dark:border-gray-600"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                      />
                    </div>
                  </div>

                  {nights > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>₦{property.price?.toLocaleString()} x {nights} nights</span>
                        <span>₦{totalPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2 border-gray-300 dark:border-gray-600">
                        <span>Total</span>
                        <span>₦{totalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleBooking}
                    disabled={bookingLoading || !nights}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-400 text-white font-bold rounded-lg transition"
                  >
                    {bookingLoading ? "Processing..." : "Reserve Now"}
                  </button>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="text-center text-red-500 mt-20">
            <p>Property not found.</p>
            <button onClick={() => navigate("/")} className="mt-4 text-blue-600 underline">
              Go back home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PropertyPage;