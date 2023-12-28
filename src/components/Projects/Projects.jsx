import React, { useEffect, useState } from "react";
import styles from "./Projects.module.css";
import { ProjectCard } from "./ProjectCard";
import { getDocs, collection } from "firebase/firestore";
import db from "../../service/firebase";

const Projects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Projects"));

        if (!querySnapshot.empty) {
          const projectsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setProjects(projectsData);
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
    <section className={styles.container} id="projects">
      <h2 className={styles.title}>Projects</h2>
      <div className={styles.projects}>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
};

export default Projects;
