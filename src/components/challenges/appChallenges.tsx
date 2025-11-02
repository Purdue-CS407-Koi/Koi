import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckIcon from '@mui/icons-material/Check';

import type {
  Tables,
} from "@/helpers/supabase.types";
import { ConfirmationModal } from './modals/confirmationModal';
import { useState } from 'react';

type ChallengeListProps = {
  appChallengeData?: {
    accepted: Tables<"Challenges">[],
    notAccepted: Tables<"Challenges">[],
  },
  insertNewChallengeMembership?: (challenge_id: string) => void,
};

export const AppChallenges: React.FC<ChallengeListProps> = ({appChallengeData, insertNewChallengeMembership}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Tables<"Challenges"> | null>(null);

  const onPressJoinChallenge = (challenge: Tables<"Challenges">) => {
    setSelectedChallenge(challenge);
    setIsOpen(true);
  };

  const onSubmit = () => {
    if (selectedChallenge && insertNewChallengeMembership) {
      insertNewChallengeMembership(selectedChallenge.id);
    }
    setIsOpen(false);
  };

  if (!appChallengeData || 
    (appChallengeData.notAccepted.length + appChallengeData.accepted.length) === 0) 
  {
    return (
      <div className="p-4 bg-side-panel-background h-full rounded-xl flex flex-col ">
        <h2 className="text-xl mb-4">App Challenges</h2>
        <div className="text-gray-600 italic leading-normal flex items-center justify-center flex-1 py-8">
          Challenges coming soon to you!
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-side-panel-background rounded-xl">
      <h2 className="text-xl mb-4">App Challenges</h2>
      <div>
        {appChallengeData?.accepted.map((challenge) => (
          <div key={challenge.id} className="p-2 flex leading-normal">
            <div className="flex-1 flex justify-center items-center"> 
              <CheckIcon className="text-3xl mr-4 text-button-hover" />
            </div>
            <div className="flex-5">
              <div className="text-m">{challenge.name}</div>
              <div className="text-gray-600 text-sm">
                {new Date() > new Date(challenge.start) ? "Started" : "Starts"}: {new Date(challenge.start).toLocaleDateString()}
              </div>
            </div>
            <div className="flex-5 flex leading-normal text-xl font-bold items-center justify-end mr-2">
              <div>${challenge.amount % 1 == 0 
                ? challenge.amount 
                : challenge.amount.toFixed(2)}</div>
            </div>
          </div>
        ))}
        {appChallengeData?.notAccepted.map((challenge) => (
          <div key={challenge.id} className="p-2 flex leading-normal">
            <div className="flex-1 flex justify-center items-center" onClick={() => onPressJoinChallenge(challenge)}>
              <AddCircleOutlineIcon className="text-4xl mr-4 text-button-hover cursor-pointer" />
            </div>
            <div className="flex-5">
              <div className="text-m">{challenge.name}</div>
              <div className="text-gray-600 text-sm">
                {new Date() > new Date(challenge.start) ? "Started" : "Starts"}: {new Date(challenge.start).toLocaleDateString()}
              </div>
            </div>
            <div className="flex-5 flex leading-normal text-xl font-bold items-center justify-end mr-2">
              <div>${challenge.amount}</div>
            </div>
          </div>
        ))}
      </div>
      <ConfirmationModal isOpen={isOpen} closeModal={() => setIsOpen(false)} onSubmit={onSubmit} >
        Do you want to join {selectedChallenge?.name}?
      </ConfirmationModal>
    </div>
  );
}