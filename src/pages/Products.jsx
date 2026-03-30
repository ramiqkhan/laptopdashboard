import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes } from "react-icons/fa";

const ProductAdmin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [selectedBrand, setSelectedBrand] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    brand: "",
    price: "",
    ram: "",
    gpu: "",
    stock: 0,
    ratings: "",
  });

  const API_URL = "http://localhost:5000/api/products";

  const brands = ["HP", "Dell", "Apple", "Lenovo", "Acer"];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const url = selectedBrand ? `${API_URL}?brand=${selectedBrand}` : API_URL;
      const response = await fetch(url);
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedBrand]);

  // --- ADD PRODUCT ---
  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in newProduct) {
      const value =
        key === "price" || key === "stock" || key === "ratings"
          ? Number(newProduct[key])
          : newProduct[key];
      formData.append(key, value);
    }
    if (imageFile) formData.append("image", imageFile);

    try {
      const response = await fetch(API_URL, { method: "POST", body: formData });
      if (response.ok) {
        setShowAddModal(false);
        setImageFile(null);
        setNewProduct({ name: "", brand: "", price: "", ram: "", gpu: "", stock: 0, ratings: "" });
        fetchProducts();
      } else {
        const err = await response.json();
        alert(err.error);
      }
    } catch (err) {
      alert("Server connection failed");
    }
  };

  // --- EDIT PRODUCT ---
  const handleSaveEdit = async (id) => {
    try {
      const formData = new FormData();
      for (const key in editFormData) {
        if (key !== "_id" && key !== "__v" && editFormData[key] !== undefined) {
          const value =
            key === "price" || key === "stock" || key === "ratings"
              ? Number(editFormData[key])
              : editFormData[key];
          formData.append(key, value);
        }
      }
      if (imageFile) formData.append("image", imageFile);

      const response = await fetch(`${API_URL}/${id}`, { method: "PUT", body: formData });
      if (response.ok) {
        setEditingId(null);
        setImageFile(null);
        fetchProducts();
      } else {
        const err = await response.json();
        alert(err.error);
      }
    } catch (err) {
      alert("Update failed");
    }
  };

  // --- DELETE PRODUCT ---
  const handleDelete = async (id) => {
    if (window.confirm("Delete this laptop?")) {
      try {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        setProducts(products.filter((p) => p._id !== id));
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  return (
    <div className="p-8 mt-20 bg-white min-h-screen text-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase">Inventory</h1>
            <div className="flex gap-4 mt-2">
              <select
                className="bg-gray-100 border-none rounded-lg px-4 py-2 text-[10px] font-bold uppercase tracking-widest outline-none"
                onChange={(e) => setSelectedBrand(e.target.value)}
              >
                <option value="">All Brands</option>
                {brands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl"
          >
            <FaPlus /> Add Laptop
          </button>
        </div>

        <div className="overflow-x-auto border border-gray-100 rounded-3xl shadow-sm">
          <table className="w-full text-left min-w-[1200px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-6 text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">Name</th>
                <th className="p-6 text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">Brand</th>
                <th className="p-6 text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">Price</th>
                <th className="p-6 text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">RAM</th>
                <th className="p-6 text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">GPU</th>
                <th className="p-6 text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">Stock</th>
                <th className="p-6 text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">Image</th>
                <th className="p-6 text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">Ratings</th>
                <th className="p-6 text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] text-right">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="9" className="p-20 text-center animate-pulse font-bold uppercase tracking-widest">
                    Updating Database...
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-6">
                      {editingId === p._id ? (
                        <input
                          className="border-b-2 border-black outline-none bg-transparent font-bold uppercase"
                          value={editFormData.name || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                        />
                      ) : p.name}
                    </td>
                    <td className="p-6">
                      {editingId === p._id ? (
                        <select
                          className="border-b-2 border-black outline-none bg-transparent font-bold uppercase"
                          value={editFormData.brand || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, brand: e.target.value })}
                        >
                          {brands.map((b) => <option key={b} value={b}>{b}</option>)}
                        </select>
                      ) : p.brand}
                    </td>
                    <td className="p-6">
                      {editingId === p._id ? (
                        <input
                          type="number"
                          className="border-b-2 border-black outline-none bg-transparent w-24"
                          value={editFormData.price || 0}
                          onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                        />
                      ) : <>${p.price || 0}</>}
                    </td>
                    <td className="p-6">
                      {editingId === p._id ? (
                        <input
                          className="border-b-2 border-black outline-none bg-transparent w-24 text-[10px]"
                          value={editFormData.ram || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, ram: e.target.value })}
                        />
                      ) : p.ram || "8GB"}
                    </td>
                    <td className="p-6">
                      {editingId === p._id ? (
                        <input
                          className="border-b-2 border-black outline-none bg-transparent w-24 text-[10px]"
                          value={editFormData.gpu || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, gpu: e.target.value })}
                        />
                      ) : p.gpu || "Integrated"}
                    </td>
                    <td className="p-6">
                      {editingId === p._id ? (
                        <input
                          type="number"
                          className="border-b-2 border-black outline-none bg-transparent w-24"
                          value={editFormData.stock || 0}
                          onChange={(e) => setEditFormData({ ...editFormData, stock: e.target.value })}
                        />
                      ) : p.stock}
                    </td>
                    <td className="p-6">
                      <img
                        src={p.image ? (p.image.startsWith("http") ? p.image : `http://localhost:5000${p.image}`) : "/placeholder.png"}
                        className="w-12 h-12 rounded-xl object-cover border border-gray-100"
                        alt={p.name || "Laptop"}
                      />
                      {editingId === p._id && (
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setImageFile(e.target.files[0])}
                          className="mt-2 w-full text-xs text-gray-500"
                        />
                      )}
                    </td>
                    <td className="p-6">
                      {editingId === p._id ? (
                        <input
                          type="number"
                          min="0"
                          max="5"
                          step="0.1"
                          className="border-b-2 border-black outline-none bg-transparent w-24"
                          value={editFormData.ratings || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, ratings: e.target.value })}
                        />
                      ) : p.ratings ?? "-"}
                    </td>
                    <td className="p-6 text-right">
                      {editingId === p._id ? (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleSaveEdit(p._id)} className="text-green-600"><FaSave /></button>
                          <button onClick={() => setEditingId(null)} className="text-gray-300"><FaTimes /></button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => { setEditingId(p._id); setEditFormData(p); }} className="text-black"><FaEdit /></button>
                          <button onClick={() => handleDelete(p._id)} className="text-red-400"><FaTrash /></button>
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

      {/* --- ADD PRODUCT MODAL --- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2rem] p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black uppercase tracking-tighter">Inventory Entry</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-300 hover:text-black">
                <FaTimes size={24} />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="grid grid-cols-2 gap-6">
              {/** Name */}
              <div className="col-span-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Product Name</label>
                <input required className="w-full bg-gray-50 border-b-2 border-transparent focus:border-black p-4 outline-none font-bold uppercase text-sm text-black" onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
              </div>
              {/** Brand */}
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Brand</label>
                <select required className="w-full bg-gray-50 p-4 outline-none font-bold uppercase text-sm text-black" onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}>
                  <option value="">Select Brand</option>
                  {brands.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              {/** Price */}
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Price ($)</label>
                <input required type="number" className="w-full bg-gray-50 p-4 outline-none font-bold text-sm text-black" onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
              </div>
              {/** RAM */}
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">RAM</label>
                <input className="w-full bg-gray-50 p-4 outline-none font-bold uppercase text-sm text-black" placeholder="16GB" onChange={(e) => setNewProduct({ ...newProduct, ram: e.target.value })} />
              </div>
              {/** GPU */}
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">GPU</label>
                <input className="w-full bg-gray-50 p-4 outline-none font-bold uppercase text-sm text-black" placeholder="Integrated" onChange={(e) => setNewProduct({ ...newProduct, gpu: e.target.value })} />
              </div>
              {/** Stock */}
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Stock</label>
                <input type="number" className="w-full bg-gray-50 p-4 outline-none font-bold text-sm text-black" onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} />
              </div>
              {/** Ratings */}
           <td className="p-6">
  {editingId === p._id ? (
    <input
      type="number"
      min="0"
      max="5"
      step="0.1"
      className="border-b-2 border-black outline-none bg-transparent w-24"
      value={editFormData.ratings !== undefined ? editFormData.ratings : ""}
      onChange={(e) =>
        setEditFormData({
          ...editFormData,
          ratings: Number(e.target.value),
        })
      }
    />
  ) : (
    p.ratings !== null && p.ratings !== undefined ? p.ratings : "-"
  )}
</td>
              {/** Image */}
              <div className="col-span-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Upload Image</label>
                <input type="file" accept="image/*" required className="w-full bg-gray-50 p-4 outline-none text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-black file:text-white cursor-pointer" onChange={(e) => setImageFile(e.target.files[0])} />
              </div>
              <button className="col-span-2 mt-4 bg-black text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-gray-800 transition-all">Add to Database</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductAdmin;