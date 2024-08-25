'use client'
import React, { useState } from 'react';
import { getImages } from '@/service/serv';

export default function Home() {
  const [images, setImages] = useState<any []>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = async () => {
    const result = await getImages();
    if (result.error) {
      setError(result.error)
    } else {
      //console.log(result)
      setImages(result.images);
      
    }
  };

  return (
    <div>
      <button onClick={fetchImages}>Fetch Images</button>
      {error && <p>{error}</p>}
      <div>
        {images.length > 0 ? (
          images.map((downloadurl,index) => (
            <div key={index}>
              <img src={downloadurl} alt={`Image ${index}`} style={{ maxWidth: '200px', maxHeight: '200px' }} />
            </div>
          ))
        ) : (
          <p>No images fetched yet.</p>
        )}
      </div>
    </div>
  );
}