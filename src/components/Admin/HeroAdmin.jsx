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
import styles from "./css/HeroAdmin.module.css";

const HeroAdmin = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [heroes, setHeroes] = useState([]);
  const [editingHero, setEditingHero] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Veritabanına yeni veriyi eklemek için veya mevcut veriyi güncellemek için
    try {
      if (editingHero) {
        // Eğer düzenleme modunda ise
        await updateDoc(doc(db, "Hero", editingHero), {
          title: title,
          description: description,
        });
        setEditingHero(null); // Düzenleme modunu kapat
      } else {
        // Eğer yeni bir belge ekleniyorsa
        await addDoc(collection(db, "Hero"), {
          title: title,
          description: description,
        });
      }
    } catch (error) {
      console.error("Error adding/updating document: ", error);
    }

    // Formu sıfırla
    setTitle("");
    setDescription("");
  };

  const handleDelete = async (heroId) => {
    try {
      await deleteDoc(doc(db, "Hero", heroId));
      console.log("Document successfully deleted!");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleEdit = (hero) => {
    // Düzenleme modunu aç ve verileri forma doldur
    setEditingHero(hero.id);
    setTitle(hero.title);
    setDescription(hero.description);
  };

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "Hero"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHeroes(data);
    };

    fetchData();
  }, [heroes]);

  return (
    <div className={styles.heroAdminContainer}>
      <h2>HeroAdmin</h2>
      <form onSubmit={handleSubmit} className={styles.heroAdminForm}>
        <label htmlFor="title">İsminiz</label>
        <input
          type="text"
          name="title"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.HeroAdminInput}
        />
        <label htmlFor="description">Hakkımda Yazısı</label>
        <textarea
          rows="5"
          cols="80"
          name="description"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.HeroAdminTextarea}
        />
        <button type="submit" className={styles.HeroAdminButton}>
          {editingHero ? "Güncelle" : "Gönder"}
        </button>
      </form>

      <ul className={styles.heroList}>
        {heroes.map((hero) => (
          <li key={hero.id} className={styles.heroListItem}>
            <span>{hero.title}</span>
            <span>{hero.description}</span>

            <button
              className={styles.heroListItemButtonUpdate}
              onClick={() => handleEdit(hero)}
            >
              Düzenle
            </button>
            <button onClick={() => handleDelete(hero.id)}>Sil</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HeroAdmin;
