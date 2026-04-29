import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // INCREASED TEXT SIZE: Changed text-[11px] to text-[14px] (or text-sm)
  const activeLink = ({ isActive }) => {
    const base = "text-[14px] uppercase font-bold tracking-[0.15em] transition-all duration-300 pb-1 border-b-2";
    return isActive
      ? `${base} text-black border-black` 
      : `${base} text-gray-400 border-transparent hover:text-black hover:border-black/20`; 
  };

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
        isScrolled 
          ? "bg-white/95 backdrop-blur-xl py-4 border-b border-gray-100 shadow-sm" 
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 flex justify-between items-center">
        
        {/* LOGO - Increased size to match larger text */}
        <div className="text-black font-black tracking-tighter text-2xl cursor-default">
          Iqra
        </div>

        {/* DESKTOP LINKS */}
        <div className="hidden lg:flex gap-10 items-center">
  
          <NavLink to="/products" className={activeLink}>Products</NavLink>
          <NavLink to="/orders" className={activeLink}>Orders</NavLink>
                    <NavLink to="/featured" onClick={() => setMobileOpen(false)} className={activeLink}>Featured Products</NavLink>
    <NavLink to="/deals" onClick={() => setMobileOpen(false)} className={activeLink}>Deals</NavLink>
    <NavLink to="/workstation" onClick={() => setMobileOpen(false)} className={activeLink}>Workstation</NavLink>
        </div>

        {/* MOBILE TOGGLE */}
        <button 
          className="lg:hidden text-black p-2 hover:bg-black/5 rounded-lg transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <FaTimes size={26} /> : <FaBars size={26} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-[70px] bg-white z-50 p-8 flex flex-col gap-8 animate-in fade-in slide-in-from-top-4 duration-300">

          <NavLink to="/products" onClick={() => setMobileOpen(false)} className={activeLink}>Products</NavLink>
          <NavLink to="/orders" onClick={() => setMobileOpen(false)} className={activeLink}>Orders</NavLink>
          <NavLink to="/featured" onClick={() => setMobileOpen(false)} className={activeLink}>Featured Products</NavLink>
          <NavLink to="/deals" onClick={() => setMobileOpen(false)} className={activeLink}>Deals</NavLink>
          <NavLink to="/workstation" onClick={() => setMobileOpen(false)} className={activeLink}>Workstation</NavLink>
          <div className="h-[1px] w-full bg-gray-100 my-2" />
        </div>
      )}
    </nav>
  );
};

export default Navbar;