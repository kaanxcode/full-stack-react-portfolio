import React, { useState } from "react";
import db from "../../service/firebase";

const Test = () => {
  const [formData, setFormData] = useState({
    imageSrc: "",
    title: "",
    description: "",
    skills: [],
    demo: "",
    source: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddSkill = () => {
    setFormData((prevData) => ({
      ...prevData,
      skills: [...prevData.skills, "New Skill"],
    }));
  };

  const db = db;

  const handleSubmit = async (e, db) => {
    e.preventDefault();

    try {
      // Add your Firebase Firestore collection name here
      const collectionName = "Projects";

      // Add the data to Firebase Firestore
      await db.collection(collectionName).add(formData);

      // Clear the form after submission
      setFormData({
        imageSrc: "",
        title: "",
        description: "",
        skills: [],
        demo: "",
        source: "",
      });

      console.log("Form submitted successfully");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Image Source:
          <input
            type="text"
            name="imageSrc"
            value={formData.imageSrc}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Skills:
          <ul>
            {formData.skills.map((skill, id) => (
              <li key={id}>{skill}</li>
            ))}
          </ul>
          <button type="button" onClick={handleAddSkill}>
            Add Skill
          </button>
        </label>
        <br />
        <label>
          Demo Link:
          <input
            type="text"
            name="demo"
            value={formData.demo}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Source Link:
          <input
            type="text"
            name="source"
            value={formData.source}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Test;
