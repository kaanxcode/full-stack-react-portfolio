import React, { useEffect, useState } from "react";
import { getImageUrl } from "../../utils";
import styles from "./About.module.css";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import db from "../../service/firebase";

const About = () => {
  const [gifts, setGifts] = useState([]);
  const [descriptions, setDescriptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Firestore'dan "about" koleksiyonundaki belgeleri çek
        const querySnapshot = await getDocs(collection(db, "About"));

        if (!querySnapshot.empty) {
          // İlk 3 belgeyi al
          const firstThreeDocuments = querySnapshot.docs.slice(0, 3);

          // Her bir belge için ayrı ayrı işlemleri gerçekleştir
          const giftsArray = [];
          const descriptionsArray = [];

          for (const document of firstThreeDocuments) {
            const aboutDoc = await getDoc(doc(db, "About", document.id));

            if (aboutDoc.exists()) {
              const data = aboutDoc.data();
              giftsArray.push(data.gift);
              descriptionsArray.push(data.description);
            } else {
              console.log(`About document not found for ID: ${document.id}`);
            }
          }

          // State'leri güncelle
          setGifts(giftsArray);
          setDescriptions(descriptionsArray);
        } else {
          console.log("No documents found in 'About' collection");
        }
      } catch (error) {
        console.error("Error fetching about documents: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <section className={styles.container} id="about">
      <h2 className={styles.title}>Hakkımda</h2>
      <div className={styles.content}>
        <img
          src={getImageUrl("about/aboutImage.png")}
          alt="Me sitting with a laptop"
          className={styles.aboutImage}
        />
        <ul className={styles.aboutItems}>
          {gifts.map((gift, index) => (
            <li key={index} className={styles.aboutItem}>
              {index === 0 && (
                <img
                  src={getImageUrl("about/cursorIcon.png")}
                  alt="Cursor icon"
                />
              )}
              {index === 1 && (
                <img
                  src={getImageUrl("about/serverIcon.png")}
                  alt="Server icon"
                />
              )}
              {index === 2 && (
                <img src={getImageUrl("about/cursorIcon.png")} alt="UI icon" />
              )}
              <div className={styles.aboutItemText}>
                <h3>{gift}</h3>
                <p>{descriptions[index]}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default About;
