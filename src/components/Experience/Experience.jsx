import React, { useEffect, useState } from "react";

import styles from "./Experience.module.css";
import skills from "../data/skills.json";
import history from "../data/history.json";
import { getImageUrl } from "../../utils";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import db from "../../service/firebase";

const Experience = () => {
  const [mySkill, setMySkill] = useState([]);
  const [image, setImage] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Experience"));

        if (!querySnapshot.empty) {
          const promises = querySnapshot.docs.map(async (document) => {
            const aboutDoc = await getDoc(doc(db, "Experience", document.id));
            if (aboutDoc.exists()) {
              const data = aboutDoc.data();
              return {
                skill: data.skillsName,
                image: data.imageUrl,
              };
            } else {
              console.log(`About document not found for ID: ${document.id}`);
              return null;
            }
          });

          const results = await Promise.all(promises);
          const filteredResults = results.filter(Boolean);

          const mySkillArray = filteredResults.map((result) => result.skill);
          const imageArray = filteredResults.map((result) => result.image);

          setMySkill(mySkillArray);
          setImage(imageArray);
        } else {
          console.log("No documents found in 'Experience' collection");
        }
      } catch (error) {
        console.error("Error fetching Experience documents: ", error);
      }
    };

    fetchData();
  }, []);
  return (
    <section className={styles.container} id="experience">
      <h2 className={styles.title}>Yeteneklerim</h2>
      <div className={styles.content}>
        <div className={styles.skills}>
          {mySkill.map((skill, index) => (
            <div key={index} className={styles.skill}>
              <div className={styles.skillImageContainer}>
                <img src={image[index]} alt={skill} />
              </div>
              <p>{skill}</p>
            </div>
          ))}
        </div>
        {/* <ul className={styles.history}>
          {history.map((historyItem, id) => {
            return (
              <li key={id} className={styles.historyItem}>
                <div className={styles.historyItemDetails}>
                  <h3>{`${historyItem.role}, ${historyItem.organisation}`}</h3>
                  <p>{`${historyItem.startDate} - ${historyItem.endDate}`}</p>
                  <ul>
                    {historyItem.experiences.map((experience, id) => {
                      return <li key={id}>{experience}</li>;
                    })}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul> */}
      </div>
    </section>
  );
};

export default Experience;
