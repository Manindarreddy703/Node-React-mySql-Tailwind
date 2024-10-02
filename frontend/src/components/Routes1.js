import React from "react";
import { Routes, Route } from 'react-router-dom';
import Login from './Login'
import Register from './Register'
import AdminDashboard from '../components/AdminDashboard/AdminDashboard'
const Routes1 = () => {
  return (
    <Routes>
     
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
    </Routes>
  );
};

export default Routes1