
// import utilsSlice from "./features/utils/utilsSlice";
// import modalSlices from "./features/modals/modalSlices";
// import baseApiQuery from "./api/apiSlice";
// // import { setupListeners } from "@reduxjs/toolkit/dist/query";
// import authSlice from "./features/auth/authSlice";
// import { configureStore } from "@reduxjs/toolkit";
// import { setupListeners } from "@reduxjs/toolkit/query";


// export const store = configureStore({
//   reducer: {
//     modal: modalSlices,
//     utils: utilsSlice,
//     auth: authSlice,
//     [baseApiQuery.reducerPath]: baseApiQuery.reducer
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(baseApiQuery.middleware),

// })
// setupListeners(store.dispatch)
import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./baseApi";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;