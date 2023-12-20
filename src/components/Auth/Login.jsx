import React, { useState } from "react";
import { login } from "../../service/firebase";
import { useNavigate } from "react-router-dom";
import style from "./login.module.css";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await login(email, password);
    onLogin(!!user);

    if (user) {
      navigate("/admin");
    }
  };

  return (
    <div className={style.container}>
      <h1 className={style.title}>ADMİN PANEL GİRİŞ</h1>
      <form className={style.formContainer} onSubmit={handleSubmit}>
        <input
          className={style.inputField}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          className={style.inputField}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button className={style.submitButton} type="submit">
          Giriş Yap
        </button>
      </form>
    </div>
  );
};

export default Login;
