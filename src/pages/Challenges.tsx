import Template, { Content, Sidebar } from "@/templates/template";
import { AppChallenges } from "@/components/challenges/appChallenges";
import { ActiveChallenges } from "@/components/challenges/activeChallenges";
import { MyChallenges } from "@/components/challenges/myChallenges";
import { Leaderboard } from "@/components/challenges/leaderboard";
import useChallenges from "@/hooks/useChallenges";

const Challenges = () => {
  const { appChallengeData, groupChallengeData, activeChallengeData, insertNewChallengeMembership } = useChallenges();
  return (
    <Template>
      <Content>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-6 mx-10 h-full">
          <div>
            <ActiveChallenges activeChallengeData={activeChallengeData} />
          </div>
          <div className="flex flex-col gap-8">
            <MyChallenges groupChallengeData={groupChallengeData} />
            <AppChallenges appChallengeData={appChallengeData} insertNewChallengeMembership={insertNewChallengeMembership} />
          </div>
        </div>
      </Content>
      <Sidebar>
        <Leaderboard />
      </Sidebar>
    </Template>
  );
};

export default Challenges;
