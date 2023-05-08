import Navbar from "./components/Navbar";
import Button from "./components/Button";
import SidePanel from "./components/SidePanel";
import Canvas from "./components/Canvas";
import { useState } from "react";
import { ColorPicker } from "./components/ColorPicker";
import { useTranslation } from "react-i18next";
import { saveSvgAsPng } from "save-svg-as-png";

function App() {
  const [colorValue, setColorValue] = useState("#000000"); // string(hex color value)
  const [darkToggle, setDarkToggle] = useState(false); // boolean
  const [mode, setMode] = useState("drag"); // string("drag", "add", "connect", "remove", "color")
  const [coloringMode, setColoringMode] = useState("total"); // string("total", "edges", "vertices")
  const [correctness, setCorrectness] = useState(true); // boolean
  const { t } = useTranslation();

  // Initial data to display
  const [nodes, setNodes] = useState([
    { id: 1, color: "#FCDC00", x: 200, y: 200 },
    { id: 2, color: "#4D4D4D", x: 600, y: 300 },
    { id: 3, color: "#653294", x: 350, y: 300 },
    { id: 4, color: "#F44E3B", x: 350, y: 100 },
    { id: 5, color: "#FB9E00", x: 600, y: 100 },
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

  const [prevNodes, setPrevNodes] = useState([nodes]);
  const [prevLinks, setPrevLinks] = useState([links]);

  const savePrevState = () => {
    let newPrevNodes = [...prevNodes, nodes];
    setPrevNodes(newPrevNodes);

    let newPrevLinks = [...prevLinks, links];
    setPrevLinks(newPrevLinks);
  };

  const handleAddClick = () => {
    setMode(mode === "add" ? "drag" : "add");
  };

  const handlePreviousState = () => {
    if (prevNodes.length !== 0 || prevLinks.length !== 0) {
      setNodes(prevNodes[prevNodes.length - 1]);
      setLinks(prevLinks[prevLinks.length - 1]);

      let newPrevNodes = prevNodes;
      newPrevNodes.pop();
      let newPrevLinks = prevLinks;
      newPrevLinks.pop();

      setPrevNodes(newPrevNodes);
      setPrevLinks(newPrevLinks);
    }
  };

  // Empties nodes and links
  const handleClear = () => {
    savePrevState();
    setNodes([]);
    setLinks([]);
  };

  // Handles export functionality using saveSvgAsPng package
  const handleExport = () => {
    saveSvgAsPng(document.querySelector("svg"), "graph.png", {
      backgroundColor: "white",
      encoderOptions: 1,
      left: 20,
    });
  };

  return (
    <div className="dark:bg-slate-800 bg-white h-fit xl:h-full transition-colors duration-500">
      <Navbar
        title={t("title-name")}
        darkToggle={darkToggle}
        setDarkToggle={setDarkToggle}
      />
      <div className="flex lg:flex-row flex-col-reverse gap-4 py-10 lg:px-20 px-2 h-fit">
        <SidePanel
          title={t("instruction-title")}
          text={t("correctness-text")}
          correctness={correctness}
        />
        <div className="right-side flex flex-col w-full">
          <div className="flex flex-wrap justify-start gap-2 m-2 btns ">
            <div className="flex justify-center gap-2">
              <Button
                text={""}
                icon="rotate-left"
                color={"indigo"}
                onClick={handlePreviousState}
              />
              {/* <Button text={""} icon="rotate-right" color={"indigo"} /> */}
            </div>
            <div className="flex justify-center gap-2">
              <Button
                text={t("add-btn")}
                icon="plus"
                color={"green"}
                isActive={mode === "add" ? true : false}
                onClick={handleAddClick}
                // onClick={() => setMode(mode === "add" ? "drag" : "add")}
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
            <div className="flex justify-center gap-2">
              <Button
                text={t("total-btn")}
                color={"red"}
                isActive={coloringMode === "total" ? true : false}
                onClick={() => setColoringMode("total")}
              />
              <Button
                text={t("edges-btn")}
                color={"red"}
                isActive={coloringMode === "edges" ? true : false}
                onClick={() => setColoringMode("edges")}
              />
              <Button
                text={t("vertices-btn")}
                color={"red"}
                isActive={coloringMode === "vertices" ? true : false}
                onClick={() => setColoringMode("vertices")}
              />
            </div>
          </div>

          <Canvas
            nodes={nodes}
            links={links}
            colorValue={colorValue}
            mode={mode}
            setNodes={setNodes}
            setLinks={setLinks}
            setCorrectness={setCorrectness}
            coloringMode={coloringMode}
            savePrevState={savePrevState}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
