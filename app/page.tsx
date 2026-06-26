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
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { 
  useGetAllPreordersQuery,
  useUpdatePreorderMutation,
  useDeletePreorderMutation 
} from "./redux/features/preorder/preorder.api"; // আপনার ফাইলের সঠিক পাথটি রাখুন

export default function PreordersTable() {
  const router = useRouter();

  // --- ক্যোয়ারী এবং লোকাল স্টেটসমুহ ---
  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 10,
    status: "All", // "All" | "Active" | "Inactive"
    sort: "-createdAt"
  });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // --- RTK Query Backend Payload Preparation ---
  const apiQuery: Record<string, any> = {
    page: queryParams.page,
    limit: queryParams.limit,
    sort: queryParams.sort
  };
  
  if (queryParams.status === "Active") apiQuery.status = "true";
  if (queryParams.status === "Inactive") apiQuery.status = "false";

  // Fetching Data
  const { data: apiResponse, isLoading, isFetching } = useGetAllPreordersQuery(apiQuery);
  const [updatePreorder] = useUpdatePreorderMutation();
  const [deletePreorder] = useDeletePreorderMutation();

  // API Data Extraction
  const preorders = apiResponse?.data?.result || [];
  const meta = apiResponse?.data?.meta || { page: 1, limit: 10, total: 0, totalPage: 1 };

  // সর্ট ড্রপডাউন লেবেলের ম্যাপিং
  const sortLabelMap: Record<string, { by: string; order: string }> = {
    "name": { by: "Name", order: "Ascending" },
    "-name": { by: "Name", order: "Descending" },
    "createdAt": { by: "Created At", order: "Ascending" },
    "-createdAt": { by: "Created At", order: "Descending" },
    "startsAt": { by: "Starts At", order: "Ascending" },
    "-startsAt": { by: "Starts At", order: "Descending" },
    "endsAt": { by: "Ends At", order: "Ascending" },
    "-endsAt": { by: "Ends At", order: "Descending" }
  };

  const currentSort = sortLabelMap[queryParams.sort] || { by: "Created At", order: "Descending" };

  // ক্লোজ ড্রপডাউন অন আউটসাইড ক্লিক
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- হ্যান্ডলার ফাংশনসমূহ ---

  // স্ট্যাটাস সুইচ চেঞ্জার (টগল লজিক ফিক্সড)
  const handleStatusToggle = async (id: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    try {
      // টোস্ট প্রমিজ দিয়ে ব্যাকএন্ডের রেসপন্স লাইভ ট্র্যাক করা হচ্ছে
      await toast.promise(
        updatePreorder({ id, status: nextStatus }).unwrap(),
        {
          pending: "Updating status...",
          success: `Preorder status changed to ${nextStatus ? "Active" : "Inactive"}!`,
          error: "Failed to update status. Try again."
        }
      );
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  // ডাটা ডিলিট হ্যান্ডলার
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this preorder?")) {
      try {
        await deletePreorder(id).unwrap();
        setSelectedIds(prev => prev.filter(item => item !== id));
        toast.success("Preorder deleted successfully!");
      } catch (error) {
        console.error("Failed to delete preorder:", error);
        toast.error("Failed to delete preorder.");
      }
    }
  };

  // চেক বক্স সিলেক্ট অল হ্যান্ডলার
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = preorders.map((item: any) => item.id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  // সিঙ্গেল রো চেক বক্স হ্যান্ডলার
  const handleSelectRow = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // সর্ট পরিবর্তনের লজিক (ফিক্সড)
  const handleSortChange = (field: string, direction: "asc" | "desc") => {
    const sortValue = direction === "desc" ? `-${field}` : field;
    setQueryParams(prev => ({ ...prev, sort: sortValue, page: 1 }));
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto font-sans text-gray-800 dark:text-gray-200">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Preorders</h1>
        <button 
          onClick={() => router.push("/preorder")} //Requirement 5: ওপেন ক্রিয়েট পেজ
          className="bg-[#222] hover:bg-black text-white dark:bg-white dark:text-black dark:hover:bg-gray-100 text-sm font-semibold px-5 py-2.5 rounded-lg transition-all shadow-sm self-start sm:self-auto"
        >
          Create Preorder
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white dark:bg-[#111] rounded-xl border border-gray-200/80 dark:border-zinc-800/80 shadow-sm overflow-hidden relative">
        
        {/* Requirement 6: Loading & Fetching states overlay */}
        {(isLoading || isFetching) && (
          <div className="absolute inset-0 bg-white/40 dark:bg-black/40 z-10 flex items-center justify-center pointer-events-none">
            <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 px-4 py-2 rounded-lg shadow-md border border-gray-100 dark:border-zinc-800">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-black dark:border-zinc-600 dark:border-t-white rounded-full animate-spin"></div>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Loading preorders...</span>
            </div>
          </div>
        )}

        {/* Table Filters & Sort Actions Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/30 relative">
          
          {/* Requirement 1: Backend Filters (Tabs) */}
          <div className="flex bg-gray-200/60 dark:bg-zinc-800 p-1 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400">
            {["All", "Active", "Inactive"].map((tab) => (
              <button
                key={tab}
                onClick={() => setQueryParams(prev => ({ ...prev, status: tab, page: 1 }))}
                className={`px-4 py-1.5 rounded-md transition-all ${
                  queryParams.status === tab
                    ? "bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm font-semibold"
                    : "hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Requirement 1: Backend Sort Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="p-2 hover:bg-gray-200/70 dark:hover:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 transition-all text-gray-600 dark:text-gray-400 flex items-center gap-1.5 text-xs font-semibold"
            >
              <FiArrowDown size={16} />
              <span>{currentSort.by} ({currentSort.order === "Ascending" ? "↑" : "↓"})</span>
            </button>

            {/* Sort Dropdown Window */}
            {isSortOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-xl z-50 py-2 text-sm text-gray-700 dark:text-gray-300">
                <div className="px-4 py-1.5 text-xs font-semibold text-gray-400 dark:text-gray-500 tracking-wider">Sort by</div>
                
                {[
                  { label: "Name", field: "name" },
                  { label: "Created At", field: "createdAt" },
                  { label: "Starts At", field: "startsAt" },
                  { label: "Ends At", field: "endsAt" }
                ].map((option) => (
                  <label key={option.field} className="flex items-center px-4 py-2 hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="sortBy"
                      checked={currentSort.by === option.label}
                      onChange={() => handleSortChange(option.field, currentSort.order === "Ascending" ? "asc" : "desc")}
                      className="w-4 h-4 border-gray-300 accent-black dark:accent-white"
                    />
                    <span className="ml-3 font-medium text-gray-800 dark:text-gray-200">{option.label}</span>
                  </label>
                ))}

                <div className="border-t border-gray-100 dark:border-zinc-800 my-1.5"></div>

                {/* Order Options */}
                {[
                  { label: "↑ Ascending", val: "asc" },
                  { label: "↓ Descending", val: "desc" }
                ].map((order) => {
                  const targetField = queryParams.sort.replace("-", "");
                  const isCurrentOrder = order.val === "desc" ? queryParams.sort.startsWith("-") : !queryParams.sort.startsWith("-");
                  return (
                    <button
                      key={order.val}
                      type="button"
                      onClick={() => handleSortChange(targetField, order.val as any)}
                      className={`w-full text-left px-4 py-2 flex items-center justify-between font-medium transition-colors ${
                        isCurrentOrder ? "bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white font-semibold" : "hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      <span>{order.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Responsive Table Wrapper */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-200px">
            <thead>
              <tr className="border-b border-gray-100 dark:border-zinc-800 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50/30 dark:bg-zinc-900/10">
                <th className="p-4 w-12 text-center">
                  {/* Requirement 3: Select All Checkbox */}
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll}
                    checked={preorders.length > 0 && selectedIds.length === preorders.length}
                    className="rounded border-gray-300 dark:border-zinc-700 text-black accent-black dark:accent-white w-4 h-4 cursor-pointer" 
                  />
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
              {preorders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-400 dark:text-zinc-600 font-normal">
                    No preorders found matching the criteria.
                  </td>
                </tr>
              ) : (
                preorders.map((row: any) => (
                  <tr key={row.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                    <td className="p-4 text-center">
                      {/* Requirement 3: Row Checkbox */}
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(row.id)}
                        onChange={() => handleSelectRow(row.id)}
                        className="rounded border-gray-300 dark:border-zinc-700 text-black accent-black dark:accent-white w-4 h-4 cursor-pointer" 
                      />
                    </td>
                    <td className="p-4 font-bold text-gray-900 dark:text-white">{row.name}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{row.products}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400 font-normal">{row.preorderWhen}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400 font-normal">
                      {new Date(row.startsAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400 font-normal">
                      {row.endsAt ? new Date(row.endsAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }) : "—"}
                    </td>
                    
                    {/* Requirement 2: Status Switch Toggle */}
                    <td className="p-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleStatusToggle(row.id, row.status)}
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

                    {/* Requirement 2 & 4: Edit and Delete Action Buttons */}
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Requirement 4: ওপেন আপডেট পেজ উইথ আইডি */}
                        <button 
                          type="button"
                          onClick={() => router.push(`/preorder/${row.id}`)}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 transition-all shadow-sm"
                        >
                          <FiEdit3 size={15} />
                        </button>
                        {/* Requirement 2: ডাটাবেজ থেকে রিমুভ করা */}
                        <button 
                          type="button"
                          onClick={() => handleDelete(row.id)}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg border border-gray-200 dark:border-zinc-700 hover:border-red-200 dark:hover:border-red-900 transition-all shadow-sm"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Requirement 1: Backend Pagination Footer */}
        <div className="flex items-center justify-center p-4 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/30 dark:bg-zinc-900/10 text-xs font-semibold text-gray-600 dark:text-gray-400 gap-4">
          <button 
            type="button"
            disabled={meta.page <= 1}
            onClick={() => setQueryParams(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
            className={`p-2 border border-gray-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all ${
              meta.page <= 1 ? "text-gray-300 dark:text-zinc-600 cursor-not-allowed" : "text-gray-600 dark:text-gray-300"
            }`}
          >
            <FiChevronLeft size={16} />
          </button>
          
          <span className="text-gray-700 dark:text-gray-300">
            Showing Page {meta.page} of {meta.totalPage} (Total {meta.total} preorders)
          </span>
          
          <button 
            type="button"
            disabled={meta.page >= meta.totalPage}
            onClick={() => setQueryParams(prev => ({ ...prev, page: Math.min(meta.totalPage, prev.page + 1) }))}
            className={`p-2 border border-gray-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all ${
              meta.page >= meta.totalPage ? "text-gray-300 dark:text-zinc-600 cursor-not-allowed" : "text-gray-600 dark:text-gray-300"
            }`}
          >
            <FiChevronRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}