import React, { useState } from 'react';
import axios from 'axios';
import { app } from '../Firebse'; // Ensure you import Firebase Storage
import { getDownloadURL, getStorage, ref, uploadBytesResumable, } from 'firebase/storage';
const UserForm = () => {
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const storage = getStorage(app);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true); // Indicate uploading process

    const imageUrls = [];
    
    // Upload each image to Firebase Storage
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const imageRef = ref(storage, `images/${Date.now()}_${image.name}`);

      try {
        const uploadTask = uploadBytesResumable(imageRef, image);

        // Wait for the image to upload and get its download URL
        const downloadURL = await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              // Optional: handle progress (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            },
            (error) => {
              console.error("Upload failed:", error);
              reject(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then(resolve).catch(reject);
            }
          );
        });

        // Store the download URL in the array
        imageUrls.push(downloadURL);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }

    // Send the name, handle, and image URLs to the backend
    try {
      console.log(imageUrls)
      const res = await axios.post('http://localhost:5000/api/users', {
        name,
        handle,
        images: imageUrls
      });

      alert('Submitted successfully!');
      console.log(res);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setUploading(false); // End the uploading process
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-green-400 to-blue-500">
      <form
        encType="multipart/form-data"
        className="p-10 bg-white rounded-lg shadow-lg"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Social Media Handle"
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <input
            type="file"
            multiple
            onChange={(e) => setImages(e.target.files)}
            className="w-full p-3 border rounded-lg"
          />
        </div>
        <button
          type="submit"
          className="w-full p-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-transform transform hover:scale-105"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default UserForm;
