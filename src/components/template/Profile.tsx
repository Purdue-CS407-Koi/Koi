import { useState } from "react";
import logo from "@/assets/logo.png";
import { Menu, MenuItem, Snackbar, Alert } from "@mui/material";
import { useAuthStore } from "@/stores/useAuthStore";
import { ProfileModal } from "./ProfileModal";
import { InvitesModal } from "../groups/invite/invitesModal";
import supabase from "@/helpers/supabase";

const Profile = () => {
  const signOut = useAuthStore((state) => state.signOut);
  const supabaseUser = useAuthStore((state) => state.user);

  const user = supabaseUser
    ? {
        name: supabaseUser.user_metadata?.display_name ?? null,
        email: supabaseUser.email ?? null,
      }
    : null;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [invitesOpen, setInvitesOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const open = Boolean(anchorEl);

  const handleClose = () => setAnchorEl(null);

  const handleSignOut = () => {
    handleClose();
    signOut();
  };

  const handleViewProfile = () => {
    handleClose();
    setProfileOpen(true);
  };
  const handleViewInvites = () => {
    handleClose();
    setInvitesOpen(true);
  };
  const handleSaveProfile = async (updatedEmail: string) => {
    if (!updatedEmail || !supabaseUser) return;

    const { error } = await supabase.auth.updateUser({
      email: updatedEmail,
    });

    if (error) {
      console.error("Error updating email:", error.message);
      setSnackbar({
        open: true,
        message: `Failed to update email: ${error.message}`,
        severity: "error",
      });
    } else {
      setSnackbar({
        open: true,
        message:
          "Email update request sent. Check your inbox to confirm the change.",
        severity: "success",
      });
    }
  };

  return (
    <>
      {/* Profile Avatar */}
      <div
        className="cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          setAnchorEl(e.currentTarget);
        }}
      >
        <img
          className="inline w-9 h-9 rounded-full bg-white"
          src={logo}
          alt="Profile picture of user"
        />
      </div>

      {/* Menu */}
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            "aria-labelledby": "basic-button",
          },
        }}
      >
        <MenuItem onClick={handleViewProfile}>View Profile</MenuItem>
        <MenuItem onClick={handleViewInvites}>Invites</MenuItem>
        <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
      </Menu>

      {/* Modal */}
      <ProfileModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        user={user}
        onSave={handleSaveProfile}
      />
      <InvitesModal open={invitesOpen} onClose={() => setInvitesOpen(false)} />
      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Profile;
