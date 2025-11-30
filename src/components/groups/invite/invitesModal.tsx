// import { useState } from "react";
// import {
//   Modal,
//   Box,
//   Typography,
//   Button,
//   CircularProgress,
//   Stack,
// } from "@mui/material";
// import useGroups from "@/hooks/useGroups";

// export const InvitesModal = ({
//   open,
//   onClose,
// }: {
//   open: boolean;
//   onClose: () => void;
// }) => {
//   const {
//     pendingInvites,
//     acceptGroupInvite,
//     declineGroupInvite,
//     refetchPendingInvites,
//   } = useGroups();

//   const [actionLoading, setActionLoading] = useState<string | null>(null);

//   const handleAccept = async (inviteId: string) => {
//     setActionLoading(inviteId);
//     try {
//       await acceptGroupInvite(inviteId);
//       await refetchPendingInvites();
//     } catch (err) {
//       console.error("Error accepting invite:", err);
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   const handleDecline = async (inviteId: string) => {
//     setActionLoading(inviteId);
//     try {
//       await declineGroupInvite(inviteId);
//       await refetchPendingInvites();
//     } catch (err) {
//       console.error("Error declining invite:", err);
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   const loading = !pendingInvites; // Will be undefined initially
//   const invites = pendingInvites ?? [];

//   return (
//     <Modal open={open} onClose={onClose}>
//       <Box
//         sx={{
//           bgcolor: "background.paper",
//           p: 4,
//           borderRadius: 2,
//           width: 400,
//           mx: "auto",
//           mt: "20vh",
//           boxShadow: 24,
//         }}
//       >
//         <Typography variant="h6" gutterBottom>
//           Pending Invites
//         </Typography>

//         {loading ? (
//           <Stack alignItems="center" sx={{ mt: 3 }}>
//             <CircularProgress />
//           </Stack>
//         ) : invites.length === 0 ? (
//           <Typography>No pending invites.</Typography>
//         ) : (
//           <Stack spacing={2}>
//             {invites.map((invite: any) => (
//               <Box
//                 key={invite.id}
//                 sx={{
//                   p: 2,
//                   border: "1px solid #ddd",
//                   borderRadius: 2,
//                 }}
//               >
//                 <Typography>
//                   <strong>Group:</strong> {invite.Groups?.name ?? "Unknown"}
//                 </Typography>
//                 <Stack direction="row" spacing={1} mt={1}>
//                   <Button
//                     variant="contained"
//                     size="small"
//                     color="success"
//                     disabled={actionLoading === invite.id}
//                     onClick={() => handleAccept(invite.id)}
//                   >
//                     {actionLoading === invite.id ? "..." : "Accept"}
//                   </Button>
//                   <Button
//                     variant="outlined"
//                     size="small"
//                     color="error"
//                     disabled={actionLoading === invite.id}
//                     onClick={() => handleDecline(invite.id)}
//                   >
//                     {actionLoading === invite.id ? "..." : "Decline"}
//                   </Button>
//                 </Stack>
//               </Box>
//             ))}
//           </Stack>
//         )}
//       </Box>
//     </Modal>
//   );
// };

import { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  CircularProgress,
  Stack,
  Divider,
} from "@mui/material";
import useGroups from "@/hooks/useGroups";
import useUserChallenges from "@/hooks/useChallenges";

export const InvitesModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const {
    pendingInvites,
    acceptGroupInvite,
    declineGroupInvite,
    refetchPendingInvites,
  } = useGroups();

  const {
    pendingChallengeInvites,
    acceptChallengeInvite,
    declineChallengeInvite,
    refetchPendingChallengeInvites,
  } = useUserChallenges();

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Handle actions
  const handleAccept = async (inviteId: string, type: "group" | "challenge") => {
    setActionLoading(inviteId);
    try {
      if (type === "group") {
        await acceptGroupInvite(inviteId);
        await refetchPendingInvites();
      } else {
        await acceptChallengeInvite(inviteId);
        await refetchPendingChallengeInvites();
      }
    } catch (err) {
      console.error("Error accepting invite:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDecline = async (inviteId: string, type: "group" | "challenge") => {
    setActionLoading(inviteId);
    try {
      if (type === "group") {
        await declineGroupInvite(inviteId);
        await refetchPendingInvites();
      } else {
        await declineChallengeInvite(inviteId);
        await refetchPendingChallengeInvites();
      }
    } catch (err) {
      console.error("Error declining invite:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const loading = !pendingInvites || !pendingChallengeInvites;

  const groupInvites = pendingInvites ?? [];
  const challengeInvites = pendingChallengeInvites ?? [];

  const hasInvites = groupInvites.length > 0 || challengeInvites.length > 0;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          bgcolor: "background.paper",
          p: 4,
          borderRadius: 2,
          width: 420,
          mx: "auto",
          mt: "20vh",
          boxShadow: 24,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Pending Invites
        </Typography>

        {loading ? (
          <Stack alignItems="center" sx={{ mt: 3 }}>
            <CircularProgress />
          </Stack>
        ) : !hasInvites ? (
          <Typography>No pending invites.</Typography>
        ) : (
          <Stack spacing={3}>
            {groupInvites.length > 0 && (
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Group Invites
                </Typography>
                <Stack spacing={2}>
                  {groupInvites.map((invite: any) => (
                    <Box
                      key={invite.id}
                      sx={{
                        p: 2,
                        border: "1px solid #ddd",
                        borderRadius: 2,
                      }}
                    >
                      <Typography>
                        <strong>Group:</strong> {invite.Groups?.name ?? "Unknown"}
                      </Typography>
                      <Stack direction="row" spacing={1} mt={1}>
                        <Button
                          variant="contained"
                          size="small"
                          color="success"
                          disabled={actionLoading === invite.id}
                          onClick={() => handleAccept(invite.id, "group")}
                        >
                          {actionLoading === invite.id ? "..." : "Accept"}
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          disabled={actionLoading === invite.id}
                          onClick={() => handleDecline(invite.id, "group")}
                        >
                          {actionLoading === invite.id ? "..." : "Decline"}
                        </Button>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}

            {groupInvites.length > 0 && challengeInvites.length > 0 && <Divider />}

            {challengeInvites.length > 0 && (
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Challenge Invites
                </Typography>
                <Stack spacing={2}>
                  {challengeInvites.map((invite: any) => (
                    <Box
                      key={invite.id}
                      sx={{
                        p: 2,
                        border: "1px solid #ddd",
                        borderRadius: 2,
                      }}
                    >
                      <Typography>
                        <strong>Challenge:</strong>{" "}
                        {invite.Challenges?.name ?? "Unknown"}
                      </Typography>
                      <Stack direction="row" spacing={1} mt={1}>
                        <Button
                          variant="contained"
                          size="small"
                          color="success"
                          disabled={actionLoading === invite.id}
                          onClick={() => handleAccept(invite.id, "challenge")}
                        >
                          {actionLoading === invite.id ? "..." : "Accept"}
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          disabled={actionLoading === invite.id}
                          onClick={() => handleDecline(invite.id, "challenge")}
                        >
                          {actionLoading === invite.id ? "..." : "Decline"}
                        </Button>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}
          </Stack>
        )}
      </Box>
    </Modal>
  );
};
