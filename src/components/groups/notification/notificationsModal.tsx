import { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";

import useNotifications from "@/hooks/useNotifications";
import { NotificationDetailModal } from "./notificationDetailModal";

export const NotificationsModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [notification, setNotification] = useState<{
    expenseName: string,
    expenseAmount: number,
    payerName: string | null,
    groupName: string,
    created: string,
    amount: number | null,
    created_at: string,
    expense_id: string,
    group_id: string,
    id: number,
    is_split: boolean,
    payer_id: string,
    receiver_id: string,
    seen: boolean,
    } | null>
    (null);

  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const { notificationsData, markNotificationsAsRead, deleteAllNotifications } = useNotifications();

  const handleSubmit = () => {
    deleteAllNotifications();
  };

  const handleClose = () => {
    markNotificationsAsRead();
    onClose();
  };
  

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Notifications</DialogTitle>
      <DialogContent>
        {notificationsData?.length === 0 ? (
          <div className="m-4">
            No new notifications.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {notificationsData?.map((notification) => {
              if (notification.is_split) {
                return (
                  <div className="p-2 cursor-pointer hover:bg-gray-200 border-b border-divider leading-tight" onClick={() => {
                    setNotification(notification);
                    setDetailModalOpen(true);
                  }}>
                    {notification.payerName} paid for your group, {notification.groupName}. You owe them ${(notification.amount ?? 0).toFixed(2)}.
                  </div>
                );
              } else {
                return (
                  <div className="p-2 cursor-pointer hover:bg-gray-200 border-b border-divider leading-tight" onClick={() => {
                    setNotification(notification);
                    setDetailModalOpen(true);
                  }}>
                    {notification.payerName} paid you back ${(notification.amount ?? 0).toFixed(2)} in your group, {notification.groupName}.
                  </div>
                );
              }
            }
          )}
          </div>
        )}
      </DialogContent>

      <DialogActions>
        <Button
          onClick={() => {
            handleClose();
          }}
          className={`
            !text-[var(--color-text-primary)] !pl-3
          `}
        >
          Close
        </Button>
        <Button
          onClick={handleSubmit}
          className={`
            !text-[var(--color-text-primary)] !bg-[var(--color-primary-container)] !pl-3
            hover:!bg-[var(--color-button-hover)] hover:!text-white
          `}
        >
          Delete All Notifications
        </Button>
      </DialogActions>
      <NotificationDetailModal open={detailModalOpen} onClose={() => setDetailModalOpen(false)} notification={notification} />
    </Dialog>
  );
}