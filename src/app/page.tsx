"use client";

import React, { useEffect, useState } from "react";
import { getImages, uploadImage } from "@/service/serv";

export default function Home() {
  const [images, setImages] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Paso 1

  // Convertir el archivo a Base64 antes de enviarlo al servidor
  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]); // Guardar el archivo seleccionado
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      try {
        // Convertir a Base64 antes de enviar al servidor
        const base64File = await toBase64(selectedFile);
        const result = await uploadImage(base64File, selectedFile.name); // Enviar Base64 en lugar de File
        if (result.error) {
          setError(result.error);
        } else {
          setError(null);
          // Más acciones después de la subida
          console.log("Image uploaded successfully:", result);
          fetchImages(); // Actualizar la lista de imágenes después de subir
        }
      } catch (err) {
        setError("Error converting file to Base64.");
      }
    } else {
      setError("Please select a file first.");
    }
  };

  const fetchImages = async () => {
    const result = await getImages();
    if (result.error) {
      setError(result.error);
    } else {
      setError(null);
      setImages(result.images);
    }
  };

  useEffect(() => {
    document.title = "Token Test";
    fetchImages();
  }, []);

  return (
    <main className="flex flex-col justify-center items-center min-h-screen">
      <h1 className="text-4xl font-bold mb-10">Image Test</h1>
      <label className="mb-2">Choose a file</label>
      <input type="file" className="mb-4" onChange={handleFileChange} /> {/* Paso 1 */}
      <button
        onClick={handleUpload} // Paso 2
        className="bg-slate-800 hover:bg-slate-700 text-white mx-5 py-2 px-4 rounded-lg w-40"
      >
        Upload Image
      </button>
      {error && <p>{error}</p>}
      <div className="bg-slate-800 my-2 p-4 flex flex-row justify-center items-center h-1/3 rounded-lg">
        {images.length > 0 ? (
          images.map((downloadurl, index) => (
            <div key={index}>
              <img
                src={downloadurl}
                alt={`Image ${index}`}
                style={{ maxWidth: "200px", maxHeight: "200px" }}
              />
            </div>
          ))
        ) : (
          <p>No images fetched yet.</p>
        )}
      </div>
    </main>
  );
}
