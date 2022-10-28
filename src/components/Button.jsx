import React from "react";

function Button({ text, icon, color, isActive, ...buttonProps }) {
  const colors = {
    green:
      "text-green-600 border-green-600 hover:text-green-50 hover:bg-green-600",
    blue: "text-blue-600 border-blue-600 hover:text-blue-50 hover:bg-blue-600",
    yellow:
      "text-yellow-400 border-yellow-400 hover:text-yellow-50 hover:bg-yellow-400",
    red: "text-red-600 border-red-600 hover:text-red-50 hover:bg-red-600",
    emerald:
      "text-emerald-400 border-emerald-400 hover:text-emerald-50 hover:bg-emerald-400",
    indigo:
      "text-indigo-500 border-indigo-500 hover:text-indigo-50 hover:bg-indigo-500	",
  };

  const activeColors = {
    green: "border-green-600 bg-green-600 hover:bg-green-700",
    blue: "border-blue-600 bg-blue-600 hover:bg-blue-700",
    yellow: "border-yellow-400 bg-yellow-400 hover:bg-yellow-500",
    red: "border-red-600 bg-red-600 hover:bg-red-700",
    emerald: "border-emerald-400 bg-emerald-400 hover:bg-emerald-500",
    indigo: "border-indigo-500 bg-indigo-500 hover:bg-indigo-600",
  };

  const classValue = `md:text-base text-xs border rounded-md md:px-5 px-3 py-1 h-fit ${colors[color]}`; // string
  const activeClassValue = `md:text-base text-xs border rounded-md text-rose-50 md:px-5 px-3 py-1 h-fit ${activeColors[color]}`; // string

  const iconValue = `fa-solid fa-${icon}`; // string

  return (
    <button
      className={isActive ? activeClassValue : classValue}
      {...buttonProps}
    >
      {icon && <i className={iconValue}></i>} {text}
    </button>
  );
}

export default Button;
