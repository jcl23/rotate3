import {
  BufferGeometry,
  Color,
  CylinderGeometry,
  Line,
  LineBasicMaterial,
  Vector3,
} from "three";
import { CayleyGraphData, CayleyGraphEdges } from "./CayleyGraph";
import { GEN_COLORS } from "./cfg/colors";
import React, { SVGProps } from "react";
import { timerDelta } from "three/examples/jsm/nodes/Nodes.js";

type StaticGraphProps = {
  graphData: CayleyGraphData;
  textAttributes?: Record<string, any>;
}

export const StaticGraph = function ({graphData: { edges, vertices }, textAttributes = {} }: StaticGraphProps) {
  if (vertices === undefined) {
    throw new Error("[StaticGraph] vertices is undefined");
  }
  const toLine = ([from, to]: [Vector3, Vector3], color: string) => {
    if (color === undefined) {
      throw new Error("[StaticGraph] color is undefined");
    }
    const div = document.createElement("div");
    const length = from.distanceTo(to);
    let slope = (to.y - from.y) / (to.x - from.x);
    if (slope === Infinity) slope = 1000000;
    const angle = Math.atan(slope);
    const x = (from.x + to.x) / 2;
    const y = (from.y + to.y) / 2;
    const width = (to.x - from.x);
    const height = (to.y - from.y);
    // convert this to react style element 
    
    const arrowPosition = 0.4;
    const cx = from.x * arrowPosition + to.x * (1 - arrowPosition);
    const cy = from.y * arrowPosition + to.y * (1 - arrowPosition);
    return <polyline markerMid="url(#triangle)" points={`${from.x},${from.y} ${cx},${cy} ${to.x},${to.y}`} stroke={color} strokeWidth={3} />;
    
    
    return <div style={{
      // transform: `translate(${-width / 2 + x}px, ${height / 2 + y}px) rotate(${angle}rad)`,
      width: `${length / 2}%`,
      height: `${3}px`,
      background: color.getStyle(),
      position: "relative",
      marginTop: 0,
      zIndex: "100",
      borderRadius: "3px",
      transformOrigin: "left"
    }}/>;



  };


  const listToReturn = edges.map((list, listIndex) => list.map(([i, j]) => {
    let p1: Vector3, p2: Vector3;
    try {
      p1 = new Vector3(vertices[i].x, vertices[i].y, 0);
      p2 = new Vector3(vertices[j].x, vertices[j].y, 0);
    } catch (e) {
      throw new Error(`[StaticGraph] vertices[${i}] or vertices[${j}] is undefined, where vertices has length ${vertices.length}: `);
    }
    return (
      <React.Fragment key={`StaticGraph__edge[${i}][${j}]`}>
        {toLine([p1, p2], GEN_COLORS[listIndex % GEN_COLORS.length])}
      </React.Fragment>
    )
  })).flat(1);
  return (
    <>
      {listToReturn}
      {vertices.map((v, i) => {
                    return (
                        <g key={`StaticGraph__vertex[${i}]`}>
                            <circle
                                key={`CayleyGraph_circle#${i}`}
                                cx={v.x / 2 + "%"}
                                cy={v.y / 2 + "%"}
                                r={"1.5%"}
                                color="black"
                            />
                            <text x={v.x + 3} y={v.y + 2} {...textAttributes}>{i}</text>
                        </g>
                            )
                })}
      </>
  );
};
