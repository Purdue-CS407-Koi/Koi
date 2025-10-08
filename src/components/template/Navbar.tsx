import Brand from "./Brand";
import NavLink from "./NavLink";

const Navbar = () => {
  const navLinks = [
    { target: "/", title: "Overview" },
    { target: "/groups", title: "Groups" },
    { target: "/challenges", title: "Challenges" },
    { target: "/forum", title: "Forum" },
  ];

  return (
    <div className="flex items-center font-bold justify-between p-4 mx-8 text-lg">
      <Brand />
      <div className="flex justify-center gap-12">
        {navLinks.map((item) => {
          return <NavLink key={item.title} target={item.target} title={item.title} />;
        })}
      </div>
    </div>
  );
};

export default Navbar;
