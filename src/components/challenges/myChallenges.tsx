import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Circle } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';

import type {
  Tables,
  TablesInsert,
} from "@/helpers/supabase.types";
import { CreateGroupExpenseModal } from './modals/createGroupChallengeModal';
import { useState } from 'react';

type ChallengeListProps = {
  groupChallengeData?: Tables<"Challenges">[];
  insertNewChallenge: (challenge: TablesInsert<"Challenges">) => void;
};

export const MyChallenges: React.FC<ChallengeListProps> = ({groupChallengeData, insertNewChallenge}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!groupChallengeData || groupChallengeData.length === 0) {
    return (
      <div className="p-4 bg-side-panel-background h-full rounded-xl flex flex-col">
        <div className='flex'>
          <h2 className="text-xl mb-4 flex-9">My Challenges</h2>
          <div className='flex-1 flex justify-center items-center cursor-pointer' onClick={() => setIsOpen(true)}>
            <Circle className="text-4xl text-[var(--color-primary-container)] cursor-pointer mb-4 absolute" />
            <AddIcon className="text-3xl text-button-hover text-lg cursor-pointer mb-4 absolute" />
          </div>
        </div>
        <div className="text-gray-600 italic leading-normal flex items-center justify-center flex-1 py-8">
          Any group challenges you make will appear here!
        </div>
        <CreateGroupExpenseModal isOpen={isOpen} closeModal={() => setIsOpen(false)} onSubmit={(challenge) => insertNewChallenge(challenge)} />
      </div>
    );
  }

  return (
    <div className="p-4 bg-side-panel-background rounded-xl">
      <div className='flex'>
        <h2 className="text-xl mb-4 flex-9">My Challenges</h2>
        <div className='flex-1 flex justify-center items-center cursor-pointer' onClick={() => setIsOpen(true)}>
          <Circle className="text-4xl text-[var(--color-primary-container)] cursor-pointer mb-4 absolute" />
          <AddIcon className="text-3xl text-button-hover text-lg cursor-pointer mb-4 absolute" />
        </div>
      </div>
      {groupChallengeData?.map((challenge) => (
        <div key={challenge.id} className="mb-4 p-4 flex leading-normal">
          <div className="flex-1 flex justify-center items-center"> 
            <AccessTimeIcon className="text-3xl mr-4 text-button-hover cursor-pointer" />
          </div>
          <div className="flex-5">
            <div className="text-m">{challenge.name}</div>
            <div className="text-gray-600">
              {new Date() > new Date(challenge.start) ? "Started" : "Starts"}: {new Date(challenge.start).toLocaleDateString()}
            </div>
            {challenge.end && 
              <div className="text-gray-600">Ends: {new Date(challenge.end).toLocaleDateString()}</div>
            }
          </div>
          <div className="flex-5 flex leading-normal text-xl font-bold items-center justify-end mr-2">
            <div>${challenge.amount}</div>
          </div>
        </div>
      ))}
      <CreateGroupExpenseModal isOpen={isOpen} closeModal={() => setIsOpen(false)} onSubmit={(challenge) => insertNewChallenge(challenge)} />
    </div>
  );
}