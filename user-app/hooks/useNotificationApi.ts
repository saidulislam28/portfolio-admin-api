// // hooks/api/useNotificationApi.ts

// import { Delete, Get, Put } from "@sm/common";

// // ... (your existing interfaces remain the same)

// export const useNotificationApi = () => {
//     const getNotifications = async (params: any) => {
//         const queryParams = new URLSearchParams();

//         Object.entries(params).forEach(([key, value]) => {
//             if (value !== undefined && value !== null) {
//                 queryParams.append(key, value.toString());
//             }
//         });

//         const url = `/user-notifications?${queryParams}`;
//         return Get(url);
//     };

//     const markAsRead = async (notificationIds: number[]): Promise<{ message: string; count: number }> => {
//         return Put('/user-notifications/mark-as-read', { notificationIds });
//     };

//     const deleteNotifications = async (notificationIds: number[]): Promise<{ message: string; count: number }> => {
//         // Fixed: Pass IDs as query parameter or in body based on your API
//         return Delete(`/user-notifications?ids=${notificationIds.join(',')}`);
//         // OR if your API expects body in DELETE:
//         // return DeleteWithBody('/user-notifications', { notificationIds });
//     };

//     return {
//         getNotifications,
//         markAsRead,
//         deleteNotifications,
//     };
// };