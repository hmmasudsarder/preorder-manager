/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { FiChevronLeft } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  useCreatePreorderMutation,
  useGetSinglePreorderQuery,
  useUpdatePreorderMutation,
} from "../redux/features/preorder/preorder.api";
import Link from "next/link";

type SinglePreorderResponse = {
  data: {
    name?: string;
    products?: number;
    preorderWhen?: string;
    startsAt?: string;
    endsAt?: string;
    status?: boolean;
  };
};

export default function PreorderForm({
  preorderId,
}: {
  preorderId?: string | number;
}) {
  const router = useRouter();
  const isEditMode = !!preorderId;

  // Form input states
  const [formData, setFormData] = useState({
    name: "",
    products: 1,
    preorderWhen: "regardless-of-stock",
    startsAt: "",
    endsAt: "",
    status: true,
  });

  const preprocessId =
    typeof preorderId === "number" ? String(preorderId) : preorderId || "";

  const { data: singleData, isLoading: isFetchLoading } =
    useGetSinglePreorderQuery(preprocessId, {
      skip: !isEditMode,
    });

  const [createPreorder, { isLoading: isCreateLoading }] =
    useCreatePreorderMutation();
  const [updatePreorder, { isLoading: isUpdateLoading }] =
    useUpdatePreorderMutation();

  const isSaving = isCreateLoading || isUpdateLoading;

  useEffect(() => {
    if (isEditMode && singleData?.data) {
      const item = singleData.data;
      setFormData({
        name: item.name || "",
        products: item.products || 1,
        preorderWhen: item.preorderWhen || "regardless-of-stock",
        startsAt: item.startsAt
          ? new Date(item.startsAt).toISOString().slice(0, 16)
          : "",
        endsAt: item.endsAt
          ? new Date(item.endsAt).toISOString().slice(0, 16)
          : "",
        status: item.status ?? true,
      });
    }
  }, [singleData, isEditMode]);

  // Handle Form Submission (Create or Update with RTK Query)
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const payload = {
      ...formData,
      startsAt: formData.startsAt
        ? new Date(formData.startsAt).toISOString()
        : new Date().toISOString(),
      endsAt: formData.endsAt ? new Date(formData.endsAt).toISOString() : null,
    };

    try {
      if (isEditMode) {
        await updatePreorder({ id: preorderId!, ...payload }).unwrap();
        toast.success("Preorder updated successfully!");
      } else {
        await createPreorder(payload).unwrap();
        toast.success("Preorder created successfully!");
      }

      router.push("/");
    } catch (err: any) {
      console.error("Failed to save preorder:", err);
      toast.error(
        err?.data?.message || "Something went wrong. Please try again.",
      );
    }
  };

  if (isEditMode && isFetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9fafb]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-gray-500">
            Loading existing details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] p-4 md:p-8 font-sans text-gray-800">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-4">
        {/* Top Header Actions (Matches UI-3.png top line) */}
        <div className="flex items-center justify-between">
          {/* Requirement 6: Back Button */}
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 rounded-lg text-sm font-semibold transition shadow-sm"
          >
            <Link href="/">
              <FiChevronLeft className="text-gray-600" size={16} /> Back
            </Link>
          </button>

          <div className="flex items-center gap-2">
            {/* Requirement 6: Cancel Button */}
            <button
              type="button"
              className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-sm font-semibold transition"
            >
              <Link href="/cancle">Cancel</Link>
            </button>

            {/* Requirement 6: Save Button with Loader State */}
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-[#1a1a1a] hover:bg-black text-white rounded-lg text-sm font-semibold transition disabled:opacity-70 flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save changes</span>
              )}
            </button>
          </div>
        </div>

        {/* Main Content Form Card */}
        <div className="bg-white rounded-xl border border-gray-200/90 shadow-sm overflow-hidden">
          {/* Card Header Title Description */}
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900">
              Preorder details
            </h2>
            <p className="text-xs text-gray-400 font-medium mt-0.5">
              These values appear in the preorders list.
            </p>
          </div>

          {/* Form Fields Stack */}
          <div className="p-6 space-y-6 divide-y divide-gray-100">
            {/* 1. Name Field */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              <div>
                <label className="text-sm font-bold text-gray-900">
                  Name <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-400 font-medium mt-1">
                  A label to recognize this preorder by.
                </p>
              </div>
              <div className="md:col-span-2">
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Multi variant 3"
                  className="w-full md:max-w-xl px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black transition"
                />
              </div>
            </div>

            {/* 2. Products Field */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
              <div>
                <label className="text-sm font-bold text-gray-900">
                  Products
                </label>
                <p className="text-xs text-gray-400 font-medium mt-1">
                  Number of products covered by this preorder.
                </p>
              </div>
              <div className="md:col-span-2 flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={formData.products}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      products: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:border-black transition"
                />
                <span className="text-xs font-medium text-gray-400">
                  product(s)
                </span>
              </div>
            </div>

            {/* 3. Preorder When Field */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
              <div>
                <label className="text-sm font-bold text-gray-900">
                  Preorder when
                </label>
                <p className="text-xs text-gray-400 font-medium mt-1">
                  When customers are allowed to preorder.
                </p>
              </div>
              <div className="md:col-span-2">
                <select
                  value={formData.preorderWhen}
                  onChange={(e) =>
                    setFormData({ ...formData, preorderWhen: e.target.value })
                  }
                  className="w-full md:max-w-xl px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black bg-white transition cursor-pointer"
                >
                  <option value="regardless-of-stock">
                    regardless-of-stock
                  </option>
                  <option value="out-of-stock">out-of-stock</option>
                </select>
              </div>
            </div>

            {/* 4. Starts At Field */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
              <div>
                <label className="text-sm font-bold text-gray-900">
                  Starts at
                </label>
                <p className="text-xs text-gray-400 font-medium mt-1">
                  When the preorder window opens.
                </p>
              </div>
              <div className="md:col-span-2 relative md:max-w-xl">
                <input
                  type="datetime-local"
                  required
                  value={formData.startsAt}
                  onChange={(e) =>
                    setFormData({ ...formData, startsAt: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black transition text-gray-700 bg-white"
                />
              </div>
            </div>

            {/* 5. Ends At Field */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
              <div>
                <label className="text-sm font-bold text-gray-900">
                  Ends at
                </label>
                <p className="text-xs text-gray-400 font-medium mt-1">
                  Leave empty for no end date.
                </p>
              </div>
              <div className="md:col-span-2 relative md:max-w-xl">
                <input
                  type="datetime-local"
                  value={formData.endsAt}
                  onChange={(e) =>
                    setFormData({ ...formData, endsAt: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black transition text-gray-700 bg-white"
                />
              </div>
            </div>

            {/* 6. Status Field */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 pb-2">
              <div>
                <label className="text-sm font-bold text-gray-900">
                  Status
                </label>
                <p className="text-xs text-gray-400 font-medium mt-1">
                  Active preorders are visible to customers.
                </p>
              </div>
              <div className="md:col-span-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, status: !formData.status })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    formData.status ? "bg-black" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      formData.status ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-sm font-semibold text-gray-600">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Footer Actions (Matches UI-3.png bottom row) */}
          <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-sm font-semibold transition"
            >
              <Link href="/">Cancel</Link>
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-[#1a1a1a] hover:bg-black text-white rounded-lg text-sm font-semibold transition disabled:opacity-70 flex items-center gap-2"
            >
              {isSaving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
