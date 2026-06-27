/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../baseApi";

export type PreorderListResponse = {
  data: {
    result: any[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPage: number;
    };
  };
};

export type PreorderResponse<T = any> = {
  data: T;
};

export const preorderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // create preorder
    createPreorder: builder.mutation<PreorderResponse, any>({
      query: (preorderData: any) => ({
        url: "/preorder/create",
        method: "POST",
        data: preorderData,
      }),
      invalidatesTags: ["PREORDER"],
    }),

    getAllPreorders: builder.query<PreorderListResponse, any>({
      query: (params: any) => ({
        url: "/preorder",
        method: "GET",
        params,
      }),
      providesTags: ["PREORDER"],
    }),

    // get single preorder by id
    getSinglePreorder: builder.query<PreorderResponse, string>({
      query: (id: string) => ({
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

export const {
  useCreatePreorderMutation,
  useGetAllPreordersQuery,
  useGetSinglePreorderQuery,
  useUpdatePreorderMutation,
  useDeletePreorderMutation,
} = preorderApi;