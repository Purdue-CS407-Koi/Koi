import { Link } from "@tanstack/react-router";

const NavLink = ({ target, title }: { target: string; title: string }) => {
  return (
    <Link
      to={target}
      className="[&.active]:font-bold link"
      activeProps={{ className: "selected" }}
    >
      {title}
    </Link>
  );
};

export default NavLink;
