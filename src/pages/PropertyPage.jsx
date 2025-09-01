import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { properties } from "../data/properties";
import PropertyCard from "../components/PropertyCard";

function PropertyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  const property = properties.find((p) => p.id.toString() === id);

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
