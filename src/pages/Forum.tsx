// import { useState } from "react";
// import Template, { Content, Sidebar } from "@/templates/template";
// import useForum from "@/hooks/useForum";
// import { ForumList } from "@/components/forum/forumList";
// import { CreatePostModal } from "@/components/forum/createPostModal";

// const Forum = () => {
//   const { forumPosts, isLoading, createPost, toggleLike } = useForum();
//   const [modalOpen, setModalOpen] = useState(false);

//   return (
//     <Template>
//       <Content>
//         <div className="flex min-h-screen p-6 bg-content-background">
//           <div className="flex-1">
//             <div className="bg-white rounded-xl p-5 flex flex-col gap-6">
//               {/* Header */}
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-2xl font-bold text-sidebar-title">Forum</h2>
//                 <button
//                   onClick={() => setModalOpen(true)}
//                   className="flex items-center gap-1.5 py-2 px-4 text-white text-sm cursor-pointer rounded-md border-none bg-blue-600 hover:bg-blue-700 transition"
//                 >
//                   <span className="text-base">+</span>
//                   Create post
//                 </button>
//               </div>

//               {/* Posts list */}
//               <ForumList
//                 posts={forumPosts ?? []}
//                 loading={isLoading}
//                 onToggleLike={toggleLike}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Create Post Modal */}
//         <CreatePostModal
//           open={modalOpen}
//           onClose={() => setModalOpen(false)}
//           onCreate={(postData) => {
//     createPost(postData.desc, postData.privacy);
//     setModalOpen(false);
//   }}
//         />
//       </Content>

//       {/* Sidebar */}
//       <Sidebar>
//         <div>
//           <h3 className="text-lg font-semibold mb-4 text-sidebar-title">Forum</h3>
//         </div>
//       </Sidebar>
//     </Template>
//   );
// };

// export default Forum;
import { useState } from "react";
import Template, { Content, Sidebar } from "@/templates/template";
import useForum from "@/hooks/useForum";
import { ForumList } from "@/components/forum/forumList";
import { CreatePostModal } from "@/components/forum/createPostModal";
import useUsers from "@/hooks/useUsers";

const Forum = () => {
  const user = useUsers();
  const currentUserId = user?.userData?.id; 
  const { forumPosts, isLoading, createPost, handleToggleLike, removePost, editPost } = useForum();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Template>
      <Content>
        <div className="flex min-h-screen p-6 bg-content-background">
          <div className="flex-1">
            <div className="bg-white rounded-xl p-5 flex flex-col gap-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-sidebar-title">Forum</h2>
                <button
                  onClick={() => setModalOpen(true)}
                  className="flex items-center gap-1.5 py-2 px-4 text-white text-sm cursor-pointer rounded-md border-none bg-blue-600 hover:bg-blue-700 transition"
                >
                  <span className="text-base">+</span>
                  Create post
                </button>
              </div>

              {/* Posts list */}
              <ForumList
                posts={forumPosts ?? []}
                loading={isLoading}
                currentUserId={currentUserId}
                onToggleLike={handleToggleLike}
                onDelete={removePost}
                onEdit={editPost}
              />
            </div>
          </div>
        </div>

        {/* Create Post Modal */}
        <CreatePostModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onCreate={(postData) => {
            createPost(postData);
            setModalOpen(false);
          }}
        />
      </Content>

      {/* Sidebar */}
      <Sidebar>
        <div>
          <h3 className="text-lg font-semibold mb-4 text-sidebar-title">Forum</h3>
        <p className="text-sm text-gray-600">Chat with users!</p>
        </div>
      </Sidebar>
    </Template>
  );
};

export default Forum;