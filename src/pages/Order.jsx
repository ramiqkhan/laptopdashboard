import React, { useEffect, useState } from "react";

const OrderAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null); // Track editing state

const API_URL = "https://laptopbackend-seven.vercel.app/api/orders";
const fetchOrders = async () => {
  setLoading(true);
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    setOrders(data);
  } catch (err) {
    console.log("Fetch error:", err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_URL}/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setEditingId(null);
        fetchOrders();
      } else {
        alert("Status update failed");
      }
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="p-4 mt-20 bg-white min-h-screen text-black">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-black uppercase tracking-tighter">Orders Management</h1>
          <p className="text-gray-400 text-xs uppercase tracking-widest mt-1">
            All Customer Orders
          </p>
        </div>

        <div className="border border-gray-100 rounded-[2rem] shadow-sm overflow-hidden">
          <table className="w-full table-auto text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Info</th>
                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Shipping Address</th>
                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment</th>
                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Items</th>
                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</th>
                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="10" className="p-20 text-center font-black uppercase text-xs tracking-widest text-gray-300">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
                      Synchronizing Orders...
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                    
                    <td className="p-4 font-mono font-bold text-[#d6a11e] text-xs">
                      #{order.orderId || order._id.slice(-6)}
                    </td>

                    <td className="p-4 font-black uppercase text-slate-800 break-words">
                      {order.userName}
                    </td>

                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-slate-700 font-bold">{order.phone || "N/A"}</span>
                        <span className="text-gray-400 text-[11px] break-all">{order.email}</span>
                      </div>
                    </td>

                    <td className="p-4 text-gray-500 text-xs max-w-[180px] leading-relaxed">
                      {order.address}
                    </td>

                    <td className="p-4">
                      <span className="px-2 py-1 bg-slate-100 rounded-md uppercase text-[10px] font-black text-slate-500">
                        {order.paymentType}
                      </span>
                    </td>

                    <td className="p-4 text-[10px]">
                      {order.products.map((p, index) => (
                        <div key={index} className="mb-1 last:mb-0">
                          <span className="font-bold text-slate-700">{p.name}</span> 
                          <span className="text-gray-400 italic"> × {p.quantity}</span>
                        </div>
                      ))}
                    </td>

                    <td className="p-4 font-black text-slate-900 whitespace-nowrap">
                      PKR {order.totalAmount?.toLocaleString()}
                    </td>

                    <td className="p-4">
                      <select
                        disabled={editingId !== order._id}
                        value={order.status}
                        onChange={(e) =>
                          setOrders(
                            orders.map((o) =>
                              o._id === order._id
                                ? { ...o, status: e.target.value }
                                : o
                            )
                          )
                        }
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase outline-none transition-all
                          ${editingId === order._id 
                            ? 'bg-white border border-[#d6a11e] ring-2 ring-[#d6a11e]/10' 
                            : 'bg-gray-100 opacity-60 cursor-not-allowed'}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="p-4 text-[10px] font-bold text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {editingId === order._id ? (
                          <>
                            <button
                              onClick={() => updateStatus(order._id, order.status)}
                              className="bg-black text-white px-3 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-[#d6a11e] hover:text-black transition-all"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => { setEditingId(null); fetchOrders(); }}
                              className="bg-gray-200 text-gray-600 px-3 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-gray-300 transition-all"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setEditingId(order._id)}
                            className="bg-black text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-[#d6a11e] hover:text-black transition-all"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderAdmin;