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
    "chatmessage",
    "audit",
    "wallet",
    "dash",
  ],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "user/av/admin-root/login",
        method: "POST",
        body: credentials,
      }),
    }),
    loginnormal: builder.mutation({
      query: (credentials) => ({
        url: "user/av/admin-login",
        method: "POST",
        body: credentials,
      }),
    }),

    update: builder.mutation({
      query: ({ credentials, id }) => ({
        url: `user/av/users?id=${id}`,
        method: "PUT",
        body: credentials,
      }),
      invalidatesTags: ["admins", "user", "users"],
    }),
    updateBatch: builder.mutation({
      query: ({ credentials, id }) => ({
        url: `user/av/users?id=${id}`,
        method: "PUT",
        body: credentials,
      }),
      invalidatesTags: ["admins", "user", "users"],
    }),
    updatePassword: builder.mutation({
      query: (credentials) => ({
        url: `user/av/change-password`,
        method: "PUT",
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
    sendChat: builder.mutation({
      query: (credentials) => ({
        url: "/chats/messages",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["chatmessage"],
    }),

    getConversationBtwUsers: builder.query({
      query: ({ idFirst, idSecond }) =>
        `chats/conversations/${idFirst}/${idSecond}`,
      providesTags: ["chatmessage"],
      transformResponse: (response) => response,
    }),
    getUserDeal: builder.query({
      query: (id) => `deals/user/${id}`,
      providesTags: ["deal"],
      transformResponse: (response) => response,
    }),
    getConversation: builder.query({
      query: (id) => `chats/conversations/${id}/user`,
      providesTags: ["chat"],
      transformResponse: (response) => response,
    }),
    getWallet: builder.query({
      query: (id) => `user/wallet/${id}`,
      providesTags: ["wallet"],
      transformResponse: (response) => response,
    }),
    getUserTrans: builder.query({
      query: (id) => `transaction/all/${id}`,
      providesTags: ["transaction"],
      transformResponse: (response) => response,
    }),
    getAdmins: builder.query({
      query: () => "user/av/admins/total",
      providesTags: ["admins"],
      transformResponse: (response) => response,
    }),
    getUsers: builder.query({
      query: () => "user/users-reg/all",
      providesTags: ["users"],
      transformResponse: (response) => response,
    }),

    getUser: builder.query({
      query: (id) => `user/av/users/view/${id}`,
      providesTags: ["user"],
      transformResponse: (response) => response,
    }),
    getDash: builder.query({
      query: () => `data/stats`,
      providesTags: ["dash"],
      transformResponse: (response) => response,
    }),
    getTransaction: builder.query({
      query: ({ page }) => `transaction?page=${page}&limit=10`,
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
      query: ({ page }) => `private?page=${page}&limit=10`,
      providesTags: ["privatedeal"],
      transformResponse: (response) => response.data,
    }),
    getAllPrivateBuyDeal: builder.query({
      query: ({ page }) => `private/buy-now?page=${page}&limit=10`,
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
    activatePrivateDeal: builder.mutation({
      query: ({ id }) => ({
        url: `private/deals-activate/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["privatedeal"],
    }),
    deactivatePrivateDeal: builder.mutation({
      query: ({ id }) => ({
        url: `private/deals/deactivate/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["privatedeal"],
    }),

    // deal side
    getAllDeal: builder.query({
      query: ({ page, status, search }) =>
        `deals?page=${page}&limit=10${status && `&status=${status}`}${
          search && `&search=${search}`
        }`,
      providesTags: ["deal"],
      transformResponse: (response) => response,
    }),
    getAllDealPrivate: builder.query({
      query: ({ page, status, search }) =>
        `deals/buy-now?page=${page}&limit=10${status && `&status=${status}`}${
          search && `&search=${search}`
        }`,
      providesTags: ["deal"],
      transformResponse: (response) => response,
    }),
    approveDeal: builder.mutation({
      query: ({ credentials, id }) => ({
        url: `deals/deals?id=${id}`,
        method: "PUT",
        body: credentials,
      }),
      invalidatesTags: ["deal"],
    }),
    // rejectDeal: builder.mutation({
    //   query: ({ id }) => ({
    //     url: `deals/deals/decline/${id}`,
    //     method: "PUT",
    //   }),
    //   invalidatesTags: ["deal"],
    // }),

    getOneDeal: builder.query({
      query: (id) => `deals/single-deal/${id}`,
      providesTags: ["deal"],
      transformResponse: (response) => response.data,
    }),
    getAudit: builder.query({
      query: ({ page }) => `user/audits/all?page=${page}&limit=10`,
      providesTags: ["audit"],
      transformResponse: (response) => response,
    }),
    // user sellings
    getSelling: builder.query({
      query: (id) => `product/get-products?user=${id}`,
      providesTags: ["selling"],
      transformResponse: (response) => response,
    }),
    getSellingStat: builder.query({
      query: (id) => `product/stats?user=${id}`,
      providesTags: ["selling"],
      transformResponse: (response) => response,
    }),
    getAuctionStat: builder.query({
      query: (id) => `bids/stats?user=${id}`,
      providesTags: ["auction"],
      transformResponse: (response) => response,
    }),
    // private vendor
    getAllPrivateVendor: builder.query({
      query: ({ page }) => `vendors?page=${page}&limit=10`,
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
    deleteCategory: builder.mutation({
      query: ({ id }) => ({
        url: `categories/category-delete/${id}`,
        method: "DELETE",
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
        invalidatesTags: ["admins"],
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
  useGetDashQuery,
  useLoginnormalMutation,
  useGetSellingQuery,
  useGetSellingStatQuery,
  useGetAuctionStatQuery,
  useDeleteCategoryMutation,
  useUpdateBatchMutation,
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
  // useRejectDealMutation,
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
  useGetAuditQuery,
  useSendChatMutation,
  useGetWalletQuery,
  useGetUserDealQuery,
  useGetUserTransQuery,
  useUpdateMutation,
  useUpdatePasswordMutation,
  useActivatePrivateDealMutation,
} = authApi;
