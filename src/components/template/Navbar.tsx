import { Link } from "@tanstack/react-router";
import Brand from "./Brand";

const Navbar = () => {
  return (
    <div className="flex items-center font-bold justify-between p-4 mx-8 text-lg">
      <Brand />
      <div className="flex justify-center gap-12">
        <Link
          to="/"
          className="[&.active]:font-bold link"
          activeProps={{ className: "selected" }}
        >
          Dashboard
        </Link>
        <Link
          to="/groups"
          className="[&.active]:font-bold link"
          activeProps={{ className: "selected" }}
        >
          Groups
        </Link>
        <Link
          to="/challenges"
          className="[&.active]:font-bold link"
          activeProps={{ className: "selected" }}
        >
          Challenges
        </Link>
        <Link
          to="/forum"
          className="[&.active]:font-bold link"
          activeProps={{ className: "selected" }}
        >
          Forum
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
