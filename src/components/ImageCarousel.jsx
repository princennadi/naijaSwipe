import React, { useState } from 'react';

function ImageCarousel({ images }) {
  const [index, setIndex] = useState(0);

  const goLeft = () => setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const goRight = () => setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  if (!images || images.length === 0) return null;

  return (
    <div className="relative w-full h-64 sm:h-96 overflow-hidden">
      <img
        src={images[index]}
        alt={`Property Image ${index + 1}`}
        className="w-full h-full object-cover transition-all duration-300"
      />
      <button
        onClick={goLeft}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white dark:bg-gray-800 p-1 rounded-full shadow"
      >
        ⬅
      </button>
      <button
        onClick={goRight}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white dark:bg-gray-800 p-1 rounded-full shadow"
      >
        ➡
      </button>
    </div>
  );
}

export default ImageCarousel;
