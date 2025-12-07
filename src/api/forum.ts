import supabase from "@/helpers/supabase";

// Get current user's ID
const getCurrentUserId = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Not authenticated");
  return user.id;
};

// Get all posts with like status for current user
export const getForumPosts = async () => {
  const userId = await getCurrentUserId();

  // Fetch posts that are either:
  // 1. Public (privacy = 0), OR
  // 2. Private (privacy = 1) AND belong to current user
  const { data, error } = await supabase
    .from("Forum")
    .select(`
      *,
      Users:user_id (name)
    `)
    .or(`privacy.eq.0,and(privacy.eq.1,user_id.eq.${userId})`)
    .order("created_at", { ascending: false });

  if (error) throw error;

  // Add liked status and actual like count for each post
  const postsWithLikes = await Promise.all(
    data.map(async (post) => {
      // Get total like count
      const { count } = await supabase
        .from("ForumLikes")
        .select("*", { count: "exact", head: true })
        .eq("post_id", post.id);

      // Check if current user liked this post
      const { data: userLike } = await supabase
        .from("ForumLikes")
        .select("id")
        .eq("post_id", post.id)
        .eq("user_id", userId)
        .maybeSingle();

      return {
        ...post,
        likes: count || 0,
        liked: !!userLike,
      };
    })
  );

  return postsWithLikes;
};

// Toggle like (add or remove)
export const toggleLike = async (postId: string) => {
  const userId = await getCurrentUserId();

  // Verify the post is visible to the user before allowing like
  const { data: post } = await supabase
    .from("Forum")
    .select("privacy, user_id")
    .eq("id", postId)
    .single();

  if (!post) throw new Error("Post not found");
  
  // Check if user can access this post
  if (post.privacy === 1 && post.user_id !== userId) {
    throw new Error("Cannot like a private post you don't own");
  }

  // Check if user already liked the post
  const { data: existingLike } = await supabase
    .from("ForumLikes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existingLike) {
    // Unlike: Remove the like
    const { error } = await supabase
      .from("ForumLikes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", userId);

    if (error) throw error;
  } else {
    // Like: Add a new like
    const { error } = await supabase
      .from("ForumLikes")
      .insert({ post_id: postId, user_id: userId });

    if (error) throw error;
  }
};

export const insertForumPost = async ({
  desc,
  privacy,
}: {
  desc: string;
  privacy: number;
}) => {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("Forum")
    .insert({ desc, privacy, user_id: userId })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteForumPost = async (postId: string) => {
  const userId = await getCurrentUserId();

  // Verify the user owns the post before deleting
  const { data: post } = await supabase
    .from("Forum")
    .select("user_id")
    .eq("id", postId)
    .single();

  if (post?.user_id !== userId) {
    throw new Error("You can only delete your own posts");
  }

  const { error } = await supabase
    .from("Forum")
    .delete()
    .eq("id", postId);

  if (error) throw error;
};

export const editForumPost = async (
  postId: string,
  desc: string,
  privacy: number
) => {
  const userId = await getCurrentUserId();

  // Verify the user owns the post before editing
  const { data: post } = await supabase
    .from("Forum")
    .select("user_id")
    .eq("id", postId)
    .single();

  if (post?.user_id !== userId) {
    throw new Error("You can only edit your own posts");
  }

  const { error } = await supabase
    .from("Forum")
    .update({ desc, privacy })
    .eq("id", postId);

  if (error) throw error;
};