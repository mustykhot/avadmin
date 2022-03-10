import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { toastr } from "react-redux-toastr";
import { logout } from "../store/slice/AuthSlice";
// import { API_ENDPOINT } from '../constants'
const API_ENDPOINT = " https://auction-backend-api.herokuapp.com/api/v1/";

const baseQuery = fetchBaseQuery({
  baseUrl: API_ENDPOINT,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.userToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
      headers.set("Access-Control-Allow-Origin", `*`);
    }
    headers.set("x-api-key", `AuctionDevKey`);
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (
    result?.error &&
    result?.error.data._meta.error.code === 401 &&
    result?.error.data._meta.error.message.includes("logged in")
  ) {
    // logout
    toastr("error", "Please login again.");
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
    "brand",
    "plan",
  ],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "auth/login/admin",
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
        url: `users/${id}`,
        method: "PUT",
        body: credentials,
      }),
      invalidatesTags: ["admins", "user", "users"],
    }),
    updateBatch: builder.mutation({
      query: ({ credentials, id }) => ({
        url: `users?id=${id}`,
        method: "PUT",
        body: credentials,
      }),
      invalidatesTags: ["admins", "user", "users"],
    }),
    updatePassword: builder.mutation({
      query: (credentials) => ({
        url: `auth/change-password`,
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
    sendChat: builder.mutation({
      query: ({ credentials, id }) => ({
        url: `/chats/conversations/${id}/send-message`,
        method: "PUT",
        body: credentials,
      }),
      invalidatesTags: ["chatmessage"],
    }),

    getConversationBtwUsers: builder.query({
      query: ({ idFirst, idSecond }) =>
        `chats/conversations/${idFirst}/${idSecond}?population=["members","sender"]`,
      providesTags: ["chatmessage"],
      transformResponse: (response) => response,
    }),
    getUserDeal: builder.query({
      query: ({ id, page }) =>
        `data/deals-histories/${id}/user/stats?page=${page}`,
      providesTags: ["deal"],
      transformResponse: (response) => response,
    }),
    // chats/conversations/me
    getConversation: builder.query({
      query: () => `chats/conversations/me?population=["members"]`,
      providesTags: ["chat"],
      transformResponse: (response) => response,
    }),
    getWallet: builder.query({
      query: (id) => `wallet/${id}?population=["user"]`,
      providesTags: ["wallet"],
      transformResponse: (response) => response,
    }),
    getUserTrans: builder.query({
      query: ({ id, page }) =>
        `data/transactions/${id}/user/stats?page=${page}`,
      providesTags: ["transaction"],
      transformResponse: (response) => response,
    }),
    getAdmins: builder.query({
      query: ({ search, page }) =>
        `users?page=${page}&search=${search}&userType=admin`,
      providesTags: ["admins"],
      transformResponse: (response) => response,
    }),
    getUsers: builder.query({
      query: ({ search, page, limit }) =>
        `users?page=${page}&search=${search}&userType=user&limit=${
          limit ? limit : 10
        }`,
      providesTags: ["users"],
      transformResponse: (response) => response,
    }),

    getUsersInChat: builder.query({
      query: ({ search, page }) =>
        `users?page=${page}&search=${search}&all=true&userType=user`,
      providesTags: ["users"],
      transformResponse: (response) => response,
    }),

    getUser: builder.query({
      query: (id) => `users/${id}`,
      providesTags: ["user"],
      transformResponse: (response) => response,
    }),
    getDash: builder.query({
      query: () => `data/stats`,
      providesTags: ["dash"],
      transformResponse: (response) => response,
    }),
    getTransaction: builder.query({
      query: ({ page, search }) =>
        `transactions/me?page=${page}&limit=10&search=${search}&population=["user"]`,
      providesTags: ["transaction"],
      transformResponse: (response) => response,
    }),
    getEachTransaction: builder.query({
      query: (id) => `transaction/single/${id}?population=["user"]`,
      providesTags: ["transaction"],
      transformResponse: (response) => response,
    }),
    getAllCategory: builder.query({
      query: (page) => `categories?page=${page}`,
      providesTags: ["category"],
      transformResponse: (response) => response,
    }),
    getAllPrivateDeal: builder.query({
      query: ({ page, search }) =>
        `deals?population=[{"path" : "user" , "select" : "firstName lastName"},"product"]&page=${page}&search=${search}&isPrivate=true&type=AUCTION`,
      providesTags: ["privatedeal"],
      transformResponse: (response) => response,
    }),
    getAllPrivateBuyDeal: builder.query({
      query: ({ page, search }) =>
        `deals?population=[{"path" : "user" , "select" : "firstName lastName"},"product"]&page=${page}&search=${search}&isPrivate=true&type=BUY_NOW`,
      providesTags: ["privatedeal"],
      transformResponse: (response) => response,
    }),
    addPrivateDeal: builder.mutation({
      query: (credentials) => ({
        url: "deals",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["privatedeal"],
    }),
    activatePrivateDeal: builder.mutation({
      query: ({ credentials, id }) => ({
        url: `deals/${id}`,
        method: "PUT",
        body: credentials,
      }),
      invalidatesTags: ["privatedeal"],
    }),

    // deal side
    getAllDeal: builder.query({
      query: ({ page, status, search }) =>
        `deals?population=["user","product"]&page=${page}&limit=10${
          status && `&status=${status}`
        }&search=${search}&type=AUCTION`,
      providesTags: ["deal"],
      transformResponse: (response) => response,
    }),
    getAllBuyDeal: builder.query({
      query: ({ page, status, search }) =>
        `deals?population=["user", "product"]&page=${page}&limit=10${
          status && `&status=${status}`
        }&search=${search}&type=BUY_NOW`,
      providesTags: ["deal"],
      transformResponse: (response) => response,
    }),
    approveDeal: builder.mutation({
      query: ({ credentials, id }) => ({
        url: `deals/${id}`,
        method: "PUT",
        body: credentials,
      }),
      invalidatesTags: ["deal"],
    }),
    approveDealBatch: builder.mutation({
      query: ({ credentials, id }) => ({
        url: `deals?id=${id}`,
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

    // sponsored
    getSponsoredDeal: builder.query({
      query: ({ page, status, search }) =>
        `deals?population=["user","product"]&page=${page}&limit=10${
          status && `&status=${status}`
        }&search=${search}&sponsored=true`,
      providesTags: ["deal"],
      transformResponse: (response) => response,
    }),

    getOneDeal: builder.query({
      query: (id) => `deals/${id}?population=["user","product"]`,
      providesTags: ["deal"],
      transformResponse: (response) => response,
    }),
    getAudit: builder.query({
      query: ({ page, search }) =>
        `/audits?page=${page}&limit=10&search=${search}`,
      providesTags: ["audit"],
      transformResponse: (response) => response,
    }),
    // user auction

    getUserAuction: builder.query({
      query: ({ id, page }) => `/data/deals/${id}/user/stats?page=${page}`,
      providesTags: ["auction"],
      transformResponse: (response) => response,
    }),

    // private vendor
    getAllPrivateVendor: builder.query({
      query: ({ page, search, limit }) =>
        `vendors?isPrivate=true&search=${search}&page=${page}&limit=${
          limit ? limit : 10
        }`,
      providesTags: ["vendor"],
      transformResponse: (response) => response,
    }),

    addVendor: builder.mutation({
      query: (credentials) => ({
        url: "vendors",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["vendor"],
    }),

    addCategory: builder.mutation({
      query: (credentials) => ({
        url: "categories",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["category"],
    }),

    editCategory: builder.mutation({
      query: ({ credentials, id }) => ({
        url: `categories/${id}`,
        method: "PUT",
        body: credentials,
      }),
      invalidatesTags: ["category"],
    }),
    activateCategory: builder.mutation({
      query: ({ credentials, id }) => ({
        url: `categories/${id}`,
        method: "PUT",
        body: credentials,
      }),
      invalidatesTags: ["category"],
    }),
    disableCategory: builder.mutation({
      query: ({ credentials, id }) => ({
        url: `categories/${id}`,
        method: "PUT",
        body: credentials,
      }),
      invalidatesTags: ["category"],
    }),
    deleteCategory: builder.mutation({
      query: ({ id }) => ({
        url: `categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["category"],
    }),
    getPlan: builder.query({
      query: (page) => `plans?page=${page}`,
      providesTags: ["plan"],
      transformResponse: (response) => response,
    }),
    addPlan: builder.mutation({
      query: (credentials) => ({
        url: "new-plan",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["plan"],
    }),
    editPlan: builder.mutation({
      query: ({ credentials, id }) => ({
        url: `plan/${id}`,
        method: "PUT",
        body: credentials,
      }),
      invalidatesTags: ["plan"],
    }),
    deletePlan: builder.mutation({
      query: ({ id }) => ({
        url: `plan/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["plan"],
    }),
    // signd: builder.mutation({
    //   query: (credentials) => ({
    //     url: "users",
    //     method: "POST",
    //     body: credentials,
    //   }),
    // }),
    addAdmin: builder.mutation({
      query: (credentials) => ({
        url: "users",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["admins"],
    }),
    resetPwd: builder.mutation({
      query: (credentials) => ({
        url: "reset",
        method: "POST",
        body: credentials,
      }),
    }),
    getBrand: builder.query({
      query: () => `resources/brands?limit=1000`,
      providesTags: ["brand"],
      transformResponse: (response) => response,
    }),
    getBrandModal: builder.query({
      query: (id) =>
        `resources/brand-models?population=[{"path" : "brand", "select": "name"}]&${
          id ? "brand=" + id : ""
        }`,
      providesTags: ["brand"],
      transformResponse: (response) => response,
    }),
  }),
});
export const {
  useLoginMutation,
  useAddPlanMutation,
  useDeletePlanMutation,
  useEditPlanMutation,
  useGetPlanQuery,
  useGetBrandModalQuery,
  useGetBrandQuery,
  useGetDashQuery,
  useLoginnormalMutation,
  useGetUserAuctionQuery,
  useApproveDealBatchMutation,
  useGetUsersInChatQuery,

  useDeleteCategoryMutation,
  useUpdateBatchMutation,
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
  useGetSponsoredDealQuery,

  useGetTransactionQuery,
  useGetEachTransactionQuery,
  useGetAllPrivateBuyDealQuery,
  useGetAllPrivateVendorQuery,
  useAddVendorMutation,
  useGetOneDealQuery,
  useGetAllBuyDealQuery,
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
