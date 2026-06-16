import React, { useState, useEffect } from 'react';

const AdminReviewsDashboard = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterModel, setFilterModel] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  // ✅ Dictionary to map IDs to actual names: { "65cbd...": "ThinkPad X1 Carbon" }
  const [productNames, setProductNames] = useState({});

  const BACKEND_URL = 'https://laptopbackend-seven.vercel.app';

  useEffect(() => {
    const initializeDashboard = async () => {
      setLoading(true);
      // 1. Fetch catalog name data first
      await fetchAllProductNames();
      // 2. Fetch the reviews
      await fetchReviews();
      setLoading(false);
    };

    initializeDashboard();
  }, []);

  // Cross-reference names from all your endpoint data structures
  const fetchAllProductNames = async () => {
    try {
      const nameMap = {};
      
      // ✅ UPDATED WITHOUT BREAKING STRUCTURE: Targeted correct API endpoints matching database collections
      const endpoints = [
        { url: `${BACKEND_URL}/api/products` },
        { url: `${BACKEND_URL}/api/featured-products/all` }, 
        { url: `${BACKEND_URL}/api/deals` }
      ];

      // Fetch from all collections concurrently
      const responses = await Promise.all(
        endpoints.map(e => fetch(e.url).then(res => res.ok ? res.json() : []).catch(() => []))
      );

      // Flatten arrays and store key-value pairs of [id]: name
      responses.forEach((dataset) => {
        if (!dataset) return;

        // Level A: Direct Array response parsing
        if (Array.isArray(dataset)) {
          dataset.forEach((item) => {
            if (item && item.name) {
              const targetId = item._id || item.id;
              if (targetId) nameMap[targetId] = item.name;
            }
          });
        } 
        // Level B: Safe catch for dynamic object structures (e.g. { data: [...] } or { products: [...] })
        else if (typeof dataset === 'object') {
          const nestedArray = dataset.products || dataset.data || dataset.featured || Object.values(dataset).find(Array.isArray) || [];
          if (Array.isArray(nestedArray)) {
            nestedArray.forEach((item) => {
              if (item && item.name) {
                const targetId = item._id || item.id;
                if (targetId) nameMap[targetId] = item.name;
              }
            });
          }
        }
      });

      setProductNames(nameMap);
    } catch (err) {
      console.error("Error building name reference catalog:", err);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/reviews`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this review?")) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/reviews/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        setReviews(reviews.filter((review) => review._id !== id));
      } catch (error) {
        alert("Failed to delete review. Try again.");
        console.error("Delete error:", error);
      }
    }
  };

  const filteredReviews = reviews.filter((review) => {
    const productName = productNames[review.productItem] || '';
    const matchesModel = filterModel === 'All' || review.onModel === filterModel;
    const matchesSearch = 
      (review.username && review.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (review.comment && review.comment.toLowerCase().includes(searchTerm.toLowerCase())) ||
      productName.toLowerCase().includes(searchTerm.toLowerCase()); // Now searches by name too!
    return matchesModel && matchesSearch;
  });

  return (
    <div className="min-h-screen mt-19 bg-slate-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 mb-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Reviews Management</h1>
            <p className="text-slate-500 text-sm mt-1">Moderate, track, and clear user reviews across all inventory items.</p>
          </div>
          <div className="mt-4 md:mt-0 bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200 text-slate-700 font-medium">
            Total Reviews: <span className="text-indigo-600 font-bold">{reviews.length}</span>
          </div>
        </div>

        {/* Filters Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by username, comment, or product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>
          <div className="w-full sm:w-48">
            <select
              value={filterModel}
              onChange={(e) => setFilterModel(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-700"
            >
              <option value="All">All Types</option>
              <option value="Product">Standard Products</option>
              <option value="FeaturedProduct">Featured Products</option>
              <option value="Deal">Deals</option>
            </select>
          </div>
        </div>

        {/* Content Table Layout */}
        {loading ? (
          <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm border border-slate-100">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-400 text-lg">No reviews matching the selection criteria found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 text-xs uppercase font-bold tracking-wider">
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Product Context</th>
                    <th className="px-6 py-4">Review Description</th>
                    <th className="px-6 py-4">Posted Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                  {filteredReviews.map((review) => (
                    <tr key={review._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-900 whitespace-nowrap">
                        {review.username}
                      </td>

                      <td className="px-6 py-4 max-w-xs">
                        {/* ✅ FIXED: Displays the actual human-readable name instead of the ID fallback */}
                        <div className="font-semibold text-slate-800 truncate" title={productNames[review.productItem]}>
                          {productNames[review.productItem] || "Loading product name..."}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${
                            review.onModel === 'Product' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                            review.onModel === 'FeaturedProduct' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                            'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {review.onModel === 'FeaturedProduct' ? 'Featured' : review.onModel}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 max-w-md break-words">
                        {review.comment}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-xs">
                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : 'N/A'}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleDelete(review._id)}
                          className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors border border-red-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminReviewsDashboard;