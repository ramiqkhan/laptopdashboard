import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes, FaStar } from "react-icons/fa";

const FeaturedProductAdmin = () => {
  const API_URL = `${import.meta.env.VITE_API_URL || "https://laptopbackend-orpin.vercel.app"}/api/featured-products`;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [imageFiles, setImageFiles] = useState([]);

  const [newProduct, setNewProduct] = useState({
    name: "", price: "", processor: "", ram: "", storage: "", graphics: "", display: "", os: "", features: "", stock: "", averageRating: ""
  });

  // const API_URL = "http://localhost:5000/api/featured-products";

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
      const response = await fetch(`${API_URL}/all`);
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    Object.keys(newProduct).forEach(key => {
   if (key === "averageRating") {
  let val = newProduct[key];

  if (Array.isArray(val)) {
    val = val[0];
  }

  if (val === "" || val === null || val === undefined) {
    val = 0;
  }

  const sanitized = parseFloat(val);
  formData.append("averageRating", isNaN(sanitized) ? 0 : sanitized);
}else {
        formData.append(key, newProduct[key]);
      }
    });

    if (imageFiles.length > 0) {
      imageFiles.forEach(file => formData.append("images", file));
    }

    try {
      const res = await fetch(`${API_URL}/add`, { method: "POST", body: formData });
      if (res.ok) {
        setShowAddModal(false);
        setNewProduct({ name: "", price: "", processor: "", ram: "", storage: "", graphics: "", display: "", os: "", features: "", stock: "", averageRating: "" });
        setImageFiles([]);
        fetchProducts();
        alert("Featured product added!");
      }
    } catch (err) { alert("Add failed"); }
  };

const handleSaveEdit = async (id) => {
  const formData = new FormData();
  const finalData = { ...editFormData };

  if (Array.isArray(finalData.features)) {
    finalData.features = finalData.features.join(", ");
  }

  Object.keys(finalData).forEach((key) => {
    if (!["_id", "__v", "image", "images", "createdAt", "updatedAt"].includes(key)) {
      
  if (key === "averageRating") {
  let val = finalData[key];

  // If array comes
  if (Array.isArray(val)) {
    val = val[0];
  }

  // If empty, null, undefined → 0
  if (val === "" || val === null || val === undefined) {
    val = 0;
  }

  const sanitizedRating = parseFloat(val);

  // If still NaN → 0
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
    const res = await fetch(`${API_URL}/edit/${id}`, {
      method: "PUT",
      body: formData
    });

    if (res.ok) {
      setEditingId(null);
      setImageFiles([]);
      fetchProducts();
      alert("Updated Successfully!");
    } else {
      const errorData = await res.json();
      alert(`Update failed: ${errorData.error || "Check console"}`);
    }
  } catch (err) {
    alert("Update failed connectivity issue");
  }
};

  const handleDelete = async (id) => {
    if (window.confirm("Delete this featured unit?")) {
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
            <h1 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900">Featured Inventory</h1>
            <p className="text-[10px] text-blue-600 font-bold tracking-widest uppercase mt-1">High-End Assets Management</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="bg-black text-white px-8 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg hover:bg-slate-800 transition-all active:scale-95">
            <FaPlus className="inline mr-2" /> Add Featured Unit
          </button>
        </div>

        <div className="overflow-x-auto border border-gray-100 rounded-[2rem] shadow-sm bg-white">
          <table className="w-full text-left min-w-[1200px]">
            <thead className="bg-gray-50 border-b">
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="p-6">Unit Image & Model</th>
                <th className="p-6">Performance Specs</th>
                <th className="p-6">Inventory Status</th>
                <th className="p-6">Price</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr><td colSpan="5" className="p-20 text-center font-bold tracking-widest animate-pulse">FETCHING ASSETS...</td></tr>
              ) : (
                products.map((p) => (
                  <tr key={p._id} className="border-b hover:bg-gray-50/50 transition-colors">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="relative">
<img 
  src={renderImage(p.images || p.image)} 
  alt={p.name} 
  className="w-16 h-12 object-contain rounded-lg border bg-white" 
/>   
               {p.images?.length > 1 && (
                            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[8px] px-1.5 py-0.5 rounded-full font-black">+{p.images.length - 1}</span>
                          )}
                        </div>
                        <div className="flex flex-col">
                          {editingId === p._id ? (
                            <input className="border-b font-bold mb-1 outline-none focus:border-black p-1" value={editFormData.name || ""} onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} />
                          ) : (
                            <span className="font-bold text-slate-800">{p.name}</span>
                          )}
                          {editingId === p._id && (
                            <div className="mt-2">
                              <p className="text-[8px] font-bold uppercase text-blue-600 mb-1">Update Images:</p>
                              <input type="file" multiple className="text-[10px]" onChange={(e) => setImageFiles(Array.from(e.target.files))} />
                            </div>
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
                        <div className="flex flex-col gap-1">
                          <input className="border-b text-xs outline-none p-1" value={editFormData.stock || ""} onChange={(e) => setEditFormData({ ...editFormData, stock: e.target.value })} placeholder="Stock" />
                          <input className="border-b text-xs outline-none p-1" value={editFormData.graphics || ""} onChange={(e) => setEditFormData({ ...editFormData, graphics: e.target.value })} placeholder="GPU" />
                          <div className="flex items-center gap-1 bg-yellow-50 p-1 rounded border border-yellow-100">
                            <span className="text-yellow-600 text-[10px] font-black">★</span>
                        <input
  type="number" step="0.1" max="5" min="0"
  className="bg-transparent text-[10px] font-black text-yellow-700 outline-none w-full"
  // FIX: Agar value 0 hai to khali string dikhao taake placeholder nazar aaye
  value={editFormData.averageRating === 0 ? "" : editFormData.averageRating}
  onChange={(e) => setEditFormData({ ...editFormData, averageRating: e.target.value })}
  placeholder="Rating"
/>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          <span className={`${p.stock > 0 ? 'text-green-600' : 'text-red-600'} font-bold text-[11px] uppercase tracking-tighter`}>
                            {p.stock > 0 ? `${p.stock} Units In Stock` : 'Out Of Stock'}
                          </span>
                          <span className="text-[11px] text-blue-500 font-bold uppercase">{p.graphics}</span>
                          <div className="flex items-center gap-1.5">
                            <div className="flex text-yellow-400 text-[10px]">
                              <FaStar />
                            </div>
                            <span className="text-[11px] font-black text-slate-800 tracking-tight">
                              { p.averageRating || "0.0"} <span className="text-gray-400 font-normal">/ 5.0</span>
                            </span>
                          </div>
                        </div>
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
                          <button onClick={() => handleSaveEdit(p._id)} className="p-2 bg-black text-white rounded-lg hover:scale-105 transition-transform"><FaSave size={12} /></button>
                          <button onClick={() => { setEditingId(null); setImageFiles([]); }} className="p-2 bg-gray-200 text-gray-600 rounded-lg"><FaTimes size={12} /></button>
                        </div>
                      ) : (
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => { setEditingId(p._id); setEditFormData({ ...p, averageRating: p.ratings || 0 }); setImageFiles([]); }} className="p-2 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors"><FaEdit size={12} /></button>
                          <button onClick={() => handleDelete(p._id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"><FaTrash size={12} /></button>
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

      {showAddModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
              <h2 className="text-3xl font-black uppercase tracking-tighter italic">Featured Asset Entry</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-black transition-colors"><FaTimes size={24} /></button>
            </div>

            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest border-l-4 border-blue-600 pl-2">Asset Details</p>
                <input placeholder="Model Name" onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} required className="w-full bg-gray-50 p-4 rounded-xl outline-none font-bold focus:bg-white border-transparent focus:border-black border transition-all" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="number" placeholder="Price (PKR)" onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} required className="bg-gray-50 p-4 rounded-xl outline-none font-bold border-transparent focus:border-black border transition-all" />
                  <input type="number" placeholder="Stock Quantity" onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} required className="bg-gray-50 p-4 rounded-xl outline-none font-bold border-transparent focus:border-black border transition-all" />
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500">
                    <FaStar size={14} />
                  </div>
                  <input
                    type="number" step="0.1" max="5" min="0"
                    placeholder="Set Initial Rating (0.0 - 5.0)"
                    onChange={(e) => setNewProduct({ ...newProduct, averageRating: e.target.value })}
                    className="w-full bg-yellow-50/50 p-4 pl-10 rounded-xl outline-none font-black text-yellow-700 focus:bg-white border-2 border-dashed border-yellow-200 focus:border-yellow-400 transition-all placeholder:text-yellow-600/50"
                  />
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <p className="text-[9px] font-black uppercase mb-2">Display Gallery (Multiple)</p>
                  <input
                    type="file"
                    multiple
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
                        ✅ {imageFiles.length} Assets Staged
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase text-purple-600 tracking-widest border-l-4 border-purple-600 pl-2">Specifications</p>
                <input placeholder="Processor" onChange={(e) => setNewProduct({ ...newProduct, processor: e.target.value })} required className="w-full bg-gray-50 p-4 rounded-xl outline-none font-bold focus:bg-white border-transparent focus:border-black border" />
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="RAM" onChange={(e) => setNewProduct({ ...newProduct, ram: e.target.value })} required className="bg-gray-50 p-4 rounded-xl outline-none font-bold focus:bg-white border-transparent focus:border-black border" />
                  <input placeholder="Storage" onChange={(e) => setNewProduct({ ...newProduct, storage: e.target.value })} required className="bg-gray-50 p-4 rounded-xl outline-none font-bold focus:bg-white border-transparent focus:border-black border" />
                </div>
                <input placeholder="Graphics Card" onChange={(e) => setNewProduct({ ...newProduct, graphics: e.target.value })} required className="w-full bg-gray-50 p-4 rounded-xl outline-none font-bold focus:bg-white border-transparent focus:border-black border" />
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="Display" onChange={(e) => setNewProduct({ ...newProduct, display: e.target.value })} required className="bg-gray-50 p-4 rounded-xl outline-none font-bold focus:bg-white border-transparent focus:border-black border" />
                  <input placeholder="OS" onChange={(e) => setNewProduct({ ...newProduct, os: e.target.value })} required className="bg-gray-50 p-4 rounded-xl outline-none font-bold focus:bg-white border-transparent focus:border-black border" />
                </div>
              </div>

              <button type="submit" className="col-span-1 md:col-span-2 bg-black text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-slate-800 transition-all shadow-xl active:scale-95">
                Authorize & Deploy
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturedProductAdmin;