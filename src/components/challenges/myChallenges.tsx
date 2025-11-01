import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Circle } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/helpers/supabase.types";
import { CreateGroupChallengeModal } from './modals/createGroupChallengeModal';
import { useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { EditGroupChallengeModal } from './modals/editGroupChallengeModal';

type ChallengeListProps = {
  groupChallengeData?: Tables<"Challenges">[];
  insertNewChallenge: (challenge: TablesInsert<"Challenges">) => void;
  updateChallenge: (challenge: TablesUpdate<"Challenges">) => void;
};

export const MyChallenges: React.FC<ChallengeListProps> = ({groupChallengeData, insertNewChallenge, updateChallenge}) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [challengeToEdit, setChallengeToEdit] = useState<Tables<"Challenges"> | null>(null);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const submitAddChallenge = (challenge: TablesInsert<"Challenges">) => insertNewChallenge(challenge);
  const submitEditChallenge = (challenge: TablesUpdate<"Challenges">) => updateChallenge(challenge);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (!groupChallengeData || groupChallengeData.length === 0) {
    return (
      <div className="p-4 bg-side-panel-background h-full rounded-xl flex flex-col">
        <div className='flex'>
          <h2 className="text-xl mb-4 flex-9">My Challenges</h2>
          <div className='flex-1 flex justify-center items-center cursor-pointer' onClick={() => setIsCreateOpen(true)}>
            <Circle className="text-4xl text-[var(--color-primary-container)] cursor-pointer mb-4 absolute" />
            <AddIcon className="text-3xl text-button-hover text-lg cursor-pointer mb-4 absolute" />
          </div>
        </div>
        <div className="text-gray-600 italic leading-normal flex items-center justify-center flex-1 py-8">
          Any group challenges you make will appear here!
        </div>
        <CreateGroupChallengeModal isOpen={isCreateOpen} closeModal={() => setIsCreateOpen(false)} onSubmit={submitAddChallenge} />
      </div>
    );
  }

  return (
    <div className="p-4 bg-side-panel-background rounded-xl">
      <div className='flex'>
        <h2 className="text-xl mb-4 flex-9">My Challenges</h2>
        <div className='flex-1 flex justify-center items-center cursor-pointer' onClick={() => setIsCreateOpen(true)}>
          <Circle className="text-4xl text-[var(--color-primary-container)] cursor-pointer mb-4 absolute" />
          <AddIcon className="text-3xl text-button-hover text-lg cursor-pointer mb-4 absolute" />
        </div>
      </div>
      {groupChallengeData?.map((challenge) => (
        <div key={challenge.id} className="p-2 flex leading-normal">
          <div className="flex-1 flex justify-center items-center"> 
            <AccessTimeIcon className="text-3xl mr-4 text-button-hover" />
          </div>
          <div className="flex-5">
            <div className="text-m">{challenge.name}</div>
            <div className="text-gray-600 text-sm">
              {new Date() > new Date(challenge.start) ? "Started" : "Starts"}: {new Date(challenge.start).toLocaleDateString()}
            </div>
            {challenge.end && 
              <div className="text-gray-600 text-sm">Ends: {new Date(challenge.end).toLocaleDateString()}</div>
            }
          </div>
          <div className="flex-5 flex leading-normal text-xl font-bold items-center justify-end mr-2">
            <div>${challenge.amount}</div>
          </div>
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={open ? "long-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
            <MoreHorizIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem
              onClick={() => {
                setIsEditOpen(true);
                setChallengeToEdit(challenge);
                handleClose();
              }}
              className="hover:!bg-[var(--color-primary-container)] hover:!text-[var(--color-on-primary-container)]"
            >
              Edit
            </MenuItem>
          </Menu>
        </div>
      ))}
      <CreateGroupChallengeModal isOpen={isCreateOpen} closeModal={() => setIsCreateOpen(false)} onSubmit={submitAddChallenge} />
      <EditGroupChallengeModal isOpen={isEditOpen} closeModal={() => setIsEditOpen(false)} onSubmit={submitEditChallenge} challenge={challengeToEdit}/>
    </div>
  );
}