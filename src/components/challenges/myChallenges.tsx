import AccessTimeIcon from '@mui/icons-material/AccessTime';

import type {
  Tables,
} from "@/helpers/supabase.types";

type ChallengeListProps = {
  appChallengeData?: Tables<"Challenges">[];
};

export const MyChallenges: React.FC<ChallengeListProps> = ({appChallengeData}) => {
  if (!appChallengeData || appChallengeData.length === 0) {
    return (
      <div className="p-4 bg-side-panel-background h-full rounded-xl flex flex-col">
        <h2 className="text-xl mb-4">My Challenges</h2>
        <div className="text-gray-600 italic leading-normal flex items-center justify-center flex-1 py-8">
          Any group challenges you make will appear here!
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-side-panel-background rounded-xl">
      <h2 className="text-xl mb-4">My Challenges</h2>
      {appChallengeData?.map((challenge) => (
        <div key={challenge.id} className="mb-4 p-4 flex leading-normal">
          <div className="flex-1 flex justify-center items-center"> 
            <AccessTimeIcon className="text-3xl mr-2 text-button-hover cursor-pointer" />
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
          <div className="flex-5 flex leading-normal text-xl font-bold items-center justify-end">
            <div>${challenge.amount}</div>
          </div>
        </div>
      ))}
    </div>
  );
}