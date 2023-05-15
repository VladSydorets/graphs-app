import React from "react";
import Button from "./Button";
import { GithubPicker } from "react-color";
import { useState } from "react";
import { t } from "i18next";

export const ColorPicker = ({ color, setColorValue, setMode, mode }) => {
  const colors = [
    "#000000",
    "#4D4D4D",
    "#653294",
    "#F44E3B",
    "#FB9E00",
    "#FCDC00",
    "#DBDF00",
    "#A4DD00",
    "#16A5A5",
    "#73D8FF",
    "#009CE0",
    "#7B64FF",
    "#FA28FF",
    "#CCCCCC",
  ]; // array of strings(hex color values)

  // Additional styling needed for the color picker
  const popover = {
    position: "absolute",
    zIndex: "2",
  };

  const cover = {
    position: "fixed",
    top: "0px",
    right: "0px",
    bottom: "0px",
    left: "0px",
  };

  let [displayColorPicker, setDisplayColorPicker] = useState(false); // boolean

  const handleColorPickerOpen = () => {
    setDisplayColorPicker({ displayColorPicker: !displayColorPicker });
  };

  const handleColorPickerClose = () => {
    setDisplayColorPicker((displayColorPicker = false));
  };

  const handleChangeComplete = (color, event) => {
    setColorValue(color.hex);
  };

  return (
    <div>
      <Button
        text={t("color-btn")}
        icon={"palette"}
        color={color}
        isActive={mode === "color" ? true : false}
        onClick={() => {
          setMode("color");
          handleColorPickerOpen();
        }}
      />
      {displayColorPicker ? (
        <div style={popover}>
          <div style={cover} onClick={handleColorPickerClose} />
          <GithubPicker
            width="187px"
            colors={colors}
            onChangeComplete={handleChangeComplete}
          />
        </div>
      ) : null}
    </div>
  );
};
