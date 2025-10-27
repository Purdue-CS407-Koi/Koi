import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckIcon from '@mui/icons-material/Check';

import type {
  Tables,
} from "@/helpers/supabase.types";

type ChallengeListProps = {
  appChallengeData?: {
    accepted: Tables<"Challenges">[],
    notAccepted: Tables<"Challenges">[],
  };
};

export const AppChallenges: React.FC<ChallengeListProps> = ({appChallengeData}) => {
  return (
    <div className="p-4 bg-side-panel-background rounded-xl">
      <h2 className="text-xl mb-4">App Challenges</h2>
      <div>
        {appChallengeData?.accepted.map((challenge) => (
          <div key={challenge.id} className="mb-4 p-4 flex leading-normal">
            <div className="flex-1"> 
              <CheckIcon className="text-3xl mr-4 text-button-hover cursor-pointer" />
            </div>
            <div className="flex-5">
              <div className="text-m">{challenge.name}</div>
              <div className="text-gray-600">Created: {new Date(challenge.created_at).toLocaleDateString()}</div>
            </div>
            <div className="flex-5 flex leading-normal text-xl font-bold items-center justify-end">
              <div>${challenge.amount}</div>
            </div>
          </div>
        ))}
        {appChallengeData?.notAccepted.map((challenge) => (
          <div key={challenge.id} className="mb-4 p-4 flex leading-normal">
            <div className="flex-1"> 
              <AddCircleOutlineIcon className="text-3xl mr-4 text-button-hover cursor-pointer" />
            </div>
            <div className="flex-5">
              <div className="text-m">{challenge.name}</div>
              <div className="text-gray-600">Created: {new Date(challenge.created_at).toLocaleDateString()}</div>
            </div>
            <div className="flex-5 flex leading-normal text-xl font-bold items-center justify-end">
              <div>${challenge.amount}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}