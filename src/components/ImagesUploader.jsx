import React, { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../service/firebase";
import { addDoc, collection } from "firebase/firestore";
import db from "../service/firebase";

const ImagesUploader = ({ folderName }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [file, setFile] = useState(null);

  const uploadImage = async (file) => {
    const storageRef = ref(storage, `${folderName}/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  const saveImageInfo = async (downloadURL) => {
    const imageInfo = {
      url: downloadURL,
      createdAt: new Date(),
    };

    const imagesCollectionRef = collection(db, folderName);
    await addDoc(imagesCollectionRef, imageInfo);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (file) {
      const downloadURL = await uploadImage(file);
      await saveImageInfo(downloadURL);
      console.log("Gönderildi!");
    } else {
      console.log("Lütfen önce bir resim seçin!");
    }
    setSelectedImage(null);
    setFile(null);
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <input type="file" onChange={handleFileChange} />
        {selectedImage && <img src={selectedImage} alt="Uploaded" />}
        <button type="submit">Gönder</button>
      </form>
    </div>
  );
};

export default ImagesUploader;
