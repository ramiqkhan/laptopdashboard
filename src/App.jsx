// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./component/navbar";
import ProductAdmin from "./pages/Products";



// Pages


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* <Route path="/" element={<Dashboard />} /> */}
        <Route path="/Product" element={<ProductAdmin />} />
        {/* <Route path="/orders" element={<Orders />} /> */}
      </Routes>
    </Router>
  );
}

export default App;