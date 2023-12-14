/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from "react";
import { getImageUrl } from "../../utils";
import styles from "./Hero.module.css";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import db from "../../service/firebase";

const Hero = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Firestore'dan "hero" koleksiyonundaki belgeleri çek
        const querySnapshot = await getDocs(collection(db, "Hero"));

        // İlk belgeyi al ve ID'sini kullanarak belge verilerini çek
        if (!querySnapshot.empty) {
          const firstDocument = querySnapshot.docs[0];
          const heroDoc = await getDoc(doc(db, "Hero", firstDocument.id));

          if (heroDoc.exists()) {
            const data = heroDoc.data();
            setName(data.title);
            setDescription(data.description);
          } else {
            console.log("Hero document not found");
          }
        } else {
          console.log("No documents found in 'hero' collection");
        }
      } catch (error) {
        console.error("Error fetching Hero documents: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Ben {name}</h1>
        <p className={styles.description}>{description}</p>
        <div className={styles.containerBtn}>
          <a href="mailto:myemail@gmail.com" className={styles.contactBtn}>
            Türkçe CV
          </a>
          <a href="mailto:myemail@gmail.com" className={styles.contactBtn2}>
            English CV
          </a>
        </div>
      </div>
      <img
        src={getImageUrl("hero/heroImage.png")}
        alt="hero-image"
        className={styles.heroImg}
      />
      <div className={styles.topBlur} />
      <div className={styles.bottomBlur} />
    </section>
  );
};

export default Hero;
