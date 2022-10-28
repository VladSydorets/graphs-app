import React from "react";
import Dropdown from "./Dropdown";

const Navbar = ({ title }) => {
  return (
    <div className="w-full mx-auto lg:px-24 px-4 h-16 bg-slate-800">
      <nav className="flex justify-between items-center w-full h-full">
        <a
          href="/#"
          className="font-normal sm:text-lg text-sm px-3 py-2 text-neutral-50 hover:text-neutral-300 text-center"
        >
          {title}
        </a>
        <Dropdown />
      </nav>
    </div>
  );
};

export default Navbar;
