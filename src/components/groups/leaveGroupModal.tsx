import { useState } from "react";
import leaveGroup from "@/hooks/useGroups";
import { Button, Dialog } from "@mui/material";

export default function GroupHeader({ selectedGroup, onLeave }: { 
  selectedGroup: Group | null;
  onLeave: () => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLeave = async () => {
    if (!selectedGroup) return;
    setLoading(true);
    try {
      await leaveGroup(selectedGroup.id);
      setIsModalOpen(false);
      onLeave(); // callback to refresh or reset group selection
    } catch (error) {
      console.error("Failed to leave group:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedGroup) return null;

  return (
    <div className="flex justify-between items-center p-4 border-b">
      <h2 className="text-lg font-semibold">{selectedGroup.name}</h2>
      <Button 
        variant="destructive" 
        onClick={() => setIsModalOpen(true)}
        className="bg-red-500 hover:bg-red-600 text-white"
      >
        Leave Group
      </Button>

      {/* Confirmation Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="bg-white rounded-lg p-6 shadow-lg w-80">
            <Dialog.Title className="text-lg font-semibold mb-2">Leave Group</Dialog.Title>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to leave <span className="font-medium">{selectedGroup.name}</span>? 
              You will no longer have access to its expenses or members.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button 
                variant="destructive" 
                onClick={handleLeave}
                disabled={loading}
              >
                {loading ? "Leaving..." : "Leave"}
              </Button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
