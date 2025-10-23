import { useState } from "react";
import logo from "@/assets/logo.png";
import { Menu, MenuItem } from "@mui/material";
import { useAuthStore } from "@/stores/useAuthStore";
import { ProfileModal } from "./ProfileModal";

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

  const handleSaveProfile = (updatedEmail: string) => {
    // TODO: save email change to Supabase
    console.log("Saving updated email:", updatedEmail);
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
        <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
      </Menu>

      {/* Modal */}
      <ProfileModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        user={user}
        onSave={handleSaveProfile}
      />
    </>
  );
};

export default Profile;
