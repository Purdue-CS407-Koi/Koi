import PersonIcon from "@mui/icons-material/Person";
import useChallenges from "@/hooks/useChallenges";
import { useState, useEffect } from "react";
import type { Tables } from "@/helpers/supabase.types";
import { getChallengeUserCount, getUserChallengeCount } from "@/api/challenges";
import { getUsers } from "@/api/users";

interface ProcessedUser extends Tables<"Users"> {
  challengeCount: number;
}

const UserLeaderboard = () => {
  const [processedUsers, setProcessedUsers] = useState<ProcessedUser[]>([]);

  useEffect(() => {
    (async () => {
      const users = await getUsers();

      const processed = await Promise.all(
        users.map(async (user) => {
          const challengeCount = await getUserChallengeCount(user.id);
          return { ...user, challengeCount };
        }),
      );

      setProcessedUsers(
        processed.sort((a, b) => b.challengeCount - a.challengeCount),
      );
    })();
  }, []);

  if (!processedUsers) {
    // Show nothing if there are no challenges
    return <></>;
  }

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Users</h3>
      <ul>
        {processedUsers.map((user) => (
          <li key={user.id}>
            <div className="p-2 flex leading-normal">
              <div className="flex-1 flex justify-center items-center">
                <PersonIcon className="text-3xl mr-4 text-button-hover" />
              </div>

              <div className="flex-5">
                <div className="text-m">{user.name}</div>
                <div className="text-s">
                  {user.challengeCount} challenge
                  {user.challengeCount === 1 ? "" : "s"}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserLeaderboard;
