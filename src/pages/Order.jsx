import React, { useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";

const OrderAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:5000/api/orders";

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
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
      const res = await fetch(`${API_URL}/${id}/status`, { // FIXED URL
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
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
          <h1 className="text-3xl font-black uppercase">Orders Management</h1>
          <p className="text-gray-400 text-xs uppercase tracking-widest mt-1">
            All Customer Orders
          </p>
        </div>

        <div className="border border-gray-100 rounded-3xl shadow-sm">
          <table className="w-full table-auto text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-3 text-[11px] font-bold text-gray-400 uppercase">Customer</th>
                <th className="p-3 text-[11px] font-bold text-gray-400 uppercase">Email</th>
                <th className="p-3 text-[11px] font-bold text-gray-400 uppercase">Address</th>
                <th className="p-3 text-[11px] font-bold text-gray-400 uppercase">Payment</th>
                <th className="p-3 text-[11px] font-bold text-gray-400 uppercase">Products</th>
                <th className="p-3 text-[11px] font-bold text-gray-400 uppercase">Total</th>
                <th className="p-3 text-[11px] font-bold text-gray-400 uppercase">Status</th>
                <th className="p-3 text-[11px] font-bold text-gray-400 uppercase">Date</th>
                <th className="p-3 text-[11px] font-bold text-gray-400 uppercase">Save</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="9" className="p-10 text-center font-bold uppercase">
                    Loading Orders...
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition">
                    
                    <td className="p-3 font-bold uppercase break-words">{order.userName}</td>
                    <td className="p-3 break-words">{order.email}</td>
                    <td className="p-3 break-words">{order.address}</td>
                    <td className="p-3 uppercase text-xs font-bold">{order.paymentType}</td>

                    <td className="p-3 text-xs">
                      {order.products.map((p, index) => (
                        <div key={index}>
                          {p.name} (${p.price}) × {p.quantity}
                        </div>
                      ))}
                    </td>

                    <td className="p-3 font-bold">${order.totalAmount}</td>

                    <td className="p-3">
                      <select
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
                        className="bg-gray-100 px-2 py-1 rounded text-xs font-bold uppercase outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="p-3 text-xs">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-3">
                      <button
                        onClick={() => updateStatus(order._id, order.status)}
                        className="bg-black text-white p-2 rounded-full hover:bg-gray-800"
                      >
                        <FaSave size={12} />
                      </button>
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