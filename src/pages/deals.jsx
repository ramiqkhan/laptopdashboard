import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes, FaTag, FaCloudUploadAlt } from "react-icons/fa";

const DealsAdmin = () => {
    const API_URL = `${import.meta.env.VITE_API_URL || "https://laptopbackend-orpin.vercel.app"}/api/deals`;

  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [imageFiles, setImageFiles] = useState([]);

  const emptyDeal = {
    name: "", brand: "", category: "deal",
    originalPrice: "", price: "", 
    processor: "", ram: "", storage: "", 
    gpu: "", display: "", os: "", stock: 0
  };

  const [newDeal, setNewDeal] = useState(emptyDeal);

  const brands = ["HP", "Dell", "Apple", "Lenovo", "Acer", "MSI", "Asus", "Razer"];

  const renderImage = (imageSource) => {
  if (!imageSource || imageSource.length === 0) {
    return "https://via.placeholder.com/150?text=No+Image";
  }

  // Agar array hai toh first URL return karo
  if (Array.isArray(imageSource)) {
    return imageSource[0].url || imageSource[0]; // Cloudinary URL ya direct string
  }

  return imageSource.url || imageSource; // single image object ya URL
};
  const fetchDeals = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setDeals(Array.isArray(data) ? data : []);
    } catch (err) { console.error("Fetch Error:", err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDeals(); }, []);

  const handleAddDeal = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(newDeal).forEach(key => formData.append(key, newDeal[key]));
    imageFiles.forEach(file => formData.append("images", file));
    try {
      const res = await fetch(API_URL, { method: "POST", body: formData });
      if (res.ok) { setShowAddModal(false); setNewDeal(emptyDeal); setImageFiles([]); fetchDeals(); }
    } catch (err) { alert("Server Error while adding deal."); }
  };

  const handleSaveEdit = async (id) => {
    const formData = new FormData();
    Object.keys(editFormData).forEach(key => {
      if (!["_id", "__v", "images", "createdAt", "updatedAt"].includes(key)) {
        formData.append(key, editFormData[key]);
      }
    });
    if (imageFiles.length > 0) imageFiles.forEach(file => formData.append("images", file));

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "PUT", body: formData });
      if (res.ok) { setEditingId(null); setImageFiles([]); fetchDeals(); alert("Updated!"); }
    } catch (err) { alert("Update failed."); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this deal permanently?")) {
      try {
        const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (res.ok) fetchDeals();
      } catch (err) { alert("Delete failed."); }
    }
  };

  return (
    <div className="p-8 mt-20 bg-slate-50 min-h-screen text-black font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
          <div>
            <div className="flex items-center gap-3 text-red-600 mb-2">
              <FaTag className="text-3xl rotate-90" />
              <h1 className="text-5xl font-black uppercase italic tracking-tighter">Flash Deals</h1>
            </div>
            <p className="text-[11px] text-gray-500 font-bold tracking-[0.2em] uppercase">Inventory Liquidation & Special Offers</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="bg-red-600 text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl hover:bg-red-700 transition-all">
            <FaPlus className="inline mr-2" /> Create New Deal
          </button>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto border border-gray-200 rounded-[2.5rem] shadow-xl bg-white">
          <table className="w-full text-left min-w-[1500px]">
            <thead className="bg-gray-50/50 border-b">
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="p-8">Unit Info</th>
                <th className="p-8">Processor & OS</th>
                <th className="p-8">RAM / Storage / Display</th>
                <th className="p-8">Pricing & Stock</th>
                <th className="p-8 text-right">Control</th>
              </tr>
            </thead>
            
            <tbody className="text-sm">
              {!loading && deals.map((d) => (
                <tr key={d._id} className="border-b hover:bg-slate-50 transition-all group">
                  
                  {/* Column 1: Identity */}
                  <td className="p-8">
                    <div className="flex items-center gap-5">
<img 
  src={renderImage(d.images || d.image)} 
  alt={d.name} 
  className="w-16 h-12 object-contain rounded-lg border bg-white" 
/>                      <div className="flex flex-col gap-1.5">
                        {editingId === d._id ? (
                          <>
                            <input className="border border-slate-200 rounded px-2 py-1 font-bold text-xs outline-none focus:border-black" value={editFormData.name} onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} />
                            <select className="text-[10px] border border-slate-200 rounded px-2 py-1 font-black uppercase outline-none" value={editFormData.brand} onChange={(e) => setEditFormData({ ...editFormData, brand: e.target.value })}>
                              {brands.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                          </>
                        ) : (
                          <>
                            <span className="font-bold text-slate-900 text-base">{d.name}</span>
                            <span className="text-[10px] font-black uppercase text-red-500 bg-red-50 w-fit px-2 py-0.5 rounded">{d.brand}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Column 2: Specs (CPU/OS) */}
                  <td className="p-8">
                    {editingId === d._id ? (
                      <div className="flex flex-col gap-2">
                        <input className="border border-slate-200 rounded px-2 py-1 text-xs outline-none focus:border-black" placeholder="CPU" value={editFormData.processor} onChange={(e) => setEditFormData({ ...editFormData, processor: e.target.value })} />
                        <input className="border border-slate-200 rounded px-2 py-1 text-[10px] outline-none focus:border-black" placeholder="OS" value={editFormData.os} onChange={(e) => setEditFormData({ ...editFormData, os: e.target.value })} />
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-700">{d.processor}</span>
                        <span className="text-[11px] text-slate-400 font-bold uppercase">{d.os}</span>
                      </div>
                    )}
                  </td>

                  {/* Column 3: Specs (RAM/Disk/Display) */}
                  <td className="p-8">
                    {editingId === d._id ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <input className="border border-slate-200 rounded px-2 py-1 text-xs w-1/2 outline-none focus:border-black" placeholder="RAM" value={editFormData.ram} onChange={(e) => setEditFormData({ ...editFormData, ram: e.target.value })} />
                          <input className="border border-slate-200 rounded px-2 py-1 text-xs w-1/2 outline-none focus:border-black" placeholder="Disk" value={editFormData.storage} onChange={(e) => setEditFormData({ ...editFormData, storage: e.target.value })} />
                        </div>
                        <input className="border border-slate-200 rounded px-2 py-1 text-[10px] outline-none focus:border-black" placeholder="Display" value={editFormData.display} onChange={(e) => setEditFormData({ ...editFormData, display: e.target.value })} />
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-500 uppercase text-[11px] tracking-widest">{d.ram} / {d.storage}</span>
                        <span className="text-slate-400 text-xs mt-1">{d.display} Display</span>
                      </div>
                    )}
                  </td>

                  {/* Column 4: Pricing & Stock */}
                  <td className="p-8">
                    <div className="flex flex-col gap-1">
                      {editingId === d._id ? (
                        <>
                          <input type="number" className="border border-slate-200 rounded px-2 py-1 text-xs" placeholder="Retail Price" value={editFormData.originalPrice} onChange={(e) => setEditFormData({ ...editFormData, originalPrice: e.target.value })} />
                          <input type="number" className="border border-slate-200 rounded px-2 py-1 text-xs font-black text-red-600" placeholder="Deal Price" value={editFormData.price} onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })} />
                          <input type="number" className="border border-slate-200 rounded px-2 py-1 text-[10px]" placeholder="Stock" value={editFormData.stock} onChange={(e) => setEditFormData({ ...editFormData, stock: e.target.value })} />
                        </>
                      ) : (
                        <>
                          <span className="text-[11px] text-slate-400 line-through font-bold">PKR {d.originalPrice?.toLocaleString()}</span>
                          <span className="font-black text-red-600 text-xl tracking-tighter">PKR {d.price?.toLocaleString()}</span>
                          <span className="text-[9px] font-black uppercase text-slate-400 mt-1">STOCK: {d.stock} UNITS</span>
                        </>
                      )}
                    </div>
                  </td>

                  {/* Column 5: Controls (Fixed Visibility) */}
                  <td className="p-8 text-right min-w-[150px]">
                    {editingId === d._id ? (
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => handleSaveEdit(d._id)} className="p-3 bg-black text-white rounded-xl shadow-lg hover:bg-slate-800 transition-all active:scale-95"><FaSave size={16} /></button>
                        <button onClick={() => setEditingId(null)} className="p-3 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-all active:scale-95"><FaTimes size={16} /></button>
                      </div>
                    ) : (
                      <div className="flex gap-2 justify-end">
                        <button 
                          onClick={() => { setEditingId(d._id); setEditFormData(d); }} 
                          className="p-3 bg-white border border-slate-200 text-black hover:bg-black hover:text-white rounded-xl transition-all shadow-sm active:scale-95"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(d._id)} 
                          className="p-3 bg-white border border-slate-200 text-black hover:bg-red-600 hover:text-white hover:border-red-600 rounded-xl transition-all shadow-sm active:scale-95"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
          {loading && <div className="p-20 text-center font-black animate-pulse text-slate-300 uppercase tracking-widest">Syncing Live Inventory...</div>}
        </div>
      </div>
      {/* --- Full Field Add Modal --- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[200] p-6">
          <div className="bg-white rounded-[3rem] p-10 w-full max-w-5xl max-h-[95vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-10 border-b pb-6">
              <div>
                <h2 className="text-4xl font-black uppercase italic text-red-600">Flash Configuration</h2>
                <p className="text-xs font-bold text-slate-400 tracking-widest mt-1 uppercase">Deploy New Asset to Deals Page</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-4 hover:bg-slate-100 rounded-full transition-all text-slate-400"><FaTimes size={24} /></button>
            </div>

            <form onSubmit={handleAddDeal} className="space-y-8">
              {/* Basic Info Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Product Identity</label>
                  <input required placeholder="E.g. MacBook Pro M2" className="bg-slate-50 p-4 rounded-2xl font-bold border border-transparent focus:border-red-500 outline-none transition-all" value={newDeal.name} onChange={e => setNewDeal({ ...newDeal, name: e.target.value })} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Brand</label>
                  <select className="bg-slate-50 p-4 rounded-2xl font-bold outline-none border border-transparent focus:border-red-500 appearance-none" onChange={e => setNewDeal({ ...newDeal, brand: e.target.value })}>
                    <option value="">Select Brand</option>
                    {brands.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Initial Stock</label>
                  <input type="number" placeholder="0" className="bg-slate-50 p-4 rounded-2xl font-bold outline-none" onChange={e => setNewDeal({ ...newDeal, stock: e.target.value })} />
                </div>
              </div>

              {/* Specs Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <input placeholder="CPU (e.g. Core i7 12th Gen)" className="bg-slate-50 p-4 rounded-2xl font-bold outline-none" onChange={e => setNewDeal({ ...newDeal, processor: e.target.value })} />
                <input placeholder="RAM (e.g. 16GB DDR5)" className="bg-slate-50 p-4 rounded-2xl font-bold outline-none" onChange={e => setNewDeal({ ...newDeal, ram: e.target.value })} />
                <input placeholder="Storage (e.g. 512GB NVMe)" className="bg-slate-50 p-4 rounded-2xl font-bold outline-none" onChange={e => setNewDeal({ ...newDeal, storage: e.target.value })} />
                <input placeholder="OS (e.g. Windows 11 Home)" className="bg-slate-50 p-4 rounded-2xl font-bold outline-none" onChange={e => setNewDeal({ ...newDeal, os: e.target.value })} />
              </div>

              {/* Pricing Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-red-50/50 rounded-[2rem] border border-red-100">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase text-red-400 ml-2">Original Retail Price</label>
                  <input type="number" placeholder="250,000" className="bg-white p-5 rounded-2xl font-black outline-none border border-red-100 focus:border-red-500" onChange={e => setNewDeal({ ...newDeal, originalPrice: e.target.value })} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase text-red-600 ml-2">Final Deal Price</label>
                  <input type="number" placeholder="199,000" className="bg-white p-5 rounded-2xl font-black text-red-600 outline-none border-2 border-red-500 shadow-[0_5px_20px_rgba(220,38,38,0.1)]" onChange={e => setNewDeal({ ...newDeal, price: e.target.value })} />
                </div>
              </div>

              {/* Image Upload Area */}
              <div className="relative group">
                <input type="file" multiple className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={e => setImageFiles(Array.from(e.target.files))} />
                <div className="border-2 border-dashed border-slate-200 p-12 rounded-[2rem] text-center group-hover:border-red-400 group-hover:bg-red-50/30 transition-all">
                  <FaCloudUploadAlt size={48} className="mx-auto text-slate-300 mb-4 group-hover:text-red-500" />
                  <p className="text-sm font-black text-slate-500 uppercase tracking-widest">{imageFiles.length > 0 ? `${imageFiles.length} Assets Selected` : "Drop Product Renders or Click to Upload"}</p>
                </div>
              </div>

              <button type="submit" className="w-full bg-red-600 text-white py-6 rounded-[2rem] font-black uppercase tracking-widest text-lg shadow-2xl hover:bg-red-700 hover:scale-[1.01] active:scale-95 transition-all">
                Launch Live Deal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealsAdmin;