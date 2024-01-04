// Admin.jsx
import React, { useState } from "react";
import HeroAdmin from "./HeroAdmin";
import AboutAdmin from "./AboutAdmin";
import ContactAdmin from "./ContactAdmin";
import styles from "./css/Admin.module.css"; // CSS dosyasını import edin
import ExperienceAdmin from "./ExperienceAdmin";
import Test from "./test";
import { logout } from "../../service/firebase";
import { useNavigate } from "react-router-dom";
import ProjectAdmin from "./ProjectAdmin";

const Admin = () => {
  const [selectedModule, setSelectedModule] = useState("hero");
  const navigate = useNavigate();

  const handleModuleChange = (module) => {
    setSelectedModule(module);
  };

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("user"); // Clear user information from local storage
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className={styles.admincontainer}>
      <nav className={styles.navbar}>
        <h2>Admin Panel</h2>
        <ul>
          <li
            className={selectedModule === "hero" ? styles.active : ""}
            onClick={() => handleModuleChange("hero")}
          >
            Hero Module
          </li>
          <li
            className={selectedModule === "about" ? styles.active : ""}
            onClick={() => handleModuleChange("about")}
          >
            About Module
          </li>
          <li
            className={selectedModule === "experience" ? styles.active : ""}
            onClick={() => handleModuleChange("experience")}
          >
            Experience Module
          </li>
          <li
            className={selectedModule === "project" ? styles.active : ""}
            onClick={() => handleModuleChange("project")}
          >
            Project Module
          </li>
          <li
            className={selectedModule === "contact" ? styles.active : ""}
            onClick={() => handleModuleChange("contact")}
          >
            Contact Module
          </li>

          <a onClick={handleLogout} className={styles.logout}>
            Çıkış Yap
          </a>
        </ul>
      </nav>
      <div className={styles.content}>
        {selectedModule === "hero" && <HeroAdmin />}
        {selectedModule === "about" && <AboutAdmin />}
        {selectedModule === "contact" && <ContactAdmin />}
        {selectedModule === "experience" && <ExperienceAdmin />}
        {selectedModule === "project" && <ProjectAdmin />}
        {selectedModule === "test" && <Test />}
      </div>
    </div>
  );
};

export default Admin;
