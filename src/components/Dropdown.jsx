import React from "react";
import { useTranslation } from "react-i18next";

const Dropdown = () => {
  const { i18n, t } = useTranslation();

  const handleChange = (e) => {
    i18n.changeLanguage(e.currentTarget.value);
  };

  return (
    <div className="relative w-24 lg:max-w-sm ">
      <select
        onChange={handleChange}
        className=" text-white text-sm outline-none border rounded-lg block w-fit p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400"
      >
        <option className="bg-gray-700" value={"en"}>
          {t("english")}
        </option>
        <option className="bg-gray-700" value={"sk"}>
          {t("slovak")}
        </option>
        <option className="bg-gray-700" value={"uk"}>
          {t("ukrainian")}
        </option>
      </select>
    </div>
  );
};

export default Dropdown;
