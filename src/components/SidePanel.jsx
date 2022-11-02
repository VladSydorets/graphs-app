import React from "react";
import { useTranslation } from "react-i18next";

const SidePanel = (props) => {
  const { t } = useTranslation();
  const textColor = props.correctness ? "text-green-600" : "text-red-600"; // string
  const text = props.correctness ? t("correct") : t("wrong"); // string
  const instructions = t("instructions", { returnObjects: true });

  return (
    <div className="rounded border border-black py-6 px-8 flex flex-col justify-between items-start sm:w-full lg:w-2/6 h-auto gap-10 lg:gap-0">
      <div className="text-instructions w-full dark:text-rose-50">
        <h3 className="text-4xl font-semibold mb-4 text-center">
          {props.title}
        </h3>
        <ul className="lg:text-start text-center md:text-base text-sm flex flex-col gap-2">
          {instructions.map((instruction) => (
            <li key={instruction}>{instruction}</li>
          ))}
        </ul>
      </div>
      <p className="subtext dark:text-rose-50 font-normal self-center text-center text-lg my-6">
        {props.text} <span className={textColor}>{text}</span>
      </p>
    </div>
  );
};

export default SidePanel;
