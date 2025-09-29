import { Link } from "@tanstack/react-router";
import logo from "../../assets/logo.png";

const Navbar = () => {
  return (
    <div className="flex items-center font-bold justify-between p-4 mx-8 text-lg">
      <div>
        <Link to="/" className="[&.active]:font-bold">
          <div className="items-center flex gap-4">
            <img src={logo} alt="Koi Logo" className="inline h-11 w-11" />
            <text className="font-bold align-middle text-black text-5xl">
              Koi
            </text>
          </div>
        </Link>
      </div>
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
