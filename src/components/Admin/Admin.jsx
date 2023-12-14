// Admin.jsx
import React from "react";
import HeroAdmin from "./HeroAdmin";
import AboutAdmin from "./AboutAdmin";
import ContactAdmin from "./ContactAdmin";
import "./css/Admin.module.css";

const Admin = () => {
  return (
    <div className="admin-container">
      <h1>Admin Panel</h1>
      <nav>
        <ul>
          <li>
            <a href="#hero">Hero</a>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
      </nav>
      <hr />
      <section id="hero">
        <HeroAdmin />
      </section>
      <hr />
      <section id="about">
        <AboutAdmin />
      </section>
      <hr />
      <section id="contact">
        <ContactAdmin />
      </section>
    </div>
  );
};

export default Admin;
