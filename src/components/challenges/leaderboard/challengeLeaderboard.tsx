import AccessTimeIcon from "@mui/icons-material/AccessTime";
import useChallenges from "@/hooks/useChallenges";
import { useState, useEffect } from "react";
import type { Tables } from "@/helpers/supabase.types";
import { getChallengeUserCount } from "@/api/challenges";

interface ProcessedChallenge extends Tables<"Challenges"> {
  participants: number;
}

const ChallengeLeaderboard = () => {
  const { appChallengeData } = useChallenges();
  const [processedChallenges, setProcessedChallenges] = useState<
    ProcessedChallenge[]
  >([]);

  useEffect(() => {
    (async () => {
      if (appChallengeData) {
        const filtered = appChallengeData.filter((challenge) => {
          return challenge.end === null || new Date(challenge.end) > new Date();
        });

        const processed = Promise.all(
          filtered.map(async (challenge) => {
            const participants = await getChallengeUserCount(challenge.id);
            return {
              ...challenge,
              participants,
            };
          }),
        );

        setProcessedChallenges(await processed);
      }
    })();
  }, [appChallengeData]);

  if (!processedChallenges) {
    // Show nothing if there are no challenges
    return <></>;
  }

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Challenges</h3>
      <ul>
        {processedChallenges.map((challenge) => (
          <li key={challenge.id}>
            <div className="p-2 flex leading-normal">
              <div className="flex-1 flex justify-center items-center">
                <AccessTimeIcon className="text-3xl mr-4 text-button-hover" />
              </div>

              <div className="flex-5">
                <div className="text-m">{challenge.name}</div>
                <div className="text-s">
                  {challenge.participants} participant
                  {challenge.participants === 1 ? "" : "s"}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChallengeLeaderboard;
