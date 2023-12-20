import React, { useEffect, useState } from "react";
import {
  ref as storageRef,
  listAll,
  getDownloadURL,
  getMetadata,
} from "firebase/storage";
import { storage } from "../../service/firebase";

const Test = ({ klasorName }) => {
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        // "images" klasörüne referans oluştur
        const imagesRef = storageRef(storage, klasorName);

        // Klasördeki tüm dosyaların listesini al
        const fileSnapshot = await listAll(imagesRef);

        // Her dosya için metadata ve download URL'sini al
        const imagesData = await Promise.all(
          fileSnapshot.items.map(async (item) => {
            const metadata = await getMetadata(item);
            const url = await getDownloadURL(item);
            return { url, timeCreated: metadata.timeCreated };
          })
        );

        // Resimleri oluşturulma zamanına göre sırala
        imagesData.sort(
          (a, b) => new Date(a.timeCreated) - new Date(b.timeCreated)
        );

        // Sadece URL'leri ayıkla ve state'i güncelle
        setImageUrls(imagesData.map((image) => image.url));
      } catch (error) {
        console.error("Resimleri getirme hatası:", error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div>
      <ul>
        {imageUrls.map((url, index) => (
          <li key={index}>
            <img
              src={url}
              alt={`Resim ${index}`}
              style={{ width: "100px", height: "100px", marginRight: "10px" }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Test;
