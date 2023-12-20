// ContactAdmin.jsx
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
import styles from "./css/ContactAdmin.module.css"; // Corrected the import

const ContactAdmin = () => {
  const [title, setTitle] = useState("");
  const [mail, setMail] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [contact, setContact] = useState([]);
  const [editingContact, setEditingContact] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingContact) {
        await updateDoc(doc(db, "Contact", editingContact), {
          title: title,
          mail: mail,
          linkedin: linkedin,
          github: github,
        });
        setEditingContact(null);
      } else {
        await addDoc(collection(db, "Contact"), {
          title: title,
          mail: mail,
          linkedin: linkedin,
          github: github,
        });
      }
    } catch (error) {
      console.error("Error adding/updating document: ", error);
    }

    setTitle("");
    setMail("");
    setLinkedin("");
    setGithub("");
  };

  const handleDelete = async (contactId) => {
    try {
      await deleteDoc(doc(db, "Contact", contactId));
      console.log("Document successfully deleted!");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleEdit = (contact) => {
    setEditingContact(contact.id);
    setTitle(contact.title);
    setMail(contact.mail);
    setLinkedin(contact.linkedin);
    setGithub(contact.github);
  };

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "Contact"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setContact(data);
    };

    fetchData();
  }, [contact]);

  return (
    <div className={styles.ContactAdminContainer}>
      <h2>ContactAdmin</h2>
      <form onSubmit={handleSubmit} className={styles.ContactAdminForm}>
        <label htmlFor="title">Başlık</label>
        <input
          type="text"
          name="title"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.ContactAdminTitle}
        />
        <label htmlFor="mail">Mail</label>
        <input
          type="email"
          name="mail"
          id="mail"
          value={mail}
          onChange={(e) => setMail(e.target.value)}
          className={styles.ContactAdminMail}
        />
        <label htmlFor="linkedin">Linkedin</label>
        <input
          type="text"
          name="linkedin"
          id="linkedin"
          value={linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
          className={styles.ContactAdminLinkedin}
        />
        <label htmlFor="github">Github</label>
        <input
          type="text"
          name="github"
          id="github"
          value={github}
          onChange={(e) => setGithub(e.target.value)}
          className={styles.ContactAdminGithub}
        />
        <button type="submit" className={styles.ContactAdminButton}>
          {editingContact ? "Güncelle" : "Gönder"}
        </button>
      </form>

      <ul className={styles.ContactList}>
        {contact.map((contactItem) => (
          <li key={contactItem.id} className={styles.ContactListItem}>
            <span>{contactItem.title}</span>
            <span>{contactItem.mail}</span>
            <span>{contactItem.linkedin}</span>
            <span>{contactItem.github}</span>

            <button
              className={styles.ContactListItemButtonUpdate}
              onClick={() => handleEdit(contactItem)}
            >
              Düzenle
            </button>
            <button onClick={() => handleDelete(contactItem.id)}>Sil</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactAdmin;
