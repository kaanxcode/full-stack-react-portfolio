// eslint-disable-next-line no-unused-vars
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
import styles from "./css/ExperienceAdmin.module.css";

const ExperienceAdmin = () => {
  const [title, setTitle] = useState("");
  const [skillsName, setSkillsName] = useState("");
  const [skillsIcon, setSkillsIcon] = useState("");
  // New state variables with "history" prefix
  const [historyRole, setHistoryRole] = useState("");
  const [historyOrganisation, setHistoryOrganisation] = useState("");
  const [historyStartDate, setHistoryStartDate] = useState("");
  const [historyEndDate, setHistoryEndDate] = useState("");
  const [historyExperiences, setHistoryExperiences] = useState("");
  const [historyImageSrc, setHistoryImageSrc] = useState("");

  const [experiences, setExperiences] = useState([]);
  const [editingExperience, setEditingExperience] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Veritabanına yeni veriyi eklemek için veya mevcut veriyi güncellemek için
    try {
      if (editingExperience) {
        // Eğer düzenleme modunda ise
        await updateDoc(doc(db, "Experience", editingExperience), {
          title: title,
          skillsName: skillsName,
          skillsIcon: skillsIcon,
          historyRole: historyRole,
          historyOrganisation: historyOrganisation,
          historyStartDate: historyStartDate,
          historyEndDate: historyEndDate,
          historyExperiences: historyExperiences,
          historyImageSrc: historyImageSrc,
        });
        setEditingExperience(null); // Düzenleme modunu kapat
      } else {
        // Eğer yeni bir belge ekleniyorsa
        await addDoc(collection(db, "Experience"), {
          title: title,
          skillsName: skillsName,
          skillsIcon: skillsIcon,
          historyRole: historyRole,
          historyOrganisation: historyOrganisation,
          historyStartDate: historyStartDate,
          historyEndDate: historyEndDate,
          historyExperiences: historyExperiences,
          historyImageSrc: historyImageSrc,
        });
      }
    } catch (error) {
      console.error("Error adding/updating document: ", error);
    }

    // Formu sıfırla
    setTitle("");
    setSkillsName("");
    setSkillsIcon("");
    setHistoryRole("");
    setHistoryOrganisation("");
    setHistoryStartDate("");
    setHistoryEndDate("");
    setHistoryExperiences("");
    setHistoryImageSrc("");
  };

  const handleDelete = async (experienceId) => {
    try {
      await deleteDoc(doc(db, "Experience", experienceId));
      console.log("Document successfully deleted!");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleEdit = (experience) => {
    // Düzenleme modunu aç ve verileri forma doldur
    setEditingExperience(experience.id);
    setTitle(experience.title);
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
        <label htmlFor="title">Başlık</label>
        <input
          type="text"
          name="title"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.experienceAdminInput}
        />

        <label htmlFor="skillsName">Yetenek Adı</label>
        <input
          type="text"
          name="skillsName"
          id="skillsName"
          value={skillsName}
          onChange={(e) => setSkillsName(e.target.value)}
          className={styles.experienceAdminTextarea}
        />

        <label htmlFor="skillsIcon">Yetenek Icon</label>
        <input
          type="text"
          name="skillsIcon"
          id="skillsIcon"
          value={skillsIcon}
          onChange={(e) => setSkillsIcon(e.target.value)}
          className={styles.experienceAdminInput}
        />
        <div className={styles.historyMenu}>
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
          <input
            type="text"
            name="historyImageSrc"
            id="historyImageSrc"
            value={historyImageSrc}
            onChange={(e) => setHistoryImageSrc(e.target.value)}
            className={styles.experienceAdminInput}
          />
        </div>

        <button type="submit" className={styles.experienceAdminButton}>
          {editingExperience ? "Güncelle" : "Gönder"}
        </button>
      </form>

      <ul className={styles.experienceList}>
        {experiences.map((experience) => (
          <li key={experience.id} className={styles.experienceListItem}>
            <span>{experience.title}</span>
            <span>{experience.skillsName}</span>
            <span>{experience.skillsIcon}</span>

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
