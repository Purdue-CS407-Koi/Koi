import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useState, useEffect } from "react";

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
  user: {
    name: string | null;
    email: string | null;
  } | null;
  onSave: (updatedEmail: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  open,
  onClose,
  user,
  onSave,
}) => {
  const [email, setEmail] = useState(user?.email || "");

  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user]);

  const handleSave = () => {
    onSave(email.trim());
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
          <p className="text-sm text-gray-500 mb-1">Email</p>
          <TextField
            fullWidth
            size="small"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
