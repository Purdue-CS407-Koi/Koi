// // import { useState } from "react";
// // import { ThumbUpAltOutlined, ThumbUpAlt, MoreVert, Edit, Delete } from "@mui/icons-material";

// // export interface ForumPost {
// //   id: string;
// //   desc: string | null;
// //   likes: number | null;
// //   privacy: number | null;
// //   user_id: string | null;
// //   created_at: string;
// //   Users?: { name?: string | null } | null;
// //   liked?: boolean;
// // }

// // interface ForumListProps {
// //   posts: ForumPost[];
// //   loading: boolean;
// //   currentUserId?: string; // Add current user ID to check ownership
// //   onToggleLike: (postId: string, liked: boolean) => void;
// //   onDelete: (postId: string) => void;
// //   onEdit: (postId: string, desc: string, privacy: number) => void;
// // }

// // export const ForumList: React.FC<ForumListProps> = ({
// //   posts,
// //   loading,
// //   currentUserId,
// //   onToggleLike,
// //   onDelete,
// //   onEdit,
// // }) => {
// //   const [editingPostId, setEditingPostId] = useState<string | null>(null);
// //   const [editDesc, setEditDesc] = useState("");
// //   const [menuOpen, setMenuOpen] = useState<string | null>(null);

// //   if (loading)
// //     return (
// //       <div className="flex justify-center mt-10 text-gray-500">
// //         Loading posts...
// //       </div>
// //     );

// //   if (!posts?.length)
// //     return (
// //       <div className="flex justify-center mt-10 text-gray-500">
// //         No posts yet. Be the first to share something!
// //       </div>
// //     );

// //   const handleEdit = (post: ForumPost) => {
// //     setEditingPostId(post.id);
// //     setEditDesc(post.desc ?? "");
// //     setMenuOpen(null);
// //   };

// //   const handleSaveEdit = (post: ForumPost) => {
// //     if (editDesc.trim()) {
// //       onEdit(post.id, editDesc, post.privacy ?? 0);
// //       setEditingPostId(null);
// //       setEditDesc("");
// //     }
// //   };

// //   const handleCancelEdit = () => {
// //     setEditingPostId(null);
// //     setEditDesc("");
// //   };

// //   const handleDelete = (postId: string) => {
// //     if (window.confirm("Are you sure you want to delete this post?")) {
// //       onDelete(postId);
// //       setMenuOpen(null);
// //     }
// //   };

// //   return (
// //     <div className="flex flex-col gap-4">
// //       {posts.map((post) => {
// //         const isOwner = currentUserId && post.user_id === currentUserId;
// //         const isEditing = editingPostId === post.id;

// //         return (
// //           <div
// //             key={post.id}
// //             className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition"
// //           >
// //             {/* Header */}
// //             <div className="flex justify-between items-center mb-1">
// //               <h4 className="font-semibold text-gray-800">
// //                 {post.Users?.name ?? "Anonymous"}
// //               </h4>
// //               <div className="flex items-center gap-2">
// //                 <span className="text-xs text-gray-400">
// //                   {new Date(post.created_at).toLocaleString()}
// //                 </span>
                
// //                 {/* Menu button - only show if user owns the post */}
// //                 {isOwner && (
// //                   <div className="relative">
// //                     <button
// //                       onClick={() => setMenuOpen(menuOpen === post.id ? null : post.id)}
// //                       className="p-1 hover:bg-gray-100 rounded-full transition"
// //                     >
// //                       <MoreVert fontSize="small" className="text-gray-500" />
// //                     </button>
                    
// //                     {/* Dropdown menu */}
// //                     {menuOpen === post.id && (
// //                       <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
// //                         <button
// //                           onClick={() => handleEdit(post)}
// //                           className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
// //                         >
// //                           <Edit fontSize="small" />
// //                           Edit
// //                         </button>
// //                         <button
// //                           onClick={() => handleDelete(post.id)}
// //                           className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
// //                         >
// //                           <Delete fontSize="small" />
// //                           Delete
// //                         </button>
// //                       </div>
// //                     )}
// //                   </div>
// //                 )}
// //               </div>
// //             </div>

// //             {/* Description - editable if in edit mode */}
// //             {isEditing ? (
// //               <div className="mt-2">
// //                 <textarea
// //                   value={editDesc}
// //                   onChange={(e) => setEditDesc(e.target.value)}
// //                   className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                   rows={3}
// //                   autoFocus
// //                 />
// //                 <div className="flex gap-2 mt-2">
// //                   <button
// //                     onClick={() => handleSaveEdit(post)}
// //                     className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
// //                   >
// //                     Save
// //                   </button>
// //                   <button
// //                     onClick={handleCancelEdit}
// //                     className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
// //                   >
// //                     Cancel
// //                   </button>
// //                 </div>
// //               </div>
// //             ) : (
// //               <p className="text-gray-700 mt-2">{post.desc ?? "No description"}</p>
// //             )}

// //             {/* Likes */}
// //             <div
// //               className="flex items-center gap-1 mt-3 text-gray-500 text-sm cursor-pointer hover:text-blue-600 transition w-fit"
// //               onClick={() => onToggleLike(post.id, !!post.liked)}
// //             >
// //               {post.liked ? (
// //                 <ThumbUpAlt fontSize="small" />
// //               ) : (
// //                 <ThumbUpAltOutlined fontSize="small" />
// //               )}
// //               <span>{post.likes ?? 0}</span>
// //             </div>
// //           </div>
// //         );
// //       })}
// //     </div>
// //   );
// // };
// import { useState } from "react";
// import { ThumbUpAltOutlined, ThumbUpAlt } from "@mui/icons-material";
// import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import { EditPostModal } from "./editPostModal";
// import { DeletePostModal } from "./deletePostModal";

// export interface ForumPost {
//   id: string;
//   desc: string | null;
//   likes: number | null;
//   privacy: number | null;
//   user_id: string | null;
//   created_at: string;
//   Users?: { name?: string | null } | null;
//   liked?: boolean;
// }

// interface ForumListProps {
//   posts: ForumPost[];
//   loading: boolean;
//   currentUserId?: string;
//   onToggleLike: (postId: string, liked: boolean) => void;
//   onDelete: (postId: string) => void;
//   onEdit: (postId: string, desc: string, privacy: number) => void;
// }

// interface PostMoreActionsProps {
//   post: ForumPost;
//   onEdit: (postId: string, desc: string, privacy: number) => void;
//   onDelete: (postId: string) => void;
// }

// const PostMoreActions: React.FC<PostMoreActionsProps> = ({
//   post,
//   onEdit,
//   onDelete,
// }) => {
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);

//   const open = Boolean(anchorEl);

//   const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
//     event.stopPropagation();
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => setAnchorEl(null);

//   const handleEdit = () => {
//     handleMenuClose();
//     setEditModalOpen(true);
//   };

//   const handleDelete = () => {
//     handleMenuClose();
//     setDeleteModalOpen(true);
//   };

//   return (
//     <div
//       onClick={(e) => {
//         e.stopPropagation();
//       }}
//     >
//       <Tooltip title="More actions">
//         <IconButton size="small" onClick={handleMenuOpen}>
//           <MoreVertIcon fontSize="small" />
//         </IconButton>
//       </Tooltip>

//       <Menu
//         anchorEl={anchorEl}
//         open={open}
//         onClose={handleMenuClose}
//         slotProps={{
//           paper: { sx: { minWidth: 120 } },
//         }}
//       >
//         <MenuItem onClick={handleEdit}>Edit Post</MenuItem>
//         <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
//           Delete Post
//         </MenuItem>
//       </Menu>

//       {editModalOpen && (
//         <EditPostModal
//           open={editModalOpen}
//           onClose={() => setEditModalOpen(false)}
//           postId={post.id}
//           currentDesc={post.desc ?? ""}
//           currentPrivacy={post.privacy ?? 0}
//           onEdit={onEdit}
//         />
//       )}

//       {deleteModalOpen && (
//         <DeletePostModal
//           open={deleteModalOpen}
//           onClose={() => setDeleteModalOpen(false)}
//           postId={post.id}
//           onDelete={onDelete}
//         />
//       )}
//     </div>
//   );
// };

// export const ForumList: React.FC<ForumListProps> = ({
//   posts,
//   loading,
//   currentUserId,
//   onToggleLike,
//   onDelete,
//   onEdit,
// }) => {
//   const [profileModalOpen, setProfileModalOpen] = useState(false);
//   const [selectedUser, setSelectedUser] = useState<{name: string, id: string} | null>(null);

//   const openProfileModal = (name: string, userId: string) => {
//     setSelectedUser({name: name, id: userId});
//     setProfileModalOpen(true);
//   };

//   const closeProfileModal = () => {
//     setProfileModalOpen(false);
//     setSelectedUser(null);
//   };

//   console.log(posts);

//   if (loading)
//     return (
//       <div className="flex justify-center mt-10 text-gray-500">
//         Loading posts...
//       </div>
//     );

//   if (!posts?.length)
//     return (
//       <div className="flex justify-center mt-10 text-gray-500">
//         No posts yet. Be the first to share something!
//       </div>
//     );

//   return (
//     <div className="flex flex-col gap-4">
//       {posts.map((post) => {
//         const isOwner = currentUserId && post.user_id === currentUserId;

//         return (
//           <div
//             key={post.id}
//             className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition"
//           >
//             {/* Header */}
//             <div className="flex justify-between items-center mb-1">
//               <h4 className="font-semibold text-gray-800">
//                 {post.Users?.name ?? "Anonymous"}
//               </h4>
//               <div className="flex items-center gap-2">
//                 <span className="text-xs text-gray-400">
//                   {new Date(post.created_at).toLocaleString()}
//                 </span>

//                 {/* Menu button - only show if user owns the post */}
//                 {isOwner && (
//                   <PostMoreActions
//                     post={post}
//                     onEdit={onEdit}
//                     onDelete={onDelete}
//                   />
//                 )}
//               </div>
//             </div>

//             {/* Description */}
//             <p className="text-gray-700 mt-2">{post.desc ?? "No description"}</p>

//             {/* Likes */}
//             <div
//               className="flex items-center gap-1 mt-3 text-gray-500 text-sm cursor-pointer hover:text-blue-600 transition w-fit"
//               onClick={() => onToggleLike(post.id, !!post.liked)}
//             >
//               {post.liked ? (
//                 <ThumbUpAlt fontSize="small" />
//               ) : (
//                 <ThumbUpAltOutlined fontSize="small" />
//               )}
//               <span>{post.likes ?? 0}</span>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };
import { useState } from "react";
import { ThumbUpAltOutlined, ThumbUpAlt } from "@mui/icons-material";
import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { EditPostModal } from "./editPostModal";
import { DeletePostModal } from "./deletePostModal";

export interface ForumPost {
  id: string;
  desc: string | null;
  likes: number | null;
  privacy: number | null;
  user_id: string | null;
  created_at: string;
  Users?: { name?: string | null } | null;
  liked?: boolean;
}

interface ForumListProps {
  posts: ForumPost[];
  loading: boolean;
  currentUserId?: string;
  onToggleLike: (postId: string, liked: boolean) => void;
  onDelete: (postId: string) => void;
  onEdit: (postId: string, desc: string, privacy: number) => void;
}

interface PostMoreActionsProps {
  post: ForumPost;
  onEdit: (postId: string, desc: string, privacy: number) => void;
  onDelete: (postId: string) => void;
}

const PostMoreActions: React.FC<PostMoreActionsProps> = ({
  post,
  onEdit,
  onDelete,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleEdit = () => {
    handleMenuClose();
    setEditModalOpen(true);
  };

  const handleDelete = () => {
    handleMenuClose();
    setDeleteModalOpen(true);
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Tooltip title="More actions">
        <IconButton size="small" onClick={handleMenuOpen}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        slotProps={{
          paper: { sx: { minWidth: 120 } },
        }}
      >
        <MenuItem onClick={handleEdit}>Edit Post</MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          Delete Post
        </MenuItem>
      </Menu>

      {editModalOpen && (
        <EditPostModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          postId={post.id}
          currentDesc={post.desc ?? ""}
          currentPrivacy={post.privacy ?? 0}
          onEdit={onEdit}
        />
      )}

      {deleteModalOpen && (
        <DeletePostModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          postId={post.id}
          onDelete={onDelete}
        />
      )}
    </div>
  );
};

export const ForumList: React.FC<ForumListProps> = ({
  posts,
  loading,
  currentUserId,
  onToggleLike,
  onDelete,
  onEdit,
}) => {
  if (loading)
    return (
      <div className="flex justify-center mt-10 text-gray-500">
        Loading posts...
      </div>
    );

  if (!posts?.length)
    return (
      <div className="flex justify-center mt-10 text-gray-500">
        No posts yet. Be the first to share something!
      </div>
    );

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => {
        const isOwner = currentUserId && post.user_id === currentUserId;

        return (
          <div
            key={post.id}
            className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-1">
              <h4 className="font-semibold text-gray-800">
                {post.Users?.name ?? "Anonymous"}
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">
                  {new Date(post.created_at).toLocaleString()}
                </span>

                {/* Menu button - only show if user owns the post */}
                {isOwner && (
                  <PostMoreActions
                    post={post}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-700 mt-2">{post.desc ?? "No description"}</p>

            {/* Likes */}
            <div
              className="flex items-center gap-1 mt-3 text-gray-500 text-sm cursor-pointer hover:text-blue-600 transition w-fit"
              onClick={() => onToggleLike(post.id, !!post.liked)}
            >
              {post.liked ? (
                <ThumbUpAlt fontSize="small" />
              ) : (
                <ThumbUpAltOutlined fontSize="small" />
              )}
              <span>{post.likes ?? 0}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};