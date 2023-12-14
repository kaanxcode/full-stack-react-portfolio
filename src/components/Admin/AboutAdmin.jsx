import React, { useEffect, useState } from "react";
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

const AboutAdmin = () => {
  const [gift, setGift] = useState("");
  const [description, setDescription] = useState("");
  const [Aboutes, setAboutes] = useState([]);
  const [editingAbout, setEditingAbout] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Veritabanına yeni veriyi eklemek için veya mevcut veriyi güncellemek için
    try {
      if (editingAbout) {
        // Eğer düzenleme modunda ise
        await updateDoc(doc(db, "About", editingAbout), {
          gift: gift,
          description: description,
        });
        setEditingAbout(null); // Düzenleme modunu kapat
      } else {
        // Eğer yeni bir belge ekleniyorsa
        await addDoc(collection(db, "About"), {
          gift: gift,
          description: description,
        });
      }
    } catch (error) {
      console.error("Error adding/updating document: ", error);
    }

    // Formu sıfırla
    setGift("");
    setDescription("");
  };

  const handleDelete = async (AboutId) => {
    try {
      await deleteDoc(doc(db, "About", AboutId));
      console.log("Document successfully deleted!");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleEdit = (About) => {
    // Düzenleme modunu aç ve verileri forma doldur
    setEditingAbout(About.id);
    setGift(About.gift);
    setDescription(About.description);
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
        <button type="submit" className={styles.AboutAdminButton}>
          {editingAbout ? "Güncelle" : "Gönder"}
        </button>
      </form>

      <ul className={styles.AboutList}>
        {Aboutes.map((About) => (
          <li key={About.id} className={styles.AboutListItem}>
            <span>{About.gift}</span>
            <span>{About.description}</span>

            <button
              className={styles.AboutListItemButtonUpdate}
              onClick={() => handleEdit(About)}
            >
              Düzenle
            </button>
            <button onClick={() => handleDelete(About.id)}>Sil</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AboutAdmin;
