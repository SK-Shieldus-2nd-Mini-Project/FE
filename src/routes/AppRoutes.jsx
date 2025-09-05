import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home.";


function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} exact={true} />
        <Route path="/home" element={<Home />}/> 
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;