import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Switch
} from "@mui/material";
import { useState, useEffect } from "react";

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
  user: {
    name: string | null;
    email: string | null;
    notification: boolean;
    aboutMe: string;
    username: string;
    isPublic: boolean;
  } | null;
  onSave: (updatedEmail: string, notifications: boolean, aboutMe: string, username: string, isPublic: boolean) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  open,
  onClose,
  user,
  onSave,
}) => {
  const [username, setUsername] = useState(user?.username || "");
  const [aboutMe, setAboutMe] = useState(user?.aboutMe || "");

  const [email, setEmail] = useState(user?.email || "");
  const [notifications, setNotifications] = useState<boolean>(user?.notification || true);
  const [isPublic, setPublic] = useState<boolean>(user?.notification || true);


  useEffect(() => {
    if (user?.email) setEmail(user.email);
    if (user?.notification) setNotifications(user.notification);
    if (user?.aboutMe) setAboutMe(user.aboutMe);
    if (user?.username) setUsername(user.username);
    if (user?.isPublic) setPublic(user.isPublic);
  }, [user]);

  const handleSave = () => {
    onSave(email.trim(), notifications, aboutMe, username, isPublic);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className="text-lg font-semibold text-gray-800">
        Profile Details
      </DialogTitle>

      <DialogContent className="flex flex-col gap-4 mt-2">
        <div>
          <p className="text-sm text-gray-500 mb-1">Name</p>
          <p className="text-base font-medium">
            {user?.name || "Unnamed User"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">Username</p>
          <TextField
            fullWidth
            size="small"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Create a username"
          />
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">Email</p>
          <TextField
            fullWidth
            size="small"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">Notifications</p>
          <Switch
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
          />
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">Allow profile to be seen by anyone?</p>
          <Switch
            checked={isPublic}
            onChange={() => setPublic(!isPublic)}
          />
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">About Me</p>
          <TextField
            fullWidth
            size="small"
            multiline
            rows={4}
            value={aboutMe}
            onChange={(e) => setAboutMe(e.target.value)}
            placeholder="Tell us about yourself..."
          />
        </div>
      </DialogContent>

      <DialogActions className="px-6 pb-3">
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
// } from "@mui/material";
// import { useState, useEffect } from "react";
// import supabase from "@/helpers/supabase";

// interface ProfileModalProps {
//   open: boolean;
//   onClose: () => void;
//   onSave: (updatedEmail: string) => void;
// }

// export const ProfileModal: React.FC<ProfileModalProps> = ({
//   open,
//   onClose,
//   user,
//   onSave,
// }) => {
//   const [name, setName] = useState<string>("Unnamed User");
//   const [email, setEmail] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(true);

//   // Fetch the current Supabase user
//   useEffect(() => {
//     const fetchUser = async () => {
//       setLoading(true);
//       const {
//         data: { user },
//         error,
//       } = await supabase.auth.getUser();

//       if (error) {
//         console.error("Error fetching user:", error);
//       } else if (user) {
//         setEmail(user.email || "");
//         // Optionally set name if stored in user_metadata
//         setName(user.display_name || "Unnamed User");
//       }

//       setLoading(false);
//     };

//     if (open) {
//       fetchUser();
//     }
//   }, [open]);

//   const handleSave = () => {
//     onSave(email.trim());
//     onClose();
//   };

//   return (
//     <Dialog open={open} onClose={onClose}>
//       <DialogTitle className="text-lg font-semibold text-gray-800">
//         Profile Details
//       </DialogTitle>

//       <DialogContent className="flex flex-col gap-4 mt-2">
//         {loading ? (
//           <p className="text-gray-500">Loading...</p>
//         ) : (
//           <>
//             <div>
//               <p className="text-sm text-gray-500 mb-1">Name</p>
//               <p className="text-base font-medium">{name}</p>
//             </div>

//             <div>
//               <p className="text-sm text-gray-500 mb-1">Email</p>
//               <TextField
//                 fullWidth
//                 size="small"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>
//           </>
//         )}
//       </DialogContent>

//       <DialogActions className="px-6 pb-3">
//         <Button onClick={onClose}>Cancel</Button>
//         <Button variant="contained" onClick={handleSave} disabled={loading}>
//           Save
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };
