import { ThumbUpAltOutlined, ThumbUpAlt } from "@mui/icons-material";

export interface ForumPost {
  id: string;
  desc: string;
  likes: number;
  created_at: string;
  Users?: { name?: string };
  liked?: boolean; // optional client-side flag
}

interface ForumListProps {
  posts: ForumPost[];
  loading: boolean;
  onToggleLike: (postId: string, liked: boolean) => void;
}

export const ForumList: React.FC<ForumListProps> = ({
  posts,
  loading,
  onToggleLike,
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
      {posts.map((post) => (
        <div
          key={post.id}
          className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-1">
            <h4 className="font-semibold text-gray-800">
              {post.Users?.name ?? "Anonymous"}
            </h4>
            <span className="text-xs text-gray-400">
              {new Date(post.created_at).toLocaleString()}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-700 mt-2">{post.desc}</p>

          {/* Likes */}
          <div
            className="flex items-center gap-1 mt-3 text-gray-500 text-sm cursor-pointer hover:text-blue-600 transition"
            onClick={() => onToggleLike(post.id, !!post.liked)}
          >
            {post.liked ? (
              <ThumbUpAlt fontSize="small" />
            ) : (
              <ThumbUpAltOutlined fontSize="small" />
            )}
            <span>{post.likes}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
