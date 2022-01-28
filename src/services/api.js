import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { toastr } from "react-redux-toastr";
import { logout } from "../store/slice/AuthSlice";
// import { API_ENDPOINT } from '../constants'
const API_ENDPOINT = "https://auction-village-be.herokuapp.com/api/v1/";

const baseQuery = fetchBaseQuery({
  baseUrl: API_ENDPOINT,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.userToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    // logout

    toastr("error", "Looks like your session has expired, please login again.");
    setTimeout(() => {
      api.dispatch(logout());
    }, 1000);
  }
  return result;
};

export const authApi = createApi({
  baseQuery: baseQueryWithReauth,
  reducerPath: "authApi",
  tagTypes: [
    "category",
    "deal",
    "transaction",
    "privatedeal",
    "vendor",
    "users",
    "admin",
    "user",
    "admins",
    "chat",
  ],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "user/av/admin-root/login",
        method: "POST",
        body: credentials,
      }),
    }),
    createChat: builder.mutation({
      query: (credentials) => ({
        url: "chats/conversations",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["chat"],
    }),
    getConversationBtwUsers: builder.query({
      query: ({ idFirst, idSecond }) =>
        `chats/conversations/${idFirst}/${idSecond}`,
      providesTags: ["chat"],
      transformResponse: (response) => response,
    }),
    getConversation: builder.query({
      query: (id) => `chats/conversations/${id}/user`,
      providesTags: ["chat"],
      transformResponse: (response) => response,
    }),
    getAdmins: builder.query({
      query: () => "user/av/admins/total",
      providesTags: ["admins"],
      transformResponse: (response) => response,
    }),
    getUsers: builder.query({
      query: () => "users-reg/all",
      providesTags: ["users"],
      transformResponse: (response) => response,
    }),

    getUser: builder.query({
      query: (id) => `user/av/users/view/${id}`,
      providesTags: ["user"],
      transformResponse: (response) => response,
    }),
    getTransaction: builder.query({
      query: () => "transaction",
      providesTags: ["transaction"],
      transformResponse: (response) => response.data,
    }),
    getEachTransaction: builder.query({
      query: (id) => `transaction/user/${id}`,
      providesTags: ["transaction"],
      transformResponse: (response) => response,
    }),
    getAllCategory: builder.query({
      query: () => "categories/get-all-categories",
      providesTags: ["category"],
      transformResponse: (response) => response.data,
    }),
    getAllPrivateDeal: builder.query({
      query: () => "private",
      providesTags: ["privatedeal"],
      transformResponse: (response) => response.data,
    }),
    getAllPrivateBuyDeal: builder.query({
      query: () => "private/buy-now",
      providesTags: ["privatedeal"],
      transformResponse: (response) => response.data,
    }),
    addPrivateDeal: builder.mutation({
      query: (credentials) => ({
        url: "private/new-deal",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["privatedeal"],
    }),
    deactivatePrivateDeal: builder.mutation({
      query: ({ id }) => ({
        url: `private/deals/deactivate/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["deal"],
    }),
    // deal side
    getAllDeal: builder.query({
      query: () => "deals",
      providesTags: ["deal"],
      transformResponse: (response) => response,
    }),
    getAllDealPrivate: builder.query({
      query: () => "deals/buy-now",
      providesTags: ["deal"],
      transformResponse: (response) => response,
    }),
    approveDeal: builder.mutation({
      query: ({ id }) => ({
        url: `deals/deals/approve/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["deal"],
    }),
    rejectDeal: builder.mutation({
      query: ({ id }) => ({
        url: `deals/deals/decline/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["deal"],
    }),
    getOneDeal: builder.query({
      query: (id) => `deals/single-deal/${id}`,
      providesTags: ["vendor"],
      transformResponse: (response) => response.data,
    }),
    // private vendor
    getAllPrivateVendor: builder.query({
      query: () => "vendors",
      providesTags: ["vendor"],
      transformResponse: (response) => response.data,
    }),

    addVendor: builder.mutation({
      query: (credentials) => ({
        url: "vendors/new",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["vendor"],
    }),

    addCategory: builder.mutation({
      query: (credentials) => ({
        url: "categories/category-create",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["category"],
    }),
    editCategory: builder.mutation({
      query: ({ credentials, id }) => ({
        url: `categories/edit-category/${id}`,
        method: "PUT",
        body: credentials,
      }),
      invalidatesTags: ["category"],
    }),
    activateCategory: builder.mutation({
      query: ({ id }) => ({
        url: `categories/category-activate/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["category"],
    }),
    disableCategory: builder.mutation({
      query: ({ id }) => ({
        url: `categories/category-disable/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["category"],
    }),
    signup: builder.mutation({
      query: (credentials) => ({
        url: "user/av/admin/root/login",
        method: "POST",
        body: credentials,
      }),
    }),
    addAdmin: builder.mutation({
      query: (credentials) => ({
        url: "user/av/admin/signup",
        method: "POST",
        body: credentials,
      }),
    }),
    resetPwd: builder.mutation({
      query: (credentials) => ({
        url: "reset",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});
export const {
  useLoginMutation,
  useSignupMutation,
  useAddAdminMutation,
  useResetPwdMutation,
  useGetAllCategoryQuery,
  useAddCategoryMutation,
  useEditCategoryMutation,
  useActivateCategoryMutation,
  useDisableCategoryMutation,
  useGetAllPrivateDealQuery,
  useAddPrivateDealMutation,
  useGetAllDealQuery,
  useApproveDealMutation,
  useRejectDealMutation,
  useDeactivatePrivateDealMutation,
  useGetTransactionQuery,
  useGetEachTransactionQuery,
  useGetAllPrivateBuyDealQuery,
  useGetAllPrivateVendorQuery,
  useAddVendorMutation,
  useGetOneDealQuery,
  useGetAllDealPrivateQuery,
  useGetAdminsQuery,
  useGetUserQuery,
  useGetUsersQuery,
  useCreateChatMutation,
  useGetConversationQuery,
  useGetConversationBtwUsersQuery,
} = authApi;
