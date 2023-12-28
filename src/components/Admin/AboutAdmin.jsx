import React, { useEffect, useState } from "react";
import { storage } from "../../service/firebase";
import db from "../../service/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import styles from "./css/AboutAdmin.module.css";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import toast from "react-hot-toast";

const AboutAdmin = () => {
  const [gift, setGift] = useState("");
  const [description, setDescription] = useState("");
  const [Aboutes, setAboutes] = useState([]);
  const [editingAbout, setEditingAbout] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [file, setFile] = useState(null);

  const uploadImage = async (file) => {
    try {
      // Seçilen resmi Firebase Storage'a yükle
      const storageRef = ref(storage, `images/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      toast.error("Hata uploadImage fonksiyonunda:", error);
      throw error; // Hatanın tekrar fırlatılması, yukarıdaki katmanlarda ele alınabilir
    }
  };

  //
  const saveImageInfo = async (downloadURL) => {
    // Resim URL'sini Firestore'a kaydet
    try {
      const imageInfo = {
        url: downloadURL,
        createdAt: new Date(),
      };
    } catch (error) {
      toast.error("Resim kaydedilirken şu hata oluştu: ", error);
    }
  };

  const handleFileChange = (e) => {
    // Dosya seçildiğinde tetiklenen olay
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Veritabanına yeni veriyi eklemek için veya mevcut veriyi güncellemek için
    try {
      if (file) {
        // Eğer dosya seçildiyse, resmi yükle ve bilgileri kaydet
        const downloadURL = await uploadImage(file);
        await saveImageInfo(downloadURL);
        toast.success("Gönderildi!");
      } else {
        toast.error("Lütfen önce bir resim seçin!");
      }
      if (editingAbout) {
        // Eğer düzenleme modunda ise
        await updateDoc(doc(db, "About", editingAbout), {
          gift: gift,
          description: description,
        });
        toast.success("Belge başarıyla güncellendi!");
        setEditingAbout(null); // Düzenleme modunu kapat
      } else {
        const downloadURL = await uploadImage(file);
        // Eğer yeni bir belge ekleniyorsa
        await addDoc(collection(db, "About"), {
          gift: gift,
          description: description,
          imageUrl: downloadURL, // Eğer resim URL'sini saklamak istiyorsanız
          createdAt: new Date(),
        });
        toast.success("Belge başarıyla eklendi!");
      }
    } catch (error) {
      console.error("Belge ekleme/güncelleme hatası: ", error);
      toast.error("Belge ekleme/güncelleme sırasında bir hata oluştu.");
    }

    // Formu sıfırla
    setGift("");
    setDescription("");
    setSelectedImage(null);
    setFile(null);
  };

  const handleDelete = async (AboutId, imageUrl) => {
    try {
      await deleteDoc(doc(db, "About", AboutId));
      toast.success("Belge başarıyla silindi!");
      // Resmi Firebase Storage'dan sil
      const storageRef = ref(storage, imageUrl);
      await deleteObject(storageRef);
      console.log("Resim başarıyla silindi!");
    } catch (error) {
      console.error(
        "Hata: Doküman veya resim silinirken bir hata oluştu",
        error
      );
      toast.error("Belge veya resim silinirken bir hata oluştu.");
    }
  };

  const handleEdit = (About) => {
    // Düzenleme modunu aç ve verileri forma doldur
    setEditingAbout(About.id);
    setGift(About.gift);
    setDescription(About.description);
    toast.success("Düzenleme modu açıldı!");
  };

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "About"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAboutes(data);
    };

    fetchData();
  }, [Aboutes]);

  return (
    <div className={styles.AboutAdminContainer}>
      <h2>AboutAdmin</h2>
      <form onSubmit={handleSubmit} className={styles.AboutAdminForm}>
        <label htmlFor="gift">Yeteneğiniz</label>
        <input
          type="text"
          name="gift"
          id="gift"
          value={gift}
          onChange={(e) => setGift(e.target.value)}
          className={styles.AboutAdminInput}
        />
        <label htmlFor="description">Kısa Açıklaması</label>
        <textarea
          rows="5"
          cols="80"
          name="description"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.AboutAdminTextarea}
        />
        <label htmlFor="file">İcon</label>
        <input type="file" onChange={handleFileChange} />
        {/* Seçilen resmin önizlemesi */}
        {selectedImage && (
          <div>
            <img
              src={selectedImage}
              alt="Uploaded"
              style={{ maxWidth: 150, maxHeight: 150 }}
            />
          </div>
        )}
        <button type="submit" className={styles.AboutAdminButton}>
          {editingAbout ? "Güncelle" : "Gönder"}
        </button>
      </form>

      <ul className={styles.AboutList}>
        {Aboutes.map((About) => (
          <li key={About.id} className={styles.AboutListItem}>
            <span>
              {" "}
              <img
                src={About.imageUrl}
                alt={About.title}
                style={{ maxWidth: 150, maxHeight: 150 }}
              />{" "}
            </span>
            <span>{About.gift}</span>
            <span>{About.description}</span>

            <button
              className={styles.AboutListItemButtonUpdate}
              onClick={() => handleEdit(About)}
            >
              Düzenle
            </button>
            <button onClick={() => handleDelete(About.id, About.imageUrl)}>
              Sil
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AboutAdmin;
