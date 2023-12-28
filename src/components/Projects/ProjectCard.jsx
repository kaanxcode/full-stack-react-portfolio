import React, { useEffect, useState } from "react";

import styles from "./ProjectCard.module.css";
import { getImageUrl } from "../../utils";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import db from "../../service/firebase";

export const ProjectCard = ({ project }) => {
  const { title, imageUrl, description, hashtag, demo, source } = project;

  const [image, setImage] = useState([]);

  const [hashtags, setHashtags] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Firestore'dan "Projects" koleksiyonundaki belgeleri çek
        const querySnapshot = await getDocs(collection(db, "Projects"));

        // İlk üç belgeyi al ve ID'lerini kullanarak belge verilerini çek
        if (!querySnapshot.empty) {
          const firstThreeDocuments = querySnapshot.docs.slice(0, 3);

          const titleArray = [];
          const descriptionsArray = [];
          const imageArray = [];
          const hashtagsArray = [];
          const demoArray = [];
          const sourceArray = [];

          for (const document of firstThreeDocuments) {
            const heroDoc = await getDoc(doc(db, "Projects", document.id));

            if (heroDoc.exists()) {
              const data = heroDoc.data();
              titleArray.push(data.title);
              descriptionsArray.push(data.description);
              imageArray.push(data.imageUrl);
              hashtagsArray.push(data.hashtag);
              demoArray.push(data.demo);
              sourceArray.push(data.source);
            } else {
              console.log(`Project document not found for ID: ${document.id}`);
            }
          }

          setImage(imageArray);
          setHashtags(hashtagsArray);
        } else {
          console.log("No documents found in 'Projects' collection");
        }
      } catch (error) {
        console.error("Error fetching Project documents: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <img src={imageUrl} alt={`Image of ${title}`} className={styles.image} />
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      <ul className={styles.skills}>
        {hashtag &&
          hashtag.map((tag, id) => (
            <li key={id} className={styles.skill}>
              {tag}
            </li>
          ))}
      </ul>
      <div className={styles.links}>
        <a href={demo} className={styles.link}>
          Demo
        </a>
        <a href={source} className={styles.link}>
          Source
        </a>
      </div>
    </div>
  );
};
