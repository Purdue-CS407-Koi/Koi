import ChallengeLeaderboard from "./leaderboard/challengeLeaderboard";
import UserLeaderboard from "./leaderboard/userLeaderboard";

export const Leaderboard = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>

      <ChallengeLeaderboard />
      <UserLeaderboard />
    </div>
  );
};
