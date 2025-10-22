import Template, { Content, Sidebar } from "@/templates/template";
import { AppChallenges } from "@/components/challenges/appChallenges";
import { CurrentlyParticipating } from "@/components/challenges/currentlyParticipating";
import { MyChallenges } from "@/components/challenges/myChallenges";
import { Leaderboard } from "@/components/challenges/leaderboard";

const Challenges = () => {
  return (
    <Template>
      <Content>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-8">
          <div>
            <CurrentlyParticipating />
          </div>
          <div className="grid gap-8">
            <MyChallenges />
            <AppChallenges />
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
