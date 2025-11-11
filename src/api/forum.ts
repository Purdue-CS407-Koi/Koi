import supabase from "@/helpers/supabase";

// export interface ForumPost {
//   id: string;
//   created_at: string;
//   user_id: string;
//   desc: string;
//   privacy: number; // 0 = public, 1 = private
//   likes: number;
//   Users?: { name: string };
// }
export interface ForumPost {
  id: string;
  created_at: string;
  user_id: string | null;
  desc: string | null;
  privacy: number | null;
  likes: number | null;
  Users: {
    name: string | null;
  } | null;
}


// ✅ Get all forum posts (public + user's private)
export const getForumPosts = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User is undefined");

  // Fetch both public posts and the user's private posts
  const { data, error } = await supabase
    .from("Forum")
    .select("*, Users(name)")
    .or(`privacy.eq.0, and(privacy.eq.1, user_id.eq.${user.id})`)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
};

// ✅ Insert a new post
export const insertForumPost = async (desc: string, privacy: number) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User is undefined");

  const { data, error } = await supabase
    .from("Forum")
    .insert([
      {
        user_id: user.id,
        desc,
        privacy, // 0 or 1
        likes: 0,
      },
    ])
    .select("*, Users(name)")
    .single();

  if (error) throw error;
  return data;
};

export const updateLikeCount = async (postId: string, delta: number) => {
  const { error } = await supabase.rpc("update_like_count", {
    post_id_input: postId,
    delta,
  });
  if (error) throw error;
};


// ✅ Delete a post (user can delete only their own via RLS)
export const deleteForumPost = async (postId: string) => {
  const { error } = await supabase.from("Forum").delete().eq("id", postId);
  if (error) throw error;
  return true;
};

export const editForumPost = async (postId: string, desc: string, privacy: number) => {
  const { error } = await supabase
    .from("Forum")
    .update({ desc, privacy })
    .eq("id", postId);

  if (error) throw error;
  return true;
};
