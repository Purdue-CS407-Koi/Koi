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
          <div key={challenge.id} className="mb-4 p-4 flex leading-normal">
            <div className="flex-1 flex justify-center items-center"> 
              <CheckIcon className="text-3xl mr-2 text-button-hover cursor-pointer" />
            </div>
            <div className="flex-5">
              <div className="text-m">{challenge.name}</div>
              <div className="text-gray-600">
                {new Date() > new Date(challenge.start) ? "Started" : "Starts"}: {new Date(challenge.start).toLocaleDateString()}
              </div>
            </div>
            <div className="flex-5 flex leading-normal text-xl font-bold items-center justify-end">
              <div>${challenge.amount}</div>
            </div>
          </div>
        ))}
        {appChallengeData?.notAccepted.map((challenge) => (
          <div key={challenge.id} className="mb-4 p-4 flex leading-normal">
            <div className="flex-1 flex justify-center items-center"> 
              <AddCircleOutlineIcon className="text-4xl mr-2 text-button-hover cursor-pointer" />
            </div>
            <div className="flex-5">
              <div className="text-m">{challenge.name}</div>
              <div className="text-gray-600">
                {new Date() > new Date(challenge.start) ? "Started" : "Starts"}: {new Date(challenge.start).toLocaleDateString()}
              </div>
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