import React, { useEffect, useState } from "react";

import styles from "./Contact.module.css";
import { getImageUrl } from "../../utils";
import { collection, getDocs } from "firebase/firestore";
import db from "../../service/firebase";

const Contact = () => {
  const [contact, setContact] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Contact"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setContact(data);
      } catch (error) {
        console.error("Error fetching contact data: ", error);
      }
    };

    fetchData();
  }, []);
  return (
    <footer id="contact" className={styles.container}>
      <div className={styles.text}>
        {/* Display Title dynamically */}
        {contact.length > 0 && <h2>{contact[0].title}</h2>}
        {/* Optional: Display a message */}
        {contact.length === 0 && <p>Feel free to reach out!</p>}
      </div>
      <ul className={styles.links}>
        {contact.map((contactItem) => (
          <li key={contactItem.id} className={styles.link}>
            {contactItem.mail && (
              <>
                <img
                  src={getImageUrl("contact/emailIcon.png")}
                  alt="Email icon"
                />
                <a
                  className={styles.linkSpe}
                  href={`mailto:${contactItem.mail}`}
                >
                  {contactItem.mail}
                </a>
              </>
            )}
            {contactItem.linkedin && (
              <>
                <img
                  src={getImageUrl("contact/linkedinIcon.png")}
                  alt="LinkedIn icon"
                />
                <a className={styles.linkSpe} href={contactItem.linkedin}>
                  Linkedin/kaanxcode
                </a>
              </>
            )}
            {contactItem.github && (
              <>
                <img
                  src={getImageUrl("contact/githubIcon.png")}
                  alt="Github icon"
                />
                <a className={styles.linkSpe} href={contactItem.github}>
                  GitHub/kaanxcode
                </a>
              </>
            )}
          </li>
        ))}
      </ul>
    </footer>
    // <footer id="contact" className={styles.container}>
    //   <div className={styles.text}>
    //     {/* <h2>Tiitle buraya gelecek</h2> */}
    //     {/* <p>Feel free to reach out!</p> */}
    //   </div>
    //   <ul className={styles.links}>
    //     <li className={styles.link}>
    //       <img src={getImageUrl("contact/emailIcon.png")} alt="Email icon" />
    //       <a href="mailto:mksmus86@gmail.com">mksmus86@gmail.com</a>
    //     </li>
    //     <li className={styles.link}>
    //       <img
    //         src={getImageUrl("contact/linkedinIcon.png")}
    //         alt="LinkedIn icon"
    //       />
    //       <a href="https://www.linkedin.com/myname">linkedin.com/myname</a>
    //     </li>
    //     <li className={styles.link}>
    //       <img src={getImageUrl("contact/githubIcon.png")} alt="Github icon" />
    //       <a href="https://www.github.com/myname">github.com/myname</a>
    //     </li>
    //   </ul>
    // </footer>
  );
};

export default Contact;
