import React, { useEffect, useState } from 'react';
import styles from './Navbar.module.css';
import { getImageUrl } from '../../utils';
import firestore from '../../service/firebase';

const Navbar = () => {
  // Admin modu açılsın ya da açılmasın, ayrı bir state kullanmamıza gerek yok
  const [menuOpen, setMenuOpen] = useState(false);
  const [navbarContent, setNavbarContent] = useState({
    title: "Mustafa Kaan Sevinç",
    menuItems: [
      { id: 1, title: "Hakkımda", link: "#about" },
      { id: 2, title: "Deneyimlerim", link: "#experience" },
      { id: 3, title: "Projelerim", link: "#projects" },
      { id: 4, title: "İletişim", link: "#contact" },
    ],
  });

  useEffect(() => {
    const unsubscribe = firestore.collection('Navbar').doc('data')
      .onSnapshot((doc) => {
        if (doc.exists) {
          setNavbarContent(doc.data());
        }
      });

    return () => unsubscribe();
  }, []);

  return (
    <nav className={styles.navbar}>
    <a className={styles.title} href="/">
      {navbarContent.title}
    </a>
    <div className={styles.menu}>
      <img
        className={styles.menuBtn}
        src={menuOpen ? getImageUrl('nav/closeIcon.png') : getImageUrl('nav/menuIcon.png')}
        alt="Menu-Buton"
        onClick={() => setMenuOpen(!menuOpen)}
      />

      <ul className={`${styles.menuItems} ${menuOpen && styles.menuOpen}`} onClick={() => setMenuOpen(false)}>
        {navbarContent.menuItems.map((item) => (
          <li key={item.id}>
            <a href={item.link}>{item.title}</a>
          </li>
        ))}
      </ul>
      
     
    </div>
  </nav>
  );
};

export default Navbar;
