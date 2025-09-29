import { Link } from "@tanstack/react-router";

const NavLink = ({ target, title }: { target: string; title: string }) => {
  return (
    <Link
      to={target}
      activeProps={{ className: "font-bold text-black" }}
      inactiveProps={{ className: "text-gray-600 hover:underline" }}
    >
      {title}
    </Link>
  );
};

export default NavLink;
