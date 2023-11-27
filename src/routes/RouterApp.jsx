import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Admin from '../components/Admin/Admin';
import HomePage from '../screens/HomePage';

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
