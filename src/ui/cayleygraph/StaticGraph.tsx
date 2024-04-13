import { Vector3 } from "three";
import { CayleyGraphData, CayleyGraphEdges } from "./CayleyGraph";
import { edgeColors, edgeHues } from "../../cfg/colors";
import React, { MutableRefObject, SVGProps } from "react";
import { MathComponent } from "mathjax-react";
import Controls from "../../App";
type StaticGraphProps = {
  graphData: CayleyGraphData;
  selected: number;
  textAttributes?: Record<string, any>;
};
const sun_angle = new Vector3(-1, -2, 0).normalize();

export const StaticGraph = function ({
  graphData: { edges, vertices },
  selected = -1,
  textAttributes = {},
}: StaticGraphProps) {
  const WIDTH = 200;
  const PADDING_WIDTH = 20;
  const PADDING_RESCALE = 0.8333;
  if (vertices === undefined) {
    throw new Error("[StaticGraph] vertices is undefined");
  }
  const toLine = ([from, to]: [Vector3, Vector3], generatorIndex: number) => {
    if (generatorIndex === undefined) {
      throw new Error("[StaticGraph] generatorIndex is undefined");
    }
    let hue = edgeHues[generatorIndex % edgeColors.length];
    const color = `hsla(${hue}, 100%, ${50}%, 1)`;
    const glassColor = `hsla(${hue}, 100%, ${80}%, 0.6)`;
    const div = document.createElement("div");
    const length = from.distanceTo(to);
    let slope = (to.y - from.y) / (to.x - from.x);
    if (slope === Infinity) slope = 1000000;
    // convert this to react style element
    // const a = 0.0000223286;
    // const b = -0.00513515
    // const c = 0.849109;
    const a=0.0000249331;
    const b=-0.0056392;
    const c=0.871474;
    const arrowPosition = a * length ** 2 + b * length + c;
    const cx = from.x * arrowPosition + to.x * (1 - arrowPosition);
    const cy = from.y * arrowPosition + to.y * (1 - arrowPosition);
    
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    
    //let normal = new Vector3(to.y - from.y, from.x - to.x, 0).normalize();
    const normal = new Vector3(-Math.sin(angle), Math.cos(angle), 0);
    
    if ((to.y - from.y) * (from.x - to.x) <= 0) {
      normal.multiplyScalar(-1);
    }
    let shift = 1;
    let shiftX = normal.x * shift;
    let shiftY = normal.y * shift;
    // calculate dot product of normal with shift
    let dot = normal.dot(sun_angle);
    // if (dot < 0) dot = -dot;
  
    const bright = (0.5 + 0.2 * dot) * 100;
    const dark = (0.5 + 0.2 * dot) * 100;
    const brightColor = `hsl(${hue}, ${100}%, ${bright}%)`;
    const darkColor = `hsl(${hue}, ${100}%, ${dark}}%)`;
    return (
      <>
      <polyline

points={`${from.x},${from.y} ${cx},${cy} ${to.x},${to.y}`}
stroke={glassColor}
strokeWidth={6}
/>
      <polyline
        markerMid={`url(#triangle${generatorIndex})`}
        vector-effect="non-scaling-stroke"
        points={`${from.x},${from.y} ${cx},${cy} ${to.x},${to.y}`}
        stroke={color}
        strokeWidth={3}
        />
        {/* 
      <line
        x1={from.x + shiftX}
        y1={from.y + shiftY}
        x2={to.x + shiftX}
        y2={to.y + shiftY}
        stroke={brightColor}
        strokeWidth={1.5}
        /> 
        
      <line
        x1={from.x - shiftX}
        y1={from.y - shiftY}
        x2={to.x - shiftX}
        y2={to.y - shiftY}
        stroke={darkColor}
        strokeWidth={1.5}
      /> 
    */}
      


        </>
    );
  };

  const listToReturn = edges
    .map((list, listIndex) =>
      list.map(([i, j]) => {
        let p1: Vector3, p2: Vector3;
        try {
          p1 = new Vector3(vertices[i].x, vertices[i].y, 0);
          p2 = new Vector3(vertices[j].x, vertices[j].y, 0);
        } catch (e) {
          throw new Error(
            `[StaticGraph] vertices[${i}] or vertices[${j}] is undefined, where vertices has length ${vertices.length}: `
          );
        }
        return (
          <React.Fragment key={`StaticGraph__edge[${i}][${j}]`}>
            {toLine([p1, p2], listIndex)}
          </React.Fragment>
        );
      })
    )
    .flat(1);
  return (
    <>
      {listToReturn}
    </>
  );
};
