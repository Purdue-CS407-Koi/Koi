import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { DetailModal } from './modals/detailModal';

import type {
  Tables,
} from "@/helpers/supabase.types";
import { useState } from 'react';

type ActiveChallengeType = Tables<"Challenges"> & { amount_used: number, joined: string, owner_name?: string | null, is_owner: boolean };

type ChallengeListProps = {
  activeChallengeData?: ActiveChallengeType[];
};

export const ActiveChallenges: React.FC<ChallengeListProps> = ({activeChallengeData}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<(ActiveChallengeType) | null>(null);

  const openDetailModal = (challenge: (ActiveChallengeType)) => {
    setSelectedChallenge(challenge);
    setIsOpen(true);
  };

   if (!activeChallengeData || activeChallengeData.length === 0) {
    return (
      <div className="p-4 bg-side-panel-background h-full rounded-xl flex flex-col">
        <h2 className="text-xl mb-4">Active Challenges</h2>
        <div className="text-gray-600 italic leading-normal flex items-center justify-center flex-1">
          You have no active challenges at the moment.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-side-panel-background h-full rounded-xl">
      <h2 className="text-xl mb-4">Active Challenges</h2>
      {activeChallengeData?.map((challenge) => (
        <div key={challenge.id} 
          className="p-2 flex leading-normal hover:!bg-gray-200 rounded-lg
            cursor-pointer transition-colors duration-150" 
          onClick={() => openDetailModal(challenge)}
        >
          <div className="flex-1 flex justify-center items-center"> 
            <AccessTimeIcon className="text-3xl mr-4 text-button-hover cursor-pointer" />
          </div>
          <div className="flex-5">
            <div className="text-m">{challenge.name}</div>
            <div className="text-gray-600 text-sm">
              {new Date() > new Date(challenge.start) ? "Started" : "Starts"}: {new Date(challenge.start).toLocaleDateString()}
            </div>
            {challenge.end && 
              <div className="text-gray-600 text-sm">Ends: {new Date(challenge.end).toLocaleDateString()}</div>
            }
            <div className="text-gray-600 text-sm">
              Joined: {new Date(challenge.joined).toLocaleDateString()}
            </div>
          </div>
          <div className="flex-5 flex leading-normal text-xl font-bold items-center justify-end mr-2">
            <div>${challenge.amount_used}/${challenge.amount}</div>
          </div>
        </div>
      ))}
      <DetailModal isOpen={isOpen} closeModal={() => {setIsOpen(false)}} challenge={selectedChallenge} />
    </div>
  );
}