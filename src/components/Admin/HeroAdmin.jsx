// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
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
import styles from "./css/HeroAdmin.module.css";
import toast from "react-hot-toast";

const HeroAdmin = () => {
  // --- STATE HOOKS ---
  const [title, setTitle] = useState(""); // İsim girişi için state
  const [description, setDescription] = useState(""); // Açıklama girişi için state
  const [selectedImage, setSelectedImage] = useState(null); // Seçilen resmin önizlemesi için state
  const [file, setFile] = useState(null); // Seçilen dosya için state
  const [heroes, setHeroes] = useState([]); // Kahraman listesi için state
  const [editingHero, setEditingHero] = useState(null); // Düzenleme modu için state
  const [cvTr, setCvTr] = useState(""); // Türkçe CV için state
  const [cvEn, setCvEn] = useState(""); // İngilizce CV için state

  // --- FIREBASE İŞLEMLERİ ---
  const uploadImage = async (file) => {
    // Seçilen resmi Firebase Storage'a yükle
    const storageRef = ref(storage, `images/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
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
      console.error("Error saving image info: ", error);
      toast.error("Resim kaydedilirken şu hata oluştu: ", error);
    }
  };

  // --- FORM İŞLEMLERİ ---
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

    try {
      if (file) {
        // Eğer dosya seçildiyse, resmi yükle ve bilgileri kaydet
        const downloadURL = await uploadImage(file);
        await saveImageInfo(downloadURL);
        console.log("Gönderildi!");
        toast.success("Gönderildi!");
      } else {
        console.log("Lütfen önce bir resim seçin!");
        toast.error("Lütfen önce bir resim seçin!");
      }

      if (editingHero) {
        // Düzenleme modunda ise, Firestore'da güncelleme yap
        await updateDoc(doc(db, "Hero", editingHero), {
          title: title,
          description: description,
          cvTr: cvTr,
          cvEn: cvEn,
        });
        console.log("Doküman başarıyla güncellendi!");
        setEditingHero(null); // Düzenleme modunu kapat
      } else {
        // Yeni bir kahraman ekleniyorsa, Firestore'a ekle

        const downloadURL = await uploadImage(file);
        await addDoc(collection(db, "Hero"), {
          title: title,
          description: description,
          cvTr: cvTr,
          cvEn: cvEn,
          imageUrl: downloadURL, // Eğer resim URL'sini saklamak istiyorsanız
          createdAt: new Date(),
        });
        console.log("Doküman başarıyla eklendi!");
      }
    } catch (error) {
      toast.error(
        "Hata: Doküman eklenir/güncellenirken bir hata oluştu",
        error
      );
      toast.error("Doküman eklenir/güncellenirken bir hata oluştu.");
    }

    // Formu sıfırla
    setTitle("");
    setDescription("");
    setSelectedImage(null);
    setFile(null);
    setCvTr("");
    setCvEn("");
  };

  const handleDelete = async (heroId, imageUrl) => {
    try {
      // Firestore'dan kahramanı sil
      await deleteDoc(doc(db, "Hero", heroId));
      console.log("Doküman başarıyla silindi!");
      toast.success("Doküman başarıyla silindi!");

      // Resmi Firebase Storage'dan sil
      const storageRef = ref(storage, imageUrl);
      await deleteObject(storageRef);
      console.log("Resim başarıyla silindi!");
      toast.success("Resim başarıyla silindi!");
    } catch (error) {
      console.error(
        "Hata: Doküman veya resim silinirken bir hata oluştu",
        error
      );
      toast.error("Doküman veya resim silinirken bir hata oluştu.");
    }
  };

  const handleEdit = (hero) => {
    // Düzenleme modunu aç ve verileri forma doldur
    setEditingHero(hero.id);
    setTitle(hero.title);
    setDescription(hero.description);
    setCvTr(hero.cvTr);
    setCvEn(hero.cvEn);
  };

  // --- VERİ GETİRME ---
  useEffect(() => {
    // Sayfa yüklendiğinde Firebase'den kahraman verilerini çek
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "Hero"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHeroes(data);
    };

    fetchData();
  }, [heroes]); // useEffect, heroes state'i değiştiğinde çalışacak

  // --- RENDER ---
  return (
    <div className={styles.heroAdminContainer}>
      <h2>HeroAdmin</h2>
      {/* Form için */}
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
        <label htmlFor="cvTr">Türkçe CV Linkiniz</label>
        <input
          type="text"
          name="cvTr"
          id="cvTr"
          value={cvTr}
          onChange={(e) => setCvTr(e.target.value)}
          className={styles.HeroAdminInput}
        />
        <label htmlFor="cvEn">İngilizce CV Linkiniz</label>
        <input
          type="text"
          name="cvEn"
          id="cvEn"
          value={cvEn}
          onChange={(e) => setCvEn(e.target.value)}
          className={styles.HeroAdminInput}
        />
        <label htmlFor="file">Resminizi Seçiniz</label>
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

        <button type="submit" className={styles.HeroAdminButton}>
          {editingHero ? "Güncelle" : "Gönder"}
        </button>
      </form>

      {/* Kahraman listesi için */}
      <ul className={styles.heroList}>
        {heroes.map((hero) => (
          <li key={hero.id} className={styles.heroListItem}>
            <span>{hero.title}</span>
            <span>{hero.description}</span>
            <a
              href={hero.cvTr}
              className={styles.contactBtn}
              target="_blank"
              rel="noreferrer"
            >
              Türkçe CV
            </a>
            <a
              href={hero.cvEn}
              className={styles.contactBtn2}
              target="_blank"
              rel="noreferrer"
            >
              English CV
            </a>

            <span>
              {" "}
              <img
                src={hero.imageUrl}
                alt={hero.title}
                style={{ maxWidth: 150, maxHeight: 150 }}
              />{" "}
            </span>

            {/* Eğer hero nesnesinde bir resim URL'si varsa, küçük bir önizleme göster */}
            {hero.url && (
              <img
                src={hero.url}
                alt="Hero Preview"
                style={{ maxWidth: 50, maxHeight: 50 }}
              />
            )}

            <button
              className={styles.heroListItemButtonUpdate}
              onClick={() => handleEdit(hero)}
            >
              Düzenle
            </button>
            <button onClick={() => handleDelete(hero.id, hero.imageUrl)}>
              Sil
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HeroAdmin;
