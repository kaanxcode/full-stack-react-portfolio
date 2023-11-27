// components/NavbarAdmin/NavbarAdmin.js
import React, { useState, useEffect } from 'react';
import  firestore  from '../../service/firebase';


const NavbarAdmin = () => {
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
    const fetchData = async () => {
      try {
        const response = await firestore.collection('Navbar').doc('data').get();
        const data = response.data();
        if (data) {
          setNavbarContent(data);
        }
      } catch (error) {
        console.error('Veri çekme hatası:', error);
      }
    };

    fetchData();
  }, []);

  const addMenuItem = () => {
    const newMenuItem = { id: Date.now(), title: "Yeni Menü", link: "#" };
    setNavbarContent({
      ...navbarContent,
      menuItems: [...navbarContent.menuItems, newMenuItem],
    });
  };

  const deleteMenuItem = (id) => {
    setNavbarContent({
      ...navbarContent,
      menuItems: navbarContent.menuItems.filter((item) => item.id !== id),
    });
  };

  const handleTitleChange = (e) => {
    setNavbarContent({ ...navbarContent, title: e.target.value });
  };

  const handleMenuItemChange = (id, field, value) => {
    setNavbarContent({
      ...navbarContent,
      menuItems: navbarContent.menuItems.map((menuItem) =>
        menuItem.id === id ? { ...menuItem, [field]: value } : menuItem
      ),
    });
  };

  const saveChanges = async () => {
    try {
      await firestore.collection('Navbar').doc('data').set(navbarContent);
      console.log('Değişiklikler kaydedildi:', navbarContent);
    } catch (error) {
      console.error('Değişiklikler kaydedilemedi:', error);
    }
  };
  return (
    <div>
      <h2>Navbar Düzenleme Paneli</h2>
      <label>
        Title:
        <input type="text" value={navbarContent.title} onChange={handleTitleChange} />
      </label>

      <ul>
        {navbarContent.menuItems.map((item) => (
          <li key={item.id}>
            <label>
              Başlık:
              <input
                type="text"
                value={item.title}
                onChange={(e) => handleMenuItemChange(item.id, 'title', e.target.value)}
              />
            </label>
            <label>
              Link:
              <input
                type="text"
                value={item.link}
                onChange={(e) => handleMenuItemChange(item.id, 'link', e.target.value)}
              />
            </label>
            <button onClick={() => deleteMenuItem(item.id)}>Sil</button>
          </li>
        ))}
      </ul>

      <button onClick={addMenuItem}>Menü Öğesi Ekle</button>
      <button onClick={saveChanges}>Değişiklikleri Kaydet</button>
    </div>
  );
};

export default NavbarAdmin;
