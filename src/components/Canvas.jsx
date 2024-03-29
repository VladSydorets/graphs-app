import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "./Canvas.css";

const Canvas = ({
  nodes,
  links,
  setNodes,
  setLinks,
  colorValue,
  mode,
  setCorrectness,
  coloringMode,
  savePrevState,
}) => {
  const d3SVG = useRef();

  useEffect(() => {
    const svg = d3.select(d3SVG.current);
    const width = parseInt(d3.select("#canvas").style("width")) - 2.5;
    const height = parseInt(d3.select("#canvas").style("height")) - 2.5;
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);

    const radius = 16; // Radius of the node
    let mousedownNode = null;

    /**
     * Handles the click event on the SVG canvas.
     * Retrieves the coordinates using d3.pointer.
     * Creates a new node object.
     * Adds the newly created object to the existing array of 'nodes'.
     */
    const svgClick = (event, d) => {
      if (mode === "add") {
        savePrevState();
        if (event.defaultPrevented) return;
        let coords = d3.pointer(event);
        let newNode = {
          x: coords[0],
          y: coords[1],
          color: colorValue,
          id: nodes.length !== 0 ? nodes[nodes.length - 1].id + 1 : 1,
        };
        setNodes([...nodes, newNode]);
        checkCorrectness();
      }
    };

    svg.on("click", svgClick);

    const dragStarted = (event, d) => {
      if (mode === "drag") {
        if (!event.active) force.alphaTarget(0.1).restart();
        d.fx = event.x;
        d.fy = event.y;
      }
    };

    const dragged = (event, d) => {
      if (mode === "drag") {
        d.fx = event.x;
        d.fy = event.y;
      }
    };

    const dragEnded = (event, d) => {
      if (mode === "drag") {
        if (!event.active) force.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }
    };

    /**
     * Handles the click event on the nodes and links.
     * Depending on the 'mode' state, it performs a 'remove' or 'color'
     * action on the corresponding element.
     */
    const clicked = (event, d) => {
      if (event.defaultPrevented) return;

      if (mode === "remove") {
        savePrevState();
        let updatedNodes = [...nodes];
        let updatedLinks = [...links];

        if (event.currentTarget.tagName === "circle") {
          let index = nodes.indexOf(d);
          updatedNodes.splice(index, 1);

          // Remove connected links to the removed circle
          updatedLinks = updatedLinks.filter(
            (link) => link.target.index !== index
          );

          updatedLinks = updatedLinks.filter(
            (link) => link.source.index !== index
          );
        } else if (event.currentTarget.tagName === "line") {
          let index = links.indexOf(d);
          updatedLinks.splice(index, 1);
        }

        setLinks(updatedLinks);
        setNodes(updatedNodes);
      }

      if (mode === "color") {
        d.color = colorValue;
        savePrevState();

        d3.select(event.currentTarget)
          .transition()
          .attr(
            "fill",
            event.currentTarget.tagName === "circle" ? colorValue : d.color
          )
          .attr(
            "stroke",
            event.currentTarget.tagName === "line" ? colorValue : "black"
          )
          .attr("r", radius * 1.5)
          .transition()
          .attr("r", radius);
      }

      checkCorrectness();
    };

    // Drag line init
    let dragLine = svg
      .append("path")
      .attr("class", "dragLine hidden")
      .attr("stroke", colorValue)
      .attr("d", "M0,0L0,0");

    const beginDragLine = (event, d) => {
      if (mode === "connect") {
        if (event.target.hasPointerCapture(event.pointerId)) {
          event.target.releasePointerCapture(event.pointerId);
        }
        mousedownNode = d;
        dragLine
          .classed("hidden", false)
          .attr(
            "d",
            "M" +
              mousedownNode.x +
              "," +
              mousedownNode.y +
              "L" +
              mousedownNode.x +
              "," +
              mousedownNode.y
          );
      }
    };

    const updateDragLine = (event, d) => {
      if (!mousedownNode) return;
      let coords = d3.pointer(event);
      dragLine.attr(
        "d",
        "M" +
          mousedownNode.x +
          "," +
          mousedownNode.y +
          "L" +
          coords[0] +
          "," +
          coords[1]
      );
    };

    const hideDragLine = (event, d) => {
      dragLine.classed("hidden", true);
      mousedownNode = null;
    };

    const endDragLine = (event, d) => {
      if (mode === "connect") {
        savePrevState();
        if (!mousedownNode || mousedownNode === d) return;
        //return if link already exists
        for (let i = 0; i < links.length; i++) {
          let l = links[i];
          if (
            (l.source === mousedownNode && l.target === d) ||
            (l.source === d && l.target === mousedownNode)
          ) {
            return;
          }
        }
        let newLink = { source: mousedownNode, target: d, color: colorValue };
        setLinks([...links, newLink]);
      }
    };

    // Drag logic
    let drag = d3
      .drag()
      .on("start", dragStarted)
      .on("drag", dragged)
      .on("end", dragEnded);

    /**
     * Creates an edge, appends it to the SVG canvas,
     * and binds data from the 'links' state to it using D3.js methods
     */
    let edges = svg
      .append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("class", "edge")
      .attr("stroke", (d) => d.color)
      .on("click", clicked);

    /**
     * Creates a vertex, appends it to the SVG canvas,
     * and binds data from the 'nodes' state to it using D3.js methods.
     */
    let vertices = svg
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("class", "vertex")
      .attr("fill", (d) => d.color)
      .attr("stroke", "black")
      .attr("r", radius)
      .call(drag)
      .on("touchstart", beginDragLine)
      .on("pointerup", endDragLine)
      .on("pointerdown", beginDragLine)
      .on("click", clicked);

    /**
     * The 'tick' function is responsible for updating the positions
     * of edges and vertices on the SVG canvas according
     * to the current state of the 'nodes' and 'links'.
     */
    const tick = () => {
      checkCorrectness();
      edges
        .attr("x1", (d) => {
          return (d.source.x = Math.max(
            radius,
            Math.min(width - radius, d.source.x)
          ));
        })
        .attr("y1", (d) => {
          return (d.source.y = Math.max(
            radius,
            Math.min(height - radius, d.source.y)
          ));
        })
        .attr("x2", (d) => {
          return (d.target.x = Math.max(
            radius,
            Math.min(width - radius, d.target.x)
          ));
        })
        .attr("y2", (d) => {
          return (d.target.y = Math.max(
            radius,
            Math.min(height - radius, d.target.y)
          ));
        });

      vertices
        .attr("cx", (d) => {
          return (d.x = Math.max(radius, Math.min(width - radius, d.x)));
        })
        .attr("cy", (d) => {
          return (d.y = Math.max(radius, Math.min(height - radius, d.y)));
        });
    };

    /**
     * Performs a validity check on the correctness of the graph's coloring
     * according to the selected 'mode' of the application.
     */
    const checkCorrectness = () => {
      if (links.length < 1) setCorrectness(true);

      for (let link of links) {
        if (coloringMode === "vertices" || coloringMode === "total") {
          // check adjacent vertices
          if (link.source.color === link.target.color) {
            setCorrectness(false);
            return;
          }
        }
        if (coloringMode === "total") {
          // check edges and vertices
          if (
            link.color === link.source.color ||
            link.color === link.target.color
          ) {
            setCorrectness(false);
            return;
          }
        }
        if (coloringMode === "edges" || coloringMode === "total") {
          // check adjacent edges
          for (let l of links) {
            if (link === l) continue;
            if (
              link.source.id === l.target.id ||
              link.source.id === l.source.id ||
              link.target.id === l.source.id ||
              link.target.id === l.target.id
            ) {
              if (link.color === l.color) {
                setCorrectness(false);
                return;
              }
            }
          }
        }
      }

      setCorrectness(true);
    };

    // The following code sample sets up a force and collide simulation using D3.js.
    let force = d3
      .forceSimulation()
      .force("link", d3.forceLink().distance(0).strength(0))
      .force("collide", d3.forceCollide(16).strength(1))
      .on("tick", tick);

    force.nodes(nodes);
    force.force("link").links(links);

    svg
      .on("pointermove", updateDragLine)
      .on("pointerup", hideDragLine)
      .on("pointerleave", hideDragLine);
  }, [
    nodes,
    links,
    setLinks,
    setNodes,
    colorValue,
    mode,
    setCorrectness,
    coloringMode,
    savePrevState,
  ]);

  return (
    <div id="canvas">
      <svg
        ref={d3SVG}
        className="rounded border border-black"
        style={{ width: "100%", height: "500px" }}
      ></svg>
    </div>
  );
};

export default Canvas;
