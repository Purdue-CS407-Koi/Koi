// // import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// // import {
// //   getForumPosts,
// //   insertForumPost,
// //   updateLikeCount,
// //   deleteForumPost,
// //   editForumPost
// // } from "@/api/forum";

// // const useForum = () => {
// //   const queryClient = useQueryClient();

// //   // Fetch all posts
// //   const {
// //     data: forumPosts,
// //     error,
// //     isLoading,
// //     refetch: refetchForum,
// //   } = useQuery({
// //     queryKey: ["forumPosts"],
// //     queryFn: getForumPosts,
// //   });

// //   // Create new post
// //   const insertMutation = useMutation({
// //     mutationFn: async ({
// //       desc,
// //       privacy,
// //     }: {
// //       desc: string;
// //       privacy: number;
// //     }) => await insertForumPost({desc, privacy}),
// //     onError: (err) => {
// //       console.error("Error creating post:", err);
// //     },
// //     onSuccess: () => {
// //       queryClient.invalidateQueries({ queryKey: ["forumPosts"] });
// //     },
// //   });

// //   // Like a post
// // //   const likeMutation = useMutation({
// // //     mutationFn: async (postId: string) => await updateLikeCount(postId),
// // //     onError: (err) => {
// // //       console.error("Error liking post:", err);
// // //     },
// // //     onSuccess: () => {
// // //       queryClient.invalidateQueries({ queryKey: ["forumPosts"] });
// // //     },
// // //   });
// // const likeMutation = useMutation({
// //     mutationFn: async ({
// //       postId,
// //       delta,
// //     }: {
// //       postId: string;
// //       delta: number; // +1 or -1
// //     }) => {
// //       await updateLikeCount(postId, delta);
// //     },
// //     onMutate: async ({ postId, delta }) => {
// //       // optimistic update
// //       await queryClient.cancelQueries({ queryKey: ["forumPosts"] });
// //       const prevPosts = queryClient.getQueryData<any[]>(["forumPosts"]);

// //       if (prevPosts) {
// //         queryClient.setQueryData(
// //           ["forumPosts"],
// //           prevPosts.map((p) =>
// //             p.id === postId ? { ...p, likes: Math.max(0, (p.likes ?? 0) + delta) } : p
// //           )
// //         );
// //       }

// //       return { prevPosts };
// //     },
// //     onError: (err, _, context) => {
// //       console.error("Error updating like count:", err);
// //       if (context?.prevPosts) {
// //         queryClient.setQueryData(["forumPosts"], context.prevPosts);
// //       }
// //     },
// //     onSettled: () => {
// //       queryClient.invalidateQueries({ queryKey: ["forumPosts"] });
// //     },
// //   });

// //   // Delete a post
// //   const deleteMutation = useMutation({
// //     mutationFn: async (postId: string) => await deleteForumPost(postId),
// //     onError: (err) => {
// //       console.error("Error deleting post:", err);
// //     },
// //     onSuccess: () => {
// //       queryClient.invalidateQueries({ queryKey: ["forumPosts"] });
// //     },
// //   });

// //   const editPostMutation = useMutation({
// //   mutationFn: ({ postId, desc, privacy }: { postId: string; desc: string; privacy: number }) =>
// //     editForumPost(postId, desc, privacy),
// //   onSuccess: () => queryClient.invalidateQueries({ queryKey: ["forumPosts"] }),
// //   onError: (err) => console.error("Error editing post:", err),
// // });

// // const editPost = (postId: string, desc: string, privacy: number) =>
// //   editPostMutation.mutate({ postId, desc, privacy });


// // const createPost = ({ desc, privacy }: { desc: string; privacy: number }) => {
// //   insertMutation.mutate({ desc, privacy });
// // };
// //  const toggleLike = (postId: string, liked: boolean) => {
// //     likeMutation.mutate({ postId, delta: liked ? -1 : +1 });
// //   };
// //   const removePost = (postId: string) => {
// //     deleteMutation.mutate(postId);
// //   };

// //   return {
// //     forumPosts,
// //     isLoading,
// //     error,
// //     refetchForum,
// //     createPost,
// //     toggleLike,
// //     removePost,
// //     editPost
// //   };
// // };

// // export default useForum;
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import {
//   getForumPosts,
//   insertForumPost,
//   toggleLike,
//   deleteForumPost,
//   editForumPost
// } from "@/api/forum";
// import { useAuth } from ; // Import your auth hook

// const useForum = () => {
//   const queryClient = useQueryClient();
//   const { user } = useAuth(); // Get current user from auth context
//   const currentUserId = user?.id;

//   // Fetch all posts
//   const {
//     data: forumPosts,
//     error,
//     isLoading,
//     refetch: refetchForum,
//   } = useQuery({
//     queryKey: ["forumPosts", currentUserId],
//     queryFn: () => {
//       if (!currentUserId) throw new Error("User not authenticated");
//       return getForumPosts(currentUserId);
//     },
//     enabled: !!currentUserId, // Only fetch if user is logged in
//   });

//   // Create new post
//   const insertMutation = useMutation({
//     mutationFn: async ({
//       desc,
//       privacy,
//     }: {
//       desc: string;
//       privacy: number;
//     }) => {
//       if (!currentUserId) throw new Error("User not authenticated");
//       return await insertForumPost({ desc, privacy, userId: currentUserId });
//     },
//     onError: (err) => {
//       console.error("Error creating post:", err);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["forumPosts", currentUserId] });
//     },
//   });

//   // Toggle like (new implementation with ForumLikes table)
//   const likeMutation = useMutation({
//     mutationFn: async (postId: string) => {
//       if (!currentUserId) throw new Error("User not authenticated");
//       return await toggleLike(postId, currentUserId);
//     },
//     onMutate: async (postId) => {
//       // Optimistic update
//       await queryClient.cancelQueries({ queryKey: ["forumPosts", currentUserId] });
//       const prevPosts = queryClient.getQueryData<any[]>(["forumPosts", currentUserId]);

//       if (prevPosts) {
//         queryClient.setQueryData(
//           ["forumPosts", currentUserId],
//           prevPosts.map((p) =>
//             p.id === postId
//               ? {
//                   ...p,
//                   liked: !p.liked,
//                   likes: p.liked ? Math.max(0, p.likes - 1) : p.likes + 1,
//                 }
//               : p
//           )
//         );
//       }

//       return { prevPosts };
//     },
//     onError: (err, _, context) => {
//       console.error("Error toggling like:", err);
//       if (context?.prevPosts) {
//         queryClient.setQueryData(["forumPosts", currentUserId], context.prevPosts);
//       }
//     },
//     onSettled: () => {
//       queryClient.invalidateQueries({ queryKey: ["forumPosts", currentUserId] });
//     },
//   });

//   // Delete a post
//   const deleteMutation = useMutation({
//     mutationFn: async (postId: string) => await deleteForumPost(postId),
//     onError: (err) => {
//       console.error("Error deleting post:", err);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["forumPosts", currentUserId] });
//     },
//   });

//   // Edit a post
//   const editPostMutation = useMutation({
//     mutationFn: ({ postId, desc, privacy }: { postId: string; desc: string; privacy: number }) =>
//       editForumPost(postId, desc, privacy),
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["forumPosts", currentUserId] }),
//     onError: (err) => console.error("Error editing post:", err),
//   });

//   const editPost = (postId: string, desc: string, privacy: number) =>
//     editPostMutation.mutate({ postId, desc, privacy });

//   const createPost = ({ desc, privacy }: { desc: string; privacy: number }) => {
//     insertMutation.mutate({ desc, privacy });
//   };

//   const handleToggleLike = (postId: string) => {
//     likeMutation.mutate(postId);
//   };

//   const removePost = (postId: string) => {
//     deleteMutation.mutate(postId);
//   };

//   return {
//     forumPosts,
//     isLoading,
//     error,
//     refetchForum,
//     createPost,
//     handleToggleLike, // Renamed from toggleLike for clarity
//     removePost,
//     editPost,
//     currentUserId, // Expose this for the UI to check ownership
//   };
// };

// export default useForum;
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getForumPosts,
  insertForumPost,
  toggleLike,
  deleteForumPost,
  editForumPost,
} from "@/api/forum";

const useForum = () => {
  const queryClient = useQueryClient();

  // Fetch all posts
  const {
    data: forumPosts,
    error,
    isLoading,
    refetch: refetchForum,
  } = useQuery({
    queryKey: ["forumPosts"],
    queryFn: getForumPosts,
  });

  // Create new post
  const insertMutation = useMutation({
    mutationFn: async ({
      desc,
      privacy,
    }: {
      desc: string;
      privacy: number;
    }) => await insertForumPost({ desc, privacy }),
    onError: (err) => {
      console.error("Error creating post:", err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forumPosts"] });
    },
  });

  // Toggle like
  const likeMutation = useMutation({
    mutationFn: async (postId: string) => {
      await toggleLike(postId);
    },
    onMutate: async (postId) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ["forumPosts"] });
      const prevPosts = queryClient.getQueryData<any[]>(["forumPosts"]);

      if (prevPosts) {
        queryClient.setQueryData(
          ["forumPosts"],
          prevPosts.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  liked: !p.liked,
                  likes: p.liked ? p.likes - 1 : p.likes + 1,
                }
              : p
          )
        );
      }

      return { prevPosts };
    },
    onError: (err, _, context) => {
      console.error("Error toggling like:", err);
      if (context?.prevPosts) {
        queryClient.setQueryData(["forumPosts"], context.prevPosts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["forumPosts"] });
    },
  });

  // Delete a post
  const deleteMutation = useMutation({
    mutationFn: async (postId: string) => await deleteForumPost(postId),
    onError: (err) => {
      console.error("Error deleting post:", err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forumPosts"] });
    },
  });

  // Edit a post
  const editPostMutation = useMutation({
    mutationFn: ({
      postId,
      desc,
      privacy,
    }: {
      postId: string;
      desc: string;
      privacy: number;
    }) => editForumPost(postId, desc, privacy),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["forumPosts"] }),
    onError: (err) => console.error("Error editing post:", err),
  });

  const createPost = ({ desc, privacy }: { desc: string; privacy: number }) => {
    insertMutation.mutate({ desc, privacy });
  };

  const handleToggleLike = (postId: string) => {
    likeMutation.mutate(postId);
  };

  const removePost = (postId: string) => {
    deleteMutation.mutate(postId);
  };

  const editPost = (postId: string, desc: string, privacy: number) => {
    editPostMutation.mutate({ postId, desc, privacy });
  };

  return {
    forumPosts,
    isLoading,
    error,
    refetchForum,
    createPost,
    handleToggleLike,
    removePost,
    editPost,
  };
};

export default useForum;