import React from "react";
import Dropdown from "./Dropdown";
import "./Navbar.css";

const Navbar = ({ title, darkToggle, setDarkToggle }) => {
  const lightBtn = <i className="fa-solid fa-sun text-white toggle-btn"></i>;
  const darkBtn = <i className="fa-solid fa-moon toggle-btn"></i>;
  const html = document.querySelector("html");

  const handleToggle = () => {
    setDarkToggle(!darkToggle);
    html.classList.toggle("dark");
  };

  return (
    <div className="w-full mx-auto lg:px-24 px-4 h-16 dark:bg-slate-700 bg-slate-800">
      <nav className="flex justify-between items-center w-full h-full">
        <a
          href="/#"
          className="font-normal sm:text-lg text-sm px-3 py-2 text-neutral-50 hover:text-neutral-300 text-center dark:text-black"
        >
          {title}
        </a>
        <div className="flex">
          <button
            className="text-xl hover:bg-slate-600 rounded-full h-10 w-10"
            onClick={handleToggle}
          >
            {darkToggle ? darkBtn : lightBtn}
          </button>
          <Dropdown />
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
