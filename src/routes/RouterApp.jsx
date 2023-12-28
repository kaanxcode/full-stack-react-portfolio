import React, { Component, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Admin from "../components/Admin/Admin";
import HomePage from "../screens/HomePage";
import Login from "../components/Auth/Login";

const RouterApp = () => {
  const [userHave, setUserHave] = useState(
    JSON.parse(localStorage.getItem("user")) || false
  );

  const handleLogin = (isLoggedIn) => {
    setUserHave(isLoggedIn);
    console.log(isLoggedIn);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/admin"
          element={userHave ? <Admin /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default RouterApp;
