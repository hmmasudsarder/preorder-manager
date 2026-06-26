/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../baseApi";

export const preorderApi = baseApi.injectEndpoints({
  endpoints: (builder: any) => ({
    // create preorder
    createPreorder: builder.mutation({
      query: (preorderData: any) => ({
        url: "/preorder/create",
        method: "POST",
        data: preorderData,
      }),
      invalidatesTags: ["PREORDER"],
    }),

    // get all preorder (FIXED: params যুক্ত করা হয়েছে)
    getAllPreorders: builder.query({
      query: (params: any) => ({
        url: "/preorder",
        method: "GET",
        params, // এখানে page, limit, status, sort কুয়েরি হিসেবে ব্যাকএন্ডে যাবে
      }),
      providesTags: ["PREORDER"],
    }),

    // get single preorder by id
    getSinglePreorder: builder.query({
      query: (id: string | number) => ({
        url: `/preorder/${id}`,
        method: "GET",
      }),
      providesTags: (result: any, error: any, id: any) => [{ type: "PREORDER", id }],
    }),

    // update preorder
    updatePreorder: builder.mutation({
      query: ({ id, ...preorderData }: { id: string | number; [key: string]: any }) => ({
        url: `/preorder/${id}`,
        method: "PUT", // আপনার ব্যাকএন্ডে যদি PATCH হয়, তবে PATCH লিখে দিন
        data: preorderData,
      }),
      invalidatesTags: (result: any, error: any, { id }: any) => [
        { type: "PREORDER", id },
        "PREORDER",
      ],
    }),

    // delete preorder
    deletePreorder: builder.mutation({
      query: (id: string | number) => ({
        url: `/preorder/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PREORDER"],
    }),
  }),
});

export const {
  useCreatePreorderMutation,
  useGetAllPreordersQuery,
  useGetSinglePreorderQuery,
  useUpdatePreorderMutation,
  useDeletePreorderMutation,
} = preorderApi;