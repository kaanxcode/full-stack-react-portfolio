import React from 'react'
import { getImageUrl } from '../../utils'
import styles from './About.module.css'

const About = () => {
  return (
    <section className={styles.container} id="about">
      <h2 className={styles.title}>Hakkımda</h2>
      <div className={styles.content}>
        <img
          src={getImageUrl("about/aboutImage.png")}
          alt="Me sitting with a laptop"
          className={styles.aboutImage}
        />
        <ul className={styles.aboutItems}>
          <li className={styles.aboutItem}>
            <img src={getImageUrl("about/cursorIcon.png")} alt="Cursor icon" />
            <div className={styles.aboutItemText}>
              <h3>Full-Stack Devoloper</h3>
              <p>
               Asp.Net Mvc yapısını kullanark Full-stack websiteleri Tasarlayabilirim.
              </p>
            </div>
          </li>
          <li className={styles.aboutItem}>
            <img src={getImageUrl("about/serverIcon.png")} alt="Server icon" />
            <div className={styles.aboutItemText}>
              <h3>Front-end Developer</h3>
              <p>
               Bir javascript kütüphanesi olan React.js Kullanark Full resposive websiteleri tasarlayabilirim.
              </p>
            </div>
          </li>
          <li className={styles.aboutItem}>
            <img src={getImageUrl("about/cursorIcon.png")} alt="UI icon" />
            <div className={styles.aboutItemText}>
              <h3>Mobile Developer</h3>
              <p>
                Javascript framework'ü olan React Native Kullanark cross 
                platformlara yani Android ve Ios cihazlara mobil uygulamalar geliştirebilirm
              </p>
            </div>
          </li>
        </ul>
      </div>
    </section>
  )
}

export default About