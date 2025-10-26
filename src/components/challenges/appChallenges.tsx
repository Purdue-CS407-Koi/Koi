import type {
  Tables,
} from "@/helpers/supabase.types";

type ChallengeListProps = {
  appChallengeData?: Tables<"Challenges">[];
};

export const AppChallenges: React.FC<ChallengeListProps> = ({appChallengeData}) => {
  console.log(appChallengeData);
  return (
    <div className="p-4 bg-side-panel-background">
      <h2 className="text-2xl font-bold mb-4">App Challenges</h2>
      <div>
        {appChallengeData?.map((challenge) => (
          <div key={challenge.id} className="mb-4 p-4 border border-gray-300 rounded">
            <h3 className="text-xl font-semibold">{challenge.name}</h3>
            <p className="text-gray-600">{new Date(challenge.created_at).toLocaleDateString()}</p>
            <p className="text-gray-600">${challenge.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
}