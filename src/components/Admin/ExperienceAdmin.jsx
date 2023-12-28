// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import db, { storage } from "../../service/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import styles from "./css/ExperienceAdmin.module.css";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import toast from "react-hot-toast";

const ExperienceAdmin = () => {
  // const [title, setTitle] = useState("");
  const [skillsName, setSkillsName] = useState("");
  const [skillsIcon, setSkillsIcon] = useState("");
  // New state variables with "history" prefix
  // const [historyRole, setHistoryRole] = useState("");
  // const [historyOrganisation, setHistoryOrganisation] = useState("");
  // const [historyStartDate, setHistoryStartDate] = useState("");
  // const [historyEndDate, setHistoryEndDate] = useState("");
  // const [historyExperiences, setHistoryExperiences] = useState("");
  // const [historyImageSrc, setHistoryImageSrc] = useState("");

  const [experiences, setExperiences] = useState([]);
  const [editingExperience, setEditingExperience] = useState(null);
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
      console.error("Hata uploadImage fonksiyonunda:", error);
      toast.error("Rseim Güncellenemdi");
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
      console.error("Error saving image info: ", error);
      toast.error("Resim kaydedilirken hata oluştu: ");
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
        console.log("Gönderildi!");
        toast.success("Resim Gönderildi!");
      } else {
        console.log("Lütfen önce bir resim seçin!");
        toast.error("Lütfen önce bir resim seçin!");
      }
      if (editingExperience) {
        // Eğer düzenleme modunda ise
        await updateDoc(doc(db, "Experience", editingExperience), {
          // title: title,
          skillsName: skillsName,
          skillsIcon: skillsIcon,
          // historyRole: historyRole,
          // historyOrganisation: historyOrganisation,
          // historyStartDate: historyStartDate,
          // historyEndDate: historyEndDate,
          // historyExperiences: historyExperiences,
          // historyImageSrc: historyImageSrc,
        });
        toast.success("Veri güncellendi");
        setEditingExperience(null); // Düzenleme modunu kapat
      } else {
        const downloadURL = await uploadImage(file);
        // Eğer yeni bir belge ekleniyorsa
        await addDoc(collection(db, "Experience"), {
          // title: title,
          skillsName: skillsName,
          imageUrl: downloadURL, // Eğer resim URL'sini saklamak istiyorsanız
          createdAt: new Date(),
          // historyRole: historyRole,
          // historyOrganisation: historyOrganisation,
          // historyStartDate: historyStartDate,
          // historyEndDate: historyEndDate,
          // historyExperiences: historyExperiences,
          // historyImageSrc: historyImageSrc,
        });
        toast.success("Başarıyla eklendi!");
      }
    } catch (error) {
      console.error("Error adding/updating document: ", error);
      toast.error("Hata oluştu ");
    }

    // Formu sıfırla
    // setTitle("");
    setSkillsName("");
    setSkillsIcon("");
    // setHistoryRole("");
    // setHistoryOrganisation("");
    // setHistoryStartDate("");
    // setHistoryEndDate("");
    // setHistoryExperiences("");
    // setHistoryImageSrc("");
    setSelectedImage(null);
    setFile(null);
  };

  const handleDelete = async (experienceId, imageUrl) => {
    try {
      await deleteDoc(doc(db, "Experience", experienceId));
      console.log("Document successfully deleted!");
      toast.success("Veri başarıyla silindi!");
      // Resmi Firebase Storage'dan sil
      const storageRef = ref(storage, imageUrl);
      await deleteObject(storageRef);
      console.log("Resim başarıyla silindi!");
      toast.success("Resim başarıyla silindi!");
    } catch (error) {
      console.error("Error deleting document: ", error);
      toast.error("Hata oluştu");
    }
  };

  const handleEdit = (experience) => {
    // Düzenleme modunu aç ve verileri forma doldur
    setEditingExperience(experience.id);
    // setTitle(experience.title);
    setSkillsName(experience.skillsName);
    setSkillsIcon(experience.skillsIcon);
  };

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "Experience"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setExperiences(data);
    };

    fetchData();
  }, [experiences]);

  return (
    <div className={styles.experienceAdminContainer}>
      <h2>ExperienceAdmin</h2>
      <form onSubmit={handleSubmit} className={styles.experienceAdminForm}>
        {/* <label htmlFor="title">Başlık</label>
        <input
          type="text"
          name="title"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.experienceAdminInput}
        /> */}

        <label htmlFor="skillsName">Yetenek Adı</label>
        <input
          type="text"
          name="skillsName"
          id="skillsName"
          value={skillsName}
          onChange={(e) => setSkillsName(e.target.value)}
          className={styles.experienceAdminTextarea}
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
        {/* <div className={styles.historyMenu}>
          <label htmlFor="historyRole">History Role</label>
          <input
            type="text"
            name="historyRole"
            id="historyRole"
            value={historyRole}
            onChange={(e) => setHistoryRole(e.target.value)}
            className={styles.experienceAdminInput}
          />

          <label htmlFor="historyOrganisation">History Organisation</label>
          <input
            type="text"
            name="historyOrganisation"
            id="historyOrganisation"
            value={historyOrganisation}
            onChange={(e) => setHistoryOrganisation(e.target.value)}
            className={styles.experienceAdminInput}
          />

          <label htmlFor="historyStartDate">History Start Date</label>
          <input
            type="text"
            name="historyStartDate"
            id="historyStartDate"
            value={historyStartDate}
            onChange={(e) => setHistoryStartDate(e.target.value)}
            className={styles.experienceAdminInput}
          />

          <label htmlFor="historyEndDate">History End Date</label>
          <input
            type="text"
            name="historyEndDate"
            id="historyEndDate"
            value={historyEndDate}
            onChange={(e) => setHistoryEndDate(e.target.value)}
            className={styles.experienceAdminInput}
          />

          <label htmlFor="historyExperiences">History Experiences</label>
          <textarea
            rows="5"
            cols="80"
            name="historyExperiences"
            id="historyExperiences"
            value={historyExperiences}
            onChange={(e) => setHistoryExperiences(e.target.value)}
            className={styles.experienceAdminTextarea}
          />

          <label htmlFor="historyImageSrc">History Image Src</label>
          <inputd
            type="text"
            name="historyImageSrc"
            id="historyImageSrc"
            value={historyImageSrc}
            onChange={(e) => setHistoryImageSrc(e.target.value)}
            className={styles.experienceAdminInput}
          />
        </div> */}

        <button type="submit" className={styles.experienceAdminButton}>
          {editingExperience ? "Güncelle" : "Gönder"}
        </button>
      </form>

      <ul className={styles.experienceList}>
        {experiences.map((experience) => (
          <li key={experience.id} className={styles.experienceListItem}>
            {/* <span>{experience.title}</span> */}
            <span>
              {" "}
              <img
                src={experience.imageUrl}
                alt={experience.title}
                style={{ maxWidth: 150, maxHeight: 150 }}
              />{" "}
            </span>
            <span>{experience.skillsName}</span>

            <button
              className={styles.experienceListItemButtonUpdate}
              onClick={() => handleEdit(experience)}
            >
              Düzenle
            </button>
            <button onClick={() => handleDelete(experience.id)}>Sil</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExperienceAdmin;
