/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useRef, useEffect } from "react";
import { 
  FiArrowDown, 
  FiEdit3, 
  FiTrash2, 
  FiChevronLeft, 
  FiChevronRight 
} from "react-icons/fi";

const initialData = [
  { id: 1, name: "Multi variant 3", products: 1, preorderWhen: "out-of-stock", startsAt: "Dec 15, 2025 08:24 PM", endsAt: "", status: false },
  { id: 2, name: "Multi variant 2", products: 1, preorderWhen: "regardless-of-stock", startsAt: "Dec 15, 2025 08:24 PM", endsAt: "Dec 15, 2025 08:27 PM", status: true },
  { id: 3, name: "Multi variants 1", products: 1, preorderWhen: "regardless-of-stock", startsAt: "Dec 15, 2025 08:24 PM", endsAt: "", status: true },
  { id: 4, name: "Partial payment", products: 1, preorderWhen: "regardless-of-stock", startsAt: "Aug 17, 2025 04:56 PM", endsAt: "", status: true },
  { id: 5, name: "Shipping not sure", products: 1, preorderWhen: "regardless-of-stock", startsAt: "Aug 17, 2025 04:56 PM", endsAt: "", status: true },
  { id: 6, name: "Full payment", products: 1, preorderWhen: "regardless-of-stock", startsAt: "Aug 17, 2025 04:56 PM", endsAt: "", status: true },
  { id: 7, name: "Coming soon", products: 1, preorderWhen: "regardless-of-stock", startsAt: "Dec 11, 2025 04:42 AM", endsAt: "", status: true },
  { id: 8, name: "With ends", products: 1, preorderWhen: "regardless-of-stock", startsAt: "Aug 14, 2025 03:59 PM", endsAt: "", status: true },
];

export default function PreordersTable() {
  const [data, setData] = useState(initialData);
  const [activeTab, setActiveTab] = useState("All");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Created At");
  const [sortOrder, setSortOrder] = useState("Descending");
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Toggle status switcher
  const handleStatusToggle = (id: number) => {
    setData(data.map(item => item.id === id ? { ...item, status: !item.status } : item));
  };

  // Filter items based on active tabs
  const filteredData = data.filter((item) => {
    if (activeTab === "Active") return item.status === true;
    if (activeTab === "Inactive") return item.status === false;
    return true;
  });

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto font-sans text-gray-800 dark:text-gray-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Preorders</h1>
        <button className="bg-[#222] hover:bg-black text-white dark:bg-white dark:text-black dark:hover:bg-gray-100 text-sm font-semibold px-5 py-2.5 rounded-lg transition-all shadow-sm self-start sm:self-auto">
          Create Preorder
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white dark:bg-[#111] rounded-xl border border-gray-200/80 dark:border-zinc-800/80 shadow-sm overflow-hidden">
        
        {/* Table Filters & Sort Actions Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/30 relative">
          {/* Tabs */}
          <div className="flex bg-gray-200/60 dark:bg-zinc-800 p-1 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400">
            {["All", "Active", "Inactive"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-md transition-all ${
                  activeTab === tab
                    ? "bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm font-semibold"
                    : "hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Sort Button & Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="p-2 hover:bg-gray-200/70 dark:hover:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 transition-all text-gray-600 dark:text-gray-400"
            >
              <FiArrowDown size={18} />
            </button>

            {/* Sort Dropdown Window */}
            {isSortOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-xl z-50 py-2 text-sm text-gray-700 dark:text-gray-300 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-1.5 text-xs font-semibold text-gray-400 dark:text-gray-500 tracking-wider">Sort by</div>
                
                {/* Radio Options */}
                {["Name", "Created At", "Starts At", "Ends At"].map((option) => (
                  <label key={option} className="flex items-center px-4 py-2 hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="sortBy"
                      checked={sortBy === option}
                      onChange={() => setSortBy(option)}
                      className="w-4 h-4 text-black border-gray-300 focus:ring-black accent-black dark:accent-white"
                    />
                    <span className="ml-3 font-medium text-gray-800 dark:text-gray-200">{option}</span>
                  </label>
                ))}

                <div className="border-t border-gray-100 dark:border-zinc-800 my-1.5"></div>

                {/* Order Options */}
                {["Ascending", "Descending"].map((order) => (
                  <button
                    key={order}
                    onClick={() => setSortOrder(order)}
                    className={`w-full text-left px-4 py-2 flex items-center justify-between font-medium transition-colors ${
                      sortOrder === order ? "bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white font-semibold" : "hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    <span>{order === "Ascending" ? "↑ Ascending" : "↓ Descending"}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Responsive Table Wrapper */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-200">
            <thead>
              <tr className="border-b border-gray-100 dark:border-zinc-800 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50/30 dark:bg-zinc-900/10">
                <th className="p-4 w-12 text-center">
                  <input type="checkbox" className="rounded border-gray-300 dark:border-zinc-700 text-black focus:ring-black accent-black dark:accent-white w-4 h-4" />
                </th>
                <th className="p-4">Name</th>
                <th className="p-4">Products</th>
                <th className="p-4">Preorder when</th>
                <th className="p-4">Starts at</th>
                <th className="p-4">Ends at</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800 text-sm font-medium text-gray-700 dark:text-gray-300">
              {filteredData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                  <td className="p-4 text-center">
                    <input type="checkbox" className="rounded border-gray-300 dark:border-zinc-700 text-black focus:ring-black accent-black dark:accent-white w-4 h-4" />
                  </td>
                  <td className="p-4 font-bold text-gray-900 dark:text-white">{row.name}</td>
                  <td className="p-4 text-gray-500 dark:text-gray-400">{row.products}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-400 font-normal">{row.preorderWhen}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-400 font-normal">{row.startsAt}</td>
                  <td className="p-4 text-gray-400 dark:text-gray-500 font-normal">{row.endsAt || "—"}</td>
                  
                  {/* Status Toggle Button */}
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleStatusToggle(row.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                        row.status ? "bg-black dark:bg-white" : "bg-gray-200 dark:bg-zinc-700"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-zinc-950 transition duration-200 ease-in-out ${
                          row.status ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </td>

                  {/* Action Buttons */}
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 transition-all shadow-sm">
                        <FiEdit3 size={15} />
                      </button>
                      <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg border border-gray-200 dark:border-zinc-700 hover:border-red-200 dark:hover:border-red-900 transition-all shadow-sm">
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-center p-4 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/30 dark:bg-zinc-900/10 text-xs font-semibold text-gray-600 dark:text-gray-400 gap-4">
          <button className="p-2 border border-gray-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all text-gray-400 cursor-not-allowed">
            <FiChevronLeft size={16} />
          </button>
          <span className="text-gray-700 dark:text-gray-300">Showing 1 to {filteredData.length} from {filteredData.length}</span>
          <button className="p-2 border border-gray-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all text-gray-400 cursor-not-allowed">
            <FiChevronRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}