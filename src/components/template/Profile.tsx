import { useState } from "react";

// TODO: change logo to profile picture placeholder
// Profile picture is not part of sprint 2, we can use a person-like placeholder
// like how Windows does it
import logo from "@/assets/logo.png";
import { Menu, MenuItem } from "@mui/material";
import { useAuthStore } from "@/stores/useAuthStore";

const Profile = () => {
  const signOut = useAuthStore((state) => state.signOut);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    handleClose();
    signOut();
  };

  return (
    <>
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
        <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
      </Menu>
    </>
  );
};

export default Profile;
