import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes } from "react-icons/fa";

const ProductAdmin = () => {
 const BASE_URL = import.meta.env.VITE_API_URL || "https://laptopbackend-eta.vercel.app";
  const API_URL = `${BASE_URL}/api/products`;
  
  console.log("API:", API_URL);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [selectedBrand, setSelectedBrand] = useState("");
  const [imageFiles, setImageFiles] = useState([]);

  const [newProduct, setNewProduct] = useState({
    name: "", brand: "", category: "normal", price: "", 
    processor: "", ram: "", storage: "", gpu: "", 
    display: "", os: "", features: "", stock: 0,averageRating: 0,
  });



  const brands = ["HP", "Dell", "Apple", "Lenovo", "Acer", "Sony", "Samsung"];
  const categories = ["normal", "gaming"];

  // --- 1. OPTIMIZED IMAGE RENDERER (Fast & Robust) ---
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


  const fetchProducts = async () => {
    setLoading(true);
    try {
      const url = selectedBrand
        ? `${BASE_URL}/api/products?brand=${selectedBrand}`
        : `${BASE_URL}/api/products`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Failed to fetch products. Check backend URL & CORS.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedBrand]);

  useEffect(() => { fetchProducts(); }, [selectedBrand]);

  // --- 2. ADD PRODUCT LOGIC ---
 const handleAddProduct = async (e) => {
    e.preventDefault();
    if (imageFiles.length === 0) return alert("Please select at least one image");

    const formData = new FormData();
    Object.keys(newProduct).forEach(key => {
        let value = newProduct[key];
        if (["price","stock","averageRating"].includes(key)) {
            value = Number(value); // cast to number
        }
        formData.append(key, value);
    });
    
    // Append multiple images - Backend expects 'images' field
    imageFiles.forEach(file => formData.append("images", file));

    try {
        const response = await fetch(API_URL, { method: "POST", body: formData });
        if (response.ok) {
            setShowAddModal(false);
            setNewProduct({
                name: "", brand: "", category: "normal", price: 0, 
                processor: "", ram: "", storage: "", gpu: "", 
                display: "", os: "", features: "", stock: 0, averageRating: 0,
            });
            setImageFiles([]);
            fetchProducts();
            alert("Unit Deployed Successfully!");
        } else {
            const errText = await response.text();
            console.error("Add Product Error:", errText);
            alert("Add failed: " + errText);
        }
    } catch (err) { 
        console.error("Add Product Error:", err);
        alert("Add failed"); 
    }
};

  // --- 3. ROBUST EDIT LOGIC (Backend Sync) ---
  const handleSaveEdit = async (id) => {
    const formData = new FormData();
    
    // Clean data: Metadata remove karein taake backend crash na ho
    Object.keys(editFormData).forEach(key => {
      if (!["_id", "__v", "image", "images", "createdAt", "updatedAt", "ratings", "ratings"].includes(key)) {
     let value = editFormData[key];
if (["price","stock","averageRating"].includes(key)) {
  value = Number(value); // cast to number
}
formData.append(key, value);
      }
    });

    // Agar user ne naye files select kiye hain tabhi append karein
    if (imageFiles.length > 0) {
      imageFiles.forEach(file => formData.append("images", file));
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, { 
        method: "PUT", 
        body: formData 
      });
      
      if (response.ok) {
        setEditingId(null);
        setImageFiles([]);
        fetchProducts();
        alert("Unit Updated!");
      } else {
        alert("Update failed on server");
      }
    } catch (err) { 
      console.error(err);
      alert("Network Error"); 
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Permanently delete this unit?")) {
      try {
        const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (res.ok) fetchProducts();
      } catch (err) { alert("Delete failed"); }
    }
  };

  return (
    <div className="p-8 mt-20 bg-white min-h-screen text-black font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900">Standard Inventory</h1>
            <p className="text-[10px] text-blue-600 font-bold tracking-widest uppercase mt-1">Mainstream Assets Management</p>
          </div>
          <div className="flex gap-4">
            <select className="bg-gray-100 rounded-xl px-4 py-2 text-[10px] font-bold uppercase outline-none border-2 border-transparent focus:border-black transition-all" onChange={(e) => setSelectedBrand(e.target.value)}>
              <option value="">Filter Brand</option>
              {brands.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <button onClick={() => setShowAddModal(true)} className="bg-black text-white px-8 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg hover:bg-slate-800 active:scale-95 transition-all">
              <FaPlus className="inline mr-2" /> Add Laptop
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-gray-100 rounded-[2rem] shadow-sm bg-white">
          <table className="w-full text-left min-w-[1400px]">
            <thead className="bg-gray-50 border-b">
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="p-6">Unit Model</th>
                <th className="p-6">Category</th>
                <th className="p-6">Core Specs</th>
                <th className="p-6">GPU & OS</th>
                <th className="p-6">Inventory</th>
        
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
        <tbody className="text-sm">
  {loading ? (
    <tr>
      <td colSpan="6" className="p-20 text-center font-bold tracking-widest animate-pulse text-gray-300">
        SYNCING INVENTORY...
      </td>
    </tr>
  ) : (
    products.map((p) => (
      <tr key={p._id} className="border-b hover:bg-gray-50/50 transition-colors">
        {/* 1. Unit Model & Brand */}
        <td className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative">
<img 
  src={renderImage(p.images || p.image)} 
  alt={p.name} 
  className="w-16 h-12 object-contain rounded-lg border bg-white" 
/>              {p.images?.length > 1 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-[8px] px-1.5 py-0.5 rounded-full font-black">
                  +{p.images.length - 1}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              {editingId === p._id ? (
                <>
                  <input 
                    className="border-b font-bold text-xs outline-none focus:border-black" 
                    value={editFormData.name} 
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} 
                    placeholder="Model Name"
                  />
                  <select 
                    className="text-[10px] bg-gray-100 rounded px-1 outline-none font-bold uppercase"
                    value={editFormData.brand}
                    onChange={(e) => setEditFormData({ ...editFormData, brand: e.target.value })}
                  >
                    {brands.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                  <input type="file" multiple className="text-[9px] mt-1" onChange={(e) => setImageFiles(Array.from(e.target.files))} />
                </>
              ) : (
                <>
                  <span className="font-bold text-slate-800">{p.name}</span>
                  <span className="text-[10px] font-black uppercase text-gray-400">{p.brand}</span>
                </>
              )}
            </div>
          </div>
        </td>

        {/* 2. Category */}
        <td className="p-6">
          {editingId === p._id ? (
            <select 
              className="border rounded text-xs p-1" 
              value={editFormData.category} 
              onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
            >
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          ) : (
            <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${p.category === "gaming" ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"}`}>
              {p.category}
            </span>
          )}
        </td>

        {/* 3. Core Specs (Processor, RAM, Storage) */}
        <td className="p-6">
          {editingId === p._id ? (
            <div className="flex flex-col gap-1">
              <input 
                className="border-b text-xs outline-none" 
                value={editFormData.processor} 
                onChange={(e) => setEditFormData({ ...editFormData, processor: e.target.value })} 
                placeholder="Processor"
              />
              <div className="flex gap-1">
                <input 
                  className="border-b text-[10px] w-1/2 outline-none" 
                  value={editFormData.ram} 
                  onChange={(e) => setEditFormData({ ...editFormData, ram: e.target.value })} 
                  placeholder="RAM"
                />
                <input 
                  className="border-b text-[10px] w-1/2 outline-none" 
                  value={editFormData.storage} 
                  onChange={(e) => setEditFormData({ ...editFormData, storage: e.target.value })} 
                  placeholder="Storage"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              <span className="font-medium">{p.processor}</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase">
                {p.ram} / {p.storage}
              </span>
            </div>
          )}
        </td>

        {/* 4. GPU, OS & Display */}
        <td className="p-6">
          {editingId === p._id ? (
            <div className="flex flex-col gap-1">
              <input 
                className="border-b text-xs outline-none" 
                value={editFormData.gpu} 
                onChange={(e) => setEditFormData({ ...editFormData, gpu: e.target.value })} 
                placeholder="GPU"
              />
              <div className="flex gap-1">
                <input 
                  className="border-b text-[10px] w-1/2 outline-none" 
                  value={editFormData.os} 
                  onChange={(e) => setEditFormData({ ...editFormData, os: e.target.value })} 
                  placeholder="OS"
                />
                <input 
                  className="border-b text-[10px] w-1/2 outline-none" 
                  value={editFormData.display} 
                  onChange={(e) => setEditFormData({ ...editFormData, display: e.target.value })} 
                  placeholder="Display"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              <span className="text-gray-600">{p.gpu}</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase">{p.os} | {p.display}</span>
            </div>
          )}
        </td>

        {/* 5. Inventory (Price & Stock) */}
        <td className="p-6">
          {editingId === p._id ? (
            <div className="flex flex-col gap-1">
              <input 
                type="number"
                className="border-b font-black text-xs outline-none" 
                value={editFormData.price} 
                onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })} 
                placeholder="Price"
              />
              <input 
                type="number"
                className="border-b text-[10px] font-bold outline-none" 
                value={editFormData.stock} 
                onChange={(e) => setEditFormData({ ...editFormData, stock: e.target.value })} 
                placeholder="Stock"
              />
  <input 
        type="number"
        step="0.1"
        max="5"
        className="bg-gray-50 p-1.5 rounded text-[10px] font-bold text-yellow-600 outline-none mt-1" 
        value={editFormData.averageRating} 
        onChange={(e) => setEditFormData({ ...editFormData, averageRating: e.target.value })} 
        placeholder="Rating (0-5)"
      />
    
            </div>
          ) : (
            <div className="flex flex-col">
              <span className="font-black">PKR {p.price?.toLocaleString()}</span>
              <span className={`text-[10px] font-bold uppercase ${p.stock > 0 ? "text-green-500" : "text-red-500"}`}>
                Stock: {p.stock}
              </span>
              {/* ADD THIS FIELD */}
<span className="text-[10px] font-bold text-yellow-500 mt-1">
        ⭐ {p.averageRating || "0.0"}
      </span>
            </div>
          )}
        </td>

        {/* 6. Actions */}
        <td className="p-6 text-right">
          {editingId === p._id ? (
            <div className="flex gap-2 justify-end">
              <button onClick={() => handleSaveEdit(p._id)} className="p-2 bg-black text-white rounded-lg hover:scale-110 transition-transform">
                <FaSave size={14} />
              </button>
              <button onClick={() => { setEditingId(null); setImageFiles([]); }} className="p-2 bg-gray-200 text-gray-600 rounded-lg">
                <FaTimes size={14} />
              </button>
            </div>
          ) : (
            <div className="flex gap-2 justify-end">
              <button onClick={() => { setEditingId(p._id); setEditFormData(p); setImageFiles([]); }} className="p-2 hover:bg-slate-100 text-slate-600 rounded-lg">
                <FaEdit size={14} />
              </button>
              <button onClick={() => handleDelete(p._id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg">
                <FaTrash size={14} />
              </button>
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

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
              <h2 className="text-3xl font-black uppercase tracking-tighter italic">New Asset Deployment</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-black"><FaTimes size={24} /></button>
            </div>
            
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest border-l-4 border-blue-600 pl-2">Base Identity</p>
                <input placeholder="Model Name" onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} required className="w-full bg-gray-50 p-4 rounded-xl outline-none font-bold focus:bg-white border-transparent focus:border-black border" />
                
                <div className="grid grid-cols-2 gap-4">
                  <select onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })} required className="bg-gray-50 p-4 rounded-xl font-bold outline-none">
                    <option value="">Select Brand</option>
                    {brands.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                  <select onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} className="bg-gray-50 p-4 rounded-xl font-bold outline-none">
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input type="number" placeholder="Price (PKR)" onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} required className="bg-gray-50 p-4 rounded-xl outline-none font-bold" />
                  <input type="number" placeholder="Stock" onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} required className="bg-gray-50 p-4 rounded-xl outline-none font-bold" />
              <input 
    type="number" 
    step="0.1" 
    placeholder="Rating (0-5)" 
    onChange={(e) => setNewProduct({ ...newProduct, averageRating: e.target.value })} 
    className="bg-gray-50 p-4 rounded-xl outline-none font-bold text-yellow-600" 
  />
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <p className="text-[9px] font-black uppercase mb-2">Display Gallery (Multiple)</p>
                  <input 
                    type="file" 
                    multiple
                    name="images"
                    className="text-xs w-full cursor-pointer" 
                    onChange={(e) => {
                      const selectedFiles = Array.from(e.target.files);
                      setImageFiles(prev => [...prev, ...selectedFiles]);
                      e.target.value = null; 
                    }} 
                  />
                  
                  {imageFiles.length > 0 && (
                    <div className="mt-3 p-2 bg-blue-50/50 rounded-lg border border-blue-100">
                      <p className="text-[10px] text-blue-600 font-black uppercase tracking-tighter">
                        ✅ {imageFiles.length} Assets Staged for Upload
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {imageFiles.map((file, index) => (
                          <span key={index} className="bg-white text-[8px] px-2 py-1 rounded-md border border-blue-200 text-blue-800 font-bold shadow-sm truncate max-w-[120px]">
                            {file.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase text-purple-600 tracking-widest border-l-4 border-purple-600 pl-2">System Specs</p>
                <input placeholder="Processor" onChange={(e) => setNewProduct({ ...newProduct, processor: e.target.value })} required className="w-full bg-gray-50 p-4 rounded-xl outline-none font-bold" />
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="RAM" onChange={(e) => setNewProduct({ ...newProduct, ram: e.target.value })} required className="bg-gray-50 p-4 rounded-xl outline-none font-bold" />
                  <input placeholder="Storage" onChange={(e) => setNewProduct({ ...newProduct, storage: e.target.value })} required className="bg-gray-50 p-4 rounded-xl outline-none font-bold" />
                </div>
                <input placeholder="Graphics" onChange={(e) => setNewProduct({ ...newProduct, gpu: e.target.value })} required className="w-full bg-gray-50 p-4 rounded-xl outline-none font-bold" />
                <input placeholder="Display Info" onChange={(e) => setNewProduct({ ...newProduct, display: e.target.value })} required className="w-full bg-gray-50 p-4 rounded-xl outline-none font-bold" />
                <input placeholder="Operating System" onChange={(e) => setNewProduct({ ...newProduct, os: e.target.value })} required className="w-full bg-gray-50 p-4 rounded-xl outline-none font-bold" />

                <textarea placeholder="Key Features" onChange={(e) => setNewProduct({ ...newProduct, features: e.target.value })} className="w-full bg-gray-50 p-4 rounded-xl outline-none font-bold" rows="2" />
              </div>

              <button type="submit" className="col-span-2 bg-black text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-slate-800 transition-all shadow-xl active:scale-95">
                Commit to Database
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductAdmin;