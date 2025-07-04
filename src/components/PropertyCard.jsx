import React from 'react';
import ImageCarousel from './ImageCarousel';

function PropertyCard({ property, large = false }) {
  return (
    <div
      className={`rounded-xl shadow-lg overflow-hidden bg-white dark:bg-gray-800 ${
        large ? 'w-full max-w-3xl mx-auto' : 'w-80'
      }`}
    >
      {large ? (
        <ImageCarousel images={property.images} />
      ) : (
        <img
          src={property.images?.[0]}
          alt={property.name}
          className="w-full h-48 object-cover"
        />
      )}

      <div className="p-4">
        <h3 className={`font-bold ${large ? 'text-2xl' : 'text-lg'}`}>{property.name}</h3>
        <p className="text-sm text-gray-500">{property.location}</p>
        <p className={`text-blue-600 dark:text-blue-300 mt-2 ${large ? 'text-xl' : 'text-md'}`}>
          ${property.price}
        </p>

        {large && (
          <div className="mt-4 text-gray-600 dark:text-gray-300 text-sm space-y-2">
            <p><strong>Square Footage:</strong> {property.squareFootage}</p>
            <p><strong>Bedrooms:</strong> {property.bedrooms}</p>
            <p><strong>Bathrooms:</strong> {property.bathrooms}</p>
            <p className="mt-2">{property.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PropertyCard;
