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
      invalidatesTags: ["PREORDER"], // নতুন ডাটা তৈরি হলে লিস্ট রিফ্রেশ করবে
    }),

    // get all preorder
    getAllPreorders: builder.query({
      query: () => ({
        url: "/preorder",
        method: "GET",
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
        method: "PUT",
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

// Auto-generated hooks রপ্তানি করা হলো কম্পোনেন্টে ব্যবহারের জন্য
export const {
  useCreatePreorderMutation,
  useGetAllPreordersQuery,
  useGetSinglePreorderQuery,
  useUpdatePreorderMutation,
  useDeletePreorderMutation,
} = preorderApi;