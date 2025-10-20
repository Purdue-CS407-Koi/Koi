import { AddGroupModal } from "./addGroupModal";
import { Bookmark, BookmarkBorder } from "@mui/icons-material";
import { GroupMoreActions } from "./groupMoreActions";

interface Group {
  id: string;
  name: string;
  createdDate: string;
}

interface GroupsListProps {
  groups: Group[];
  selectedGroupId: string | null;
  onSelectGroup: (groupId: string, groupName: string) => void;
  onEditGroup: (groupId: string, groupName: string) => void;
}

export const GroupsList: React.FC<GroupsListProps> = ({
  groups,
  selectedGroupId,
  onSelectGroup,
}) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-sidebar-title">Groups</h3>
      <div className="flex flex-col gap-2">
        {groups.length === 0 ? (
          <div className="text-sm text-gray-500 italic px-2">
            No groups, create one
          </div>
        ) : (
          groups.map((group) => {
            const isSelected = selectedGroupId === group.id;
            return (
              <div
                key={group.id}
                onClick={() =>
                  isSelected
                    ? onSelectGroup("", "") // unselect when clicked again
                    : onSelectGroup(group.id, group.name)
                }
                className={`group flex items-center justify-between py-2 px-2 rounded-md cursor-pointer transition-colors
              ${isSelected ? "bg-gray-200" : "hover:bg-gray-100"}
            `}
              >
                {/* Left: Icon + text */}
                <div className="flex items-center gap-3 w-full">
                  <div className="flex items-center justify-center w-5">
                    {isSelected ? <Bookmark /> : <BookmarkBorder />}
                  </div>
                  <div className="w-full">
                    <div className="text-sm font-medium text-sidebar-entry flex w-full">
                      {group.name}
                    </div>
                    <div className="text-xs text-sidebar-entry-subtext">
                      {`Created ${group.createdDate}`}
                    </div>
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <GroupMoreActions groupId={group.id} groupName={group.name} />
                </div>
              </div>
            );
          })
        )}
      </div>
      <AddGroupModal />
    </div>
  );
};
