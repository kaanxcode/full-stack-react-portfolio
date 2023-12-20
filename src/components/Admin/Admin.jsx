// Admin.jsx
import React, { useState } from "react";
import HeroAdmin from "./HeroAdmin";
import AboutAdmin from "./AboutAdmin";
import ContactAdmin from "./ContactAdmin";
import styles from "./css/Admin.module.css"; // CSS dosyasını import edin
import ExperienceAdmin from "./ExperienceAdmin";
import Test from "./test";

const Admin = () => {
  const [selectedModule, setSelectedModule] = useState("hero");

  const handleModuleChange = (module) => {
    setSelectedModule(module);
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
            className={selectedModule === "contact" ? styles.active : ""}
            onClick={() => handleModuleChange("contact")}
          >
            Contact Module
          </li>
          <li
            className={selectedModule === "test" ? styles.active : ""}
            onClick={() => handleModuleChange("test")}
          >
            TEST
          </li>
        </ul>
      </nav>
      <div className={styles.content}>
        <h1>
          {selectedModule.charAt(0).toUpperCase() + selectedModule.slice(1)}{" "}
          Module
        </h1>
        <hr />
        {selectedModule === "hero" && <HeroAdmin />}
        {selectedModule === "about" && <AboutAdmin />}
        {selectedModule === "contact" && <ContactAdmin />}
        {selectedModule === "experience" && <ExperienceAdmin />}
        {selectedModule === "test" && <Test />}
      </div>
    </div>
  );
};

export default Admin;
