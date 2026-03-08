import { useState } from "react";

export function ProductGallery({ images }) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="space-y-4">
      <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
        <img
          src={images[selectedImage]}
          alt={`Product view ${selectedImage + 1}`}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`aspect-video overflow-hidden rounded-lg border-2 transition-all ${
              selectedImage === index
                ? "border-blue-600 ring-2 ring-blue-600 ring-offset-2"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
