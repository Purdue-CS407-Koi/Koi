import { Link } from "@tanstack/react-router";

const NavLink = ({ target, title }: { target: string; title: string }) => {
  return (
    <Link
      to={target}
      className="[&.active]:font-bold text-gray-600 hover:underline"
      activeProps={{ className: "selected" }}
    >
      {title}
    </Link>
  );
};

export default NavLink;
