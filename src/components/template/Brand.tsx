import { Link } from "@tanstack/react-router";

import logo from "@/assets/logo.png";

const Brand = () => {
  return (
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
  );
};

export default Brand;
