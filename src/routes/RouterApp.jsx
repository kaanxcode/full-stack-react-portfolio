import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Admin from "../components/Admin/Admin";
import HomePage from "../screens/HomePage";

const RouterApp = () => {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default RouterApp;
