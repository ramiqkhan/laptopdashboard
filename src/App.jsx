import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Navbar from "./component/navbar";
import ProductAdmin from "./pages/Products";
import AdminOrders from "./pages/Order";
import FeaturedProductManager from "./pages/featureproduct";
import DealsAdmin from "./pages/deals";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./component/ProtectedRoute";
import WorkstationPage from "./pages/Workstation";

// 1. Create a Layout component to hold the Navbar + Pages
const AdminLayout = () => (
  <>
    <Navbar />
    <Outlet /> {/* This is where the specific pages (products, orders) will render */}
  </>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC: No Navbar here */}
        <Route path="/" element={<LoginPage />} />

        {/* PROTECTED: Checks login first */}
        <Route element={<ProtectedRoute />}>
          {/* LAYOUT: Adds the Navbar to everything inside it */}
          <Route element={<AdminLayout />}>
            <Route path="/products" element={<ProductAdmin />} />
            <Route path="/orders" element={<AdminOrders />} />
            <Route path="/featured" element={<FeaturedProductManager />} />
            <Route path="/deals" element={<DealsAdmin />} />
            <Route path="/workstation" element={<WorkstationPage />} />

          </Route>
        </Route>

        {/* CATCH-ALL */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;