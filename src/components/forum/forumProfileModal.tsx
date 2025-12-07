import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import useUsers from "@/hooks/useUsers";

export const ForumProfileModal = ({
  open,
  onClose,
  userId
}: {
  open: boolean;
  onClose: () => void;
  userId: string | null;
}) => {

  const handleClose = () => {
	  onClose();
  };

  const { userProfileData, isProfileLoading } = useUsers(userId);

  if (isProfileLoading) {
    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Loading...</DialogTitle>
      </Dialog>
    );
  }

  if (userProfileData === null) {
    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>User Profile</DialogTitle>
        <DialogContent>
        <div className="leading-normal flex flex-col mb-5 text-[var(--color-text-primary)] mr-16">
          <div className="text-2xl">
            This user's profile is not public.
          </div>
        </div>
      </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>User Profile</DialogTitle>
      <DialogContent>
        <div className="leading-normal flex flex-col mb-5 text-[var(--color-text-primary)] mr-16">
          <div className="text-2xl">
            {userProfileData?.name}
          </div>

          <div className="text-lg">
            Member since {new Date(userProfileData?.created_at ?? "").toLocaleDateString()}
          </div>
          
          <div className="mt-4 text-xl">
            {userProfileData?.about_me || "This user has not added an about me section yet."}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}