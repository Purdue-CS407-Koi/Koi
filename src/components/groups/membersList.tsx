import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Tooltip } from "@mui/material";
import RemoveMemberModal from "@/components/groups/removeMemberModal";
import useGroups from "@/hooks/useGroups";
import useUsers from "@/hooks/useUsers";
import { InviteFriendModal } from "@/components/groups/invite/inviteFriendModal";

interface Member {
  id: string;
  name: string;
  avatar?: string;
}

interface MembersListProps {
  members: Member[];
  groupId: string | null;
}

export const MembersList: React.FC<MembersListProps> = ({
  members,
  groupId,
}) => {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const { removeMember } = useGroups();
  const [inviteOpen, setInviteOpen] = useState(false);
  const user = useUsers();

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Members</h3>
      {members.length === 0 ? (
        <div className="text-sm italic text-gray-500">
          Select a group to view members
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setInviteOpen(true)}
            className='flex items-center gap-2
              p-2 mt-2 rounded-md
              cursor-pointer text-sm
              border border-sidebar-button-border
              bg-transparent
              transition-all duration-200"
            '
          >
            Invite Friend
          </button>
          {members.map((member) => (
            <div
              key={member.id}
              className="group flex items-center justify-between bg-white px-3 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`
                    flex w-[40px] h-[40px] text-white justify-center items-center
                    text-base font-semibold overflow-hidden rounded-full
                    ${member.avatar ? "bg-transparent" : "bg-gray-400"}
                  `}
                >
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    member.name.charAt(0).toUpperCase()
                  )}
                </div>

                <span className="text-auth-input-label text-base font-medium">
                  {member.name}
                  {member.id === user?.userData?.id && (
                    <span className="ml-2 text-xs text-gray-400">(You)</span>
                  )}
                </span>
              </div>

              {member.id !== user?.userData?.id && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Tooltip title="Remove Member">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMember(member);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedMember && (
        <RemoveMemberModal
          open={!!selectedMember}
          onClose={() => setSelectedMember(null)}
          onConfirm={() => {
            if (groupId && selectedMember.id) {
              removeMember(groupId, selectedMember.id);
            }
            setSelectedMember(null);
          }}
          memberName={selectedMember.name}
        />
      )}
      <InviteFriendModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        groupId={groupId}
      />
    </div>
  );
};
