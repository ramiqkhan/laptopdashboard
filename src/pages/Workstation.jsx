import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes, FaStar } from "react-icons/fa";

const WorkstationAdmin = () => {
  // Dynamic URL: Uses Vercel if available, otherwise falls back to local
  const API_URL = `${import.meta.env.VITE_API_URL || "https://laptopbackend-seven.vercel.app"}/api/workstations`;
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [imageFiles, setImageFiles] = useState([]);

  const [newProduct, setNewProduct] = useState({
    name: "", price: "", processor: "", ram: "", storage: "", 
    graphics: "", display: "", os: "", features: "", stock: "", averageRating: ""
  });

  const renderImage = (imageSource) => {
    if (!imageSource || imageSource.length === 0) {
      return "https://via.placeholder.com/150?text=No+Image";
    }
    if (Array.isArray(imageSource)) {
      return imageSource[0].url || imageSource[0];
    }
    return imageSource.url || imageSource;
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/all`);
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    Object.keys(newProduct).forEach(key => {
      let val = newProduct[key];
      
      // Strict Rating/Numeric Sanitization to match your working Featured logic
      if (key === "averageRating") {
        if (Array.isArray(val)) val = val[0];
        if (val === "" || val === null || val === undefined) val = 0;
        const sanitized = parseFloat(val);
        formData.append("averageRating", isNaN(sanitized) ? 0 : sanitized);
      } else if (key === "price" || key === "stock") {
        formData.append(key, parseFloat(val) || 0);
      } else {
        formData.append(key, val);
      }
    });

    if (imageFiles.length > 0) {
      imageFiles.forEach(file => formData.append("images", file));
    }

    try {
      const res = await fetch(`${API_URL}/add`, { method: "POST", body: formData });
      if (res.ok) {
        setShowAddModal(false);
        setNewProduct({
          name: "", price: "", processor: "", ram: "", storage: "", 
          graphics: "", display: "", os: "", features: "", stock: "", averageRating: ""
        });
        setImageFiles([]);
        fetchProducts();
        alert("Workstation Deployed!");
      } else {
        const errData = await res.json();
        alert(`Failed: ${errData.error}`);
      }
    } catch (err) { alert("Connectivity issue"); }
  };

  const handleSaveEdit = async (id) => {
    const formData = new FormData();
    const finalData = { ...editFormData };

    Object.keys(finalData).forEach((key) => {
      if (!["_id", "__v", "image", "images", "createdAt", "updatedAt"].includes(key)) {
        if (key === "averageRating") {
          let val = finalData[key];
          if (Array.isArray(val)) val = val[0];
          const sanitizedRating = parseFloat(val || 0);
          formData.append("averageRating", isNaN(sanitizedRating) ? 0 : sanitizedRating);
        } else {
          formData.append(key, finalData[key]);
        }
      }
    });

    if (imageFiles.length > 0) {
      imageFiles.forEach((file) => formData.append("images", file));
    }

    try {
      const res = await fetch(`${API_URL}/edit/${id}`, { method: "PUT", body: formData });
      if (res.ok) {
        setEditingId(null);
        setImageFiles([]);
        fetchProducts();
        alert("Workstation Updated!");
      }
    } catch (err) { alert("Update failed"); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this workstation?")) {
      try {
        const res = await fetch(`${API_URL}/delete/${id}`, { method: "DELETE" });
        if (res.ok) fetchProducts();
      } catch (err) { alert("Delete failed"); }
    }
  };

  return (
    <div className="p-8 mt-20 bg-white min-h-screen text-black font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900">Workstation Lab</h1>
            <p className="text-[10px] text-purple-600 font-bold tracking-widest uppercase mt-1">Professional Computing Units</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="bg-black text-white px-8 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg hover:bg-slate-800 transition-all active:scale-95">
            <FaPlus className="inline mr-2" /> Add Workstation
          </button>
        </div>

        <div className="overflow-x-auto border border-gray-100 rounded-[2rem] shadow-sm bg-white">
          <table className="w-full text-left min-w-[1200px]">
            <thead className="bg-gray-50 border-b">
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="p-6">Machine Image & Model</th>
                <th className="p-6">Processing Power</th>
                <th className="p-6">Availability</th>
                <th className="p-6">Price</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr><td colSpan="5" className="p-20 text-center font-bold tracking-widest animate-pulse">SYNCHRONIZING DATABASE...</td></tr>
              ) : (
                products.map((p) => (
                  <tr key={p._id} className="border-b hover:bg-gray-50/50 transition-colors">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img src={renderImage(p.images || p.image)} alt={p.name} className="w-16 h-12 object-contain rounded-lg border bg-white" />   
                          {p.images?.length > 1 && (
                            <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-[8px] px-1.5 py-0.5 rounded-full font-black">+{p.images.length - 1}</span>
                          )}
                        </div>
                        <div className="flex flex-col">
                          {editingId === p._id ? (
                            <input className="border-b font-bold mb-1 outline-none focus:border-black p-1" value={editFormData.name || ""} onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} />
                          ) : (
                            <span className="font-bold text-slate-800">{p.name}</span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="p-6">
                      {editingId === p._id ? (
                        <div className="flex flex-col gap-1">
                          <input className="border-b text-xs outline-none p-1" value={editFormData.processor || ""} onChange={(e) => setEditFormData({ ...editFormData, processor: e.target.value })} placeholder="CPU" />
                          <input className="border-b text-xs outline-none p-1" value={editFormData.ram || ""} onChange={(e) => setEditFormData({ ...editFormData, ram: e.target.value })} placeholder="RAM" />
                          <input className="border-b text-xs outline-none p-1" value={editFormData.storage || ""} onChange={(e) => setEditFormData({ ...editFormData, storage: e.target.value })} placeholder="Storage" />
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-700">{p.processor}</span>
                          <span className="text-[11px] text-gray-400 uppercase font-bold">{p.ram} | {p.storage}</span>
                        </div>
                      )}
                    </td>

                    <td className="p-6">
                      {editingId === p._id ? (
                        <input className="border-b text-xs outline-none p-1" value={editFormData.stock || ""} onChange={(e) => setEditFormData({ ...editFormData, stock: e.target.value })} placeholder="Stock" />
                      ) : (
                        <span className={`${p.stock > 0 ? 'text-green-600' : 'text-red-600'} font-bold text-[11px] uppercase tracking-tighter`}>
                          {p.stock > 0 ? `${p.stock} Units Available` : 'Out Of Stock'}
                        </span>
                      )}
                    </td>

                    <td className="p-6 font-black text-slate-900">
                      {editingId === p._id ? (
                        <input type="number" className="border-b text-xs w-24 outline-none font-black p-1" value={editFormData.price || ""} onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })} />
                      ) : (
                        <span>PKR {p.price?.toLocaleString()}</span>
                      )}
                    </td>

                    <td className="p-6 text-right">
                      {editingId === p._id ? (
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => handleSaveEdit(p._id)} className="p-2 bg-black text-white rounded-lg"><FaSave size={12} /></button>
                          <button onClick={() => setEditingId(null)} className="p-2 bg-gray-200 text-gray-600 rounded-lg"><FaTimes size={12} /></button>
                        </div>
                      ) : (
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => { setEditingId(p._id); setEditFormData(p); }} className="p-2 hover:bg-slate-100 text-slate-600 rounded-lg"><FaEdit size={12} /></button>
                          <button onClick={() => handleDelete(p._id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg"><FaTrash size={12} /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reusable Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
              <h2 className="text-3xl font-black uppercase tracking-tighter italic">New Workstation Entry</h2>
              <button onClick={() => setShowAddModal(false)}><FaTimes size={24} /></button>
            </div>
            
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest border-l-4 border-blue-600 pl-2">Machine Info</p>
                <input placeholder="Model Name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} required className="w-full bg-gray-50 p-4 rounded-xl outline-none font-bold border" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="number" placeholder="Price (PKR)" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} required className="bg-gray-50 p-4 rounded-xl outline-none font-bold border" />
                  <input type="number" placeholder="Stock" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} required className="bg-gray-50 p-4 rounded-xl outline-none font-bold border" />
                </div>
                <input placeholder="Features (comma separated)" value={newProduct.features} onChange={(e) => setNewProduct({ ...newProduct, features: e.target.value })} className="w-full bg-gray-50 p-4 rounded-xl outline-none border" />
                <div className="p-4 bg-gray-50 rounded-xl border-2 border-dashed">
                  <p className="text-[9px] font-black uppercase mb-2">Upload Images</p>
                  <input type="file" multiple onChange={(e) => setImageFiles(Array.from(e.target.files))} className="text-xs" />
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase text-purple-600 tracking-widest border-l-4 border-purple-600 pl-2">Hardware Specs</p>
                <input placeholder="Processor" value={newProduct.processor} onChange={(e) => setNewProduct({ ...newProduct, processor: e.target.value })} required className="w-full bg-gray-50 p-4 rounded-xl outline-none font-bold border" />
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="RAM" value={newProduct.ram} onChange={(e) => setNewProduct({ ...newProduct, ram: e.target.value })} required className="bg-gray-50 p-4 rounded-xl outline-none font-bold border" />
                  <input placeholder="Storage" value={newProduct.storage} onChange={(e) => setNewProduct({ ...newProduct, storage: e.target.value })} required className="bg-gray-50 p-4 rounded-xl outline-none font-bold border" />
                </div>
                <input placeholder="Graphics Card" value={newProduct.graphics} onChange={(e) => setNewProduct({ ...newProduct, graphics: e.target.value })} required className="w-full bg-gray-50 p-4 rounded-xl outline-none font-bold border" />
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="Display" value={newProduct.display} onChange={(e) => setNewProduct({ ...newProduct, display: e.target.value })} required className="bg-gray-50 p-4 rounded-xl outline-none font-bold border" />
                  <input placeholder="OS" value={newProduct.os} onChange={(e) => setNewProduct({ ...newProduct, os: e.target.value })} required className="bg-gray-50 p-4 rounded-xl outline-none font-bold border" />
                </div>
                <div className="flex items-center gap-4 bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                  <FaStar className="text-yellow-500" />
                  <input type="number" step="0.1" max="5" placeholder="Initial Rating (0-5)" value={newProduct.averageRating} onChange={(e) => setNewProduct({ ...newProduct, averageRating: e.target.value })} className="bg-transparent outline-none font-black text-yellow-700 w-full" />
                </div>
              </div>

              <button type="submit" className="col-span-1 md:col-span-2 bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all">
                Deploy Workstation
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkstationAdmin;