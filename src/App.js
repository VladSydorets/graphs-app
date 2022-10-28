import Navbar from "./components/Navbar";
import Button from "./components/Button";
import SidePanel from "./components/SidePanel";
import Canvas from "./components/Canvas";
import { useState } from "react";
import { ColorPicker } from "./components/ColorPicker";
import { useTranslation } from "react-i18next";
import { saveSvgAsPng } from "save-svg-as-png";

function App() {
  let [colorValue, setColorValue] = useState("#000000");

  const [nodes, setNodes] = useState([
    { id: 1, color: "#FCDC00", x: 20, y: 15 },
    { id: 2, color: "#4D4D4D", x: 170, y: 45 },
    { id: 3, color: "#653294", x: 200, y: 85 },
    { id: 4, color: "#F44E3B", x: 170, y: 45 },
    { id: 5, color: "#FB9E00", x: 220, y: 55 },
  ]);

  const [links, setLinks] = useState([
    { source: 0, target: 3, color: "#FCDC00" },
    { source: 0, target: 2, color: "#4D4D4D" },
    { source: 1, target: 2, color: "#653294" },
    { source: 1, target: 3, color: "#F44E3B" },
    { source: 2, target: 4, color: "#FB9E00" },
    { source: 3, target: 4, color: "#DBDF00" },
    { source: 1, target: 4, color: "#A4DD00" },
    { source: 2, target: 3, color: "#16A5A5" },
  ]);

  const handleClear = () => {
    setNodes([]);
    setLinks([]);
  };

  const [mode, setMode] = useState("drag"); // string
  const [correctness, setCorrectness] = useState(true); // boolean
  const { t } = useTranslation();

  const instructions = [
    t("first-instruction"),
    t("second-instruction"),
    t("third-instruction"),
    t("fourth-instruction"),
  ];

  const handleExport = () => {
    saveSvgAsPng(document.querySelector("svg"), "graph.png", {
      backgroundColor: "white",
      encoderOptions: 1,
      left: 20,
    });
  };

  return (
    <div className="bg-pink-50 h-fit xl:h-full">
      <Navbar title={t("title-name")} />
      <div className="flex lg:flex-row flex-col-reverse gap-4 py-10 lg:px-20 px-2 h-fit">
        <SidePanel
          title={t("instruction-title")}
          instructions={instructions}
          text={t("correctness-text")}
          correctness={correctness}
        />
        <div className="right-side flex flex-col w-full">
          <div className="flex flex-wrap justify-center gap-2 m-2 btns ">
            <Button
              text={t("add-btn")}
              icon="plus"
              color={"green"}
              isActive={mode === "add" ? true : false}
              onClick={() => setMode(mode === "add" ? "drag" : "add")}
            />
            <Button
              text={t("clear-btn")}
              icon="trash-can"
              color={"red"}
              onClick={handleClear}
            />
            <Button
              text={t("remove-btn")}
              icon="xmark"
              color={"red"}
              isActive={mode === "remove" ? true : false}
              onClick={() => setMode(mode === "remove" ? "drag" : "remove")}
            />
            <Button
              text={t("connect-btn")}
              icon="circle-nodes"
              color={"blue"}
              isActive={mode === "connect" ? true : false}
              onClick={() => setMode(mode === "connect" ? "drag" : "connect")}
            />
            <Button
              text={t("export-btn")}
              icon="file-export"
              color={"yellow"}
              isActive={mode === "export" ? true : false}
              onClick={handleExport}
            />
            <ColorPicker
              color={"emerald"}
              colorValue={colorValue}
              setColorValue={setColorValue}
              mode={mode}
              setMode={setMode}
            />
            <Button
              text={t("drag-btn")}
              icon="up-down-left-right"
              color={"indigo"}
              isActive={mode === "drag" ? true : false}
              onClick={() => setMode("drag")}
            />
          </div>
          <Canvas
            nodes={nodes}
            links={links}
            colorValue={colorValue}
            mode={mode}
            setNodes={setNodes}
            setLinks={setLinks}
            setCorrectness={setCorrectness}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
