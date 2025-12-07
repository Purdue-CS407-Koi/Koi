import { useQuery, useMutation } from "@tanstack/react-query";

import { fetchNotificationsApi, insertNewNotificationApi, deleteAllNotificationsApi, markNotificationAsReadApi } from "@/api/notifications";

const useNotifications = () => {
    const {
        data: notificationsData, isLoading, error
    } = useQuery({
        queryKey: ["notifications"],
        queryFn: fetchNotificationsApi,
    });

    const insertMutation = useMutation({
        mutationFn: insertNewNotificationApi,
        onError: (err) => {
            console.log("error sending new notification: " + JSON.stringify(err));
        },
    });

    const insertNewNotification = (notification: { receiverId: string; groupId: string; expenseId: string; amount: number; isSplit: boolean }) => {
        insertMutation.mutate(notification);
    };

    const deleteMutation = useMutation({
        mutationFn: deleteAllNotificationsApi,
        onError: (err) => {
            console.log("error deleting all notifications: " + JSON.stringify(err));
        },
    });

    const deleteAllNotifications = () => {
        deleteMutation.mutate();
    };

    const markAsReadMutation = useMutation({
        mutationFn: markNotificationAsReadApi,
        onError: (err) => {
            console.log("error marking notification as read: " + JSON.stringify(err));
        },
    });

    const markNotificationsAsRead = () => {
        markAsReadMutation.mutate();
    }

    return { notificationsData, isLoading, error, insertNewNotification, deleteAllNotifications, markNotificationsAsRead };
}

export default useNotifications;