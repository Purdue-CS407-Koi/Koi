import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";

export const NotificationDetailModal = ({
  open,
  onClose,
  notification
}: {
  open: boolean;
  onClose: () => void;
  notification: {
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
    } | null;
}) => {

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Notification Details</DialogTitle>
      <DialogContent dividers>
        {notification?.is_split ?
          <div className="leading-normal flex flex-col mb-5 text-[var(--color-text-primary)] mr-16">
            <div className="text-2xl">
              Group: {notification?.groupName}
            </div>

            <div className="text-lg">
              Expense: {notification?.expenseName} 
            </div>
          
            <div className="mt-4 text-xl">
              {notification?.payerName} paid ${notification?.expenseAmount.toFixed(2)}
            </div>
            <div className="text-sm text-gray-400">
              on {new Date(notification?.created_at ?? "").toLocaleDateString()}.
            </div>
            <div>
              You now owe ${(notification?.amount ?? 0).toFixed(2)}.
            </div>
          </div>
          :
          <div className="leading-normal flex flex-col mb-5 text-[var(--color-text-primary)] mr-16">
            <div className="text-2xl">
              Group: {notification?.groupName}
            </div>

            <div className="text-lg">
              Expense: {notification?.expenseName} 
            </div>
          
            <div className="mt-4 text-xl">
              You originally paid ${notification?.expenseAmount.toFixed(2)}
            </div>
            <div className="text-sm text-gray-400">
              on {new Date(notification?.created_at ?? "").toLocaleDateString()}.
            </div>
            <div>
              {notification?.payerName} paid you back ${(notification?.amount ?? 0).toFixed(2)}.
            </div>
          </div>
        }
      </DialogContent>
    </Dialog>
  );
}