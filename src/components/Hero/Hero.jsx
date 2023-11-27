/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import { getImageUrl } from '../../utils'
import styles from './Hero.module.css'

const Hero = () => {
  return (
    <section className={styles.container}>
        <div className={styles.content}>
            <h1 className={styles.title}>Ben Mustafa Kaan</h1>
            <p className={styles.description}>
              Kariyer hedeflerim React JS, React Native, ASP.NET (MVC), Web API gibi
                yazılım alanlarında uzmanlaşmak.
                15 yaşımın başlarından itibaren bilgisayarlara ve yazılıma ilgi duyarak
                büyüdüm ve geliştim. Eğitim hayatımı ve kariyerimi bu alana
                odaklayarak, uzun vadede büyük projelerde yer almayı hedefliyorum. 
            </p>
            <div className={styles.containerBtn}>
            <a href="mailto:myemail@gmail.com" className={styles.contactBtn}>Türkçe CV</a>
            <a href="mailto:myemail@gmail.com" className={styles.contactBtn2}>English CV</a>
            </div>
        </div>
        <img src={getImageUrl("hero/heroImage.png")} alt="hero-image" className={styles.heroImg}/>
        <div className={styles.topBlur}/>
        <div className={styles.bottomBlur}/>
    </section>
  )
}

export default Hero