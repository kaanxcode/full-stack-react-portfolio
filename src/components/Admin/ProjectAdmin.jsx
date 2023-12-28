import { useEffect, useState } from "react";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import db, { storage } from "../../service/firebase";
import styles from "./css/ProjectAdmin.module.css";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import toast from "react-hot-toast";

const ProjectsAdmin = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [file, setFile] = useState(null);
  const [hashtag, setHashtag] = useState("");
  const [hashtags, setHashtags] = useState([]); // Diziyi ayrı bir state olarak ekledim
  const [demo, setDemo] = useState("");
  const [source, setSource] = useState("");
  const [projects, setProjects] = useState([]);
  const [editingProjectId, setEditingProjectId] = useState(null); // Düzenleme modunu takip etmek için proje ID'si

  // Hashtagleri ayırmak için kullanılan fonksiyon
  function hashtagFonksiyonu(hashtag) {
    if (!hashtag || typeof hashtag !== "string") {
      return [];
    }
    return hashtag.split(" ").filter((word) => word.trim() !== "");
  }

  const uploadImage = async (file) => {
    try {
      const storageRef = ref(storage, `images/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Hata uploadImage fonksiyonunda:", error);
      toast.error("Hata uploadImage fonksiyonunda:", error);
      throw error;
    }
  };

  const saveImageInfo = async (downloadURL) => {
    try {
      // Resim bilgilerini Firestore'a kaydetme işlemleri burada olmalı
      // Bu kısmı senin projene göre düzenlemen gerekebilir
      const imageInfo = {
        url: downloadURL,
        createdAt: new Date(),
      };
      toast.success("Resim kaydedildi!");
    } catch (error) {
      console.error("Error saving image info: ", error);
      toast.error("Resim kaydedilirken şu hata oluştu: ", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (file) {
        const downloadURL = await uploadImage(file);
        await saveImageInfo(downloadURL);
        console.log("Gönderildi!");
        toast.success("Gönderildi!");
      } else {
        console.log("Lütfen önce bir resim seçin!");
        toast.error("Lütfen önce bir resim seçin!");
      }

      if (editingProjectId) {
        await updateDoc(doc(db, "Projects", editingProjectId), {
          title: title,
          description: description,
          hashtag: hashtags,
          demo: demo,
          source: source,
        });
        console.log("Doküman başarıyla güncellendi!");
        setEditingProjectId(null);
      } else {
        const downloadURL = await uploadImage(file);
        await addDoc(collection(db, "Projects"), {
          title: title,
          description: description,
          hashtag: hashtags,
          demo: demo,
          source: source,
          imageUrl: downloadURL,
          createdAt: new Date(),
        });
        console.log("Doküman başarıyla eklendi!");
      }
    } catch (error) {
      console.error("Error adding/updating document: ", error);
      toast.error("Hata oluştu: ", error);
    }

    setTitle("");
    setDescription("");
    setHashtag("");
    setHashtags([]); // Hashtag dizisini sıfırla
    setDemo("");
    setSource("");
    setSelectedImage(null);
    setFile(null);
  };

  const handleDelete = async (projectId, imageUrl) => {
    try {
      await deleteDoc(doc(db, "Projects", projectId));
      console.log("Document successfully deleted!");
      toast.success("Doküman başarıyla silindi!");

      const storageRef = ref(storage, imageUrl);
      await deleteObject(storageRef);
      console.log("Resim başarıyla silindi!");
      toast.success("Resim başarıyla silindi!");
    } catch (error) {
      console.error(
        "Hata: Doküman veya resim silinirken bir hata oluştu",
        error
      );
      toast.error("Doküman veya resim silinirken bir hata oluştu.");
    }
  };

  const handleEdit = (project) => {
    setEditingProjectId(project.id);
    setTitle(project.title);
    setDescription(project.description);
    setHashtags(project.hashtag); // Hashtagleri setHashtags ile ayarla
    setDemo(project.demo);
    setSource(project.source);
  };

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "Projects"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProjects(data);
    };

    fetchData();
  }, [projects]);

  return (
    <div className={styles.ProjectAdminContainer}>
      <form onSubmit={handleSubmit} className={styles.ProjectAdminForm}>
        <label htmlFor="file">Resim</label>
        <input type="file" onChange={handleFileChange} />
        {selectedImage && (
          <div>
            <img
              src={selectedImage}
              alt="Uploaded"
              style={{ maxWidth: 150, maxHeight: 150 }}
            />
          </div>
        )}
        <label htmlFor="title">Proje Başlığı</label>
        <input
          type="text"
          name="title"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.ProjectAdminInput}
        />
        <label htmlFor="description">Kısa Proje Açıklaması</label>
        <textarea
          rows="5"
          cols="80"
          name="description"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.ProjectAdminTextarea}
        />
        <label htmlFor="hashtag">Etiketler</label>
        <input
          type="text"
          name="hashtag"
          id="hashtag"
          value={hashtag}
          onChange={(e) => {
            setHashtag(e.target.value);
            setHashtags(hashtagFonksiyonu(e.target.value));
          }}
          className={styles.ProjectAdminInput}
        />
        <label htmlFor="demo">Demo Linki</label>
        <input
          type="text"
          name="demo"
          id="demo"
          value={demo}
          onChange={(e) => setDemo(e.target.value)}
          className={styles.ProjectAdminInput}
        />
        <label htmlFor="source">Kaynak Kod Linki</label>
        <input
          type="text"
          name="source"
          id="source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className={styles.ProjectAdminInput}
        />
        <button type="submit" className={styles.ProjectAdminButton}>
          {editingProjectId ? "Güncelle" : "Gönder"}
        </button>
      </form>

      <ul className={styles.ProjectsList}>
        {projects.map((project) => (
          <li key={project.id} className={styles.ProjectsListItem}>
            <span>
              <img
                src={project.imageUrl}
                alt={project.title}
                style={{ maxWidth: 150, maxHeight: 150 }}
              />
            </span>
            <span>{project.title}</span>
            <span>{project.description}</span>
            <span>{project.hashtag.join(" ")}</span>
            <span>
              {" "}
              <a href={project.demo}> Demo link</a>{" "}
            </span>
            <span>
              {" "}
              <a href={project.source}> Source link</a>{" "}
            </span>

            <button
              className={styles.ProjectsListItemButtonUpdate}
              onClick={() => handleEdit(project)}
            >
              Düzenle
            </button>
            <button onClick={() => handleDelete(project.id, project.imageUrl)}>
              Sil
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectsAdmin;
