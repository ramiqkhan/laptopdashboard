// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./component/navbar";
import ProductAdmin from "./pages/Products";
import AdminOrders from "./pages/Order";
import FeaturedProductManager from "./pages/featureproduct";
import DealsAdmin from "./pages/deals";



// Pages


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
     
        <Route path="/" element={<ProductAdmin />} />
        <Route path="/orders" element={<AdminOrders />} />
         <Route path="/featured" element={<FeaturedProductManager />} />
         <Route path="/deals" element={<DealsAdmin />} />

      </Routes>
    </Router>
  );
}

export default App;
