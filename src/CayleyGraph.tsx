import {
  BufferGeometry,
  Line,
  Line3,
  LineBasicMaterial,
  LineSegments,
  Vector2,
  Vector3,
} from "three";
import { Monoid } from "./monoid/Monoid";
import { Indexed } from "./monoid/IndexedMonoid";
import { manualReindexArrays } from "./logic/cayleyTables";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { easings } from "@react-spring/three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Step } from "./Shape";
import { Pointer } from "./CayleyGraphPointer";

import { MyCamera } from "./Camera";
import { StaticGraph } from "./StaticGraph";

export type CayleyGraphVertex = { x: number; y: number };

export type CayleyGraphEdges = [number, number][][];

export type CayleyGraphData = {
  vertices: CayleyGraphVertex[]; // list of vertices
  edges: CayleyGraphEdges; // list of lists of pairs of indices
};
export type CayleyGraphProps = CayleyGraphData & {
  currentIndex: number;
};

const temp_map = (step: Step<CayleyGraphVertex>): Step<{x: string, y: string}> => {
  const fix = (n: number): string => n / 2 + "%";
  return {
    from: { x: fix(step.from.x), y: fix(step.from.y) },
    to: { x: fix(step.to.x), y: fix(step.to.y) },
  }
}
export const CayleyGraph = function ({
  currentIndex,
  vertices,
  edges,
}: CayleyGraphProps): JSX.Element {
  if (currentIndex === null)
    throw new Error("[CayleyGraph] currentIndex is null");
  if (vertices == null) throw new Error("[CayleyGraph] vertices is null");

  const ptrRef = useRef(null);

  const [localStepIndex, setLocalStepIndex] = useState(0);

  const reindex = manualReindexArrays.box;
  function monoidElementToPosition(index: number): Vector3 {
  const vertex = vertices[index];
    if (vertex === undefined) {
      throw new Error(`vertex is undefined for element ${index}`);
    }
    return new Vector3(vertex.x * 1, vertex.y, 0);
  }

  
  const [indexedStep, setIndexedStep] = useState<Step<CayleyGraphVertex>>({
    from: monoidElementToPosition(0),
    to: monoidElementToPosition(0),
  });

  const value = vertices[currentIndex];
  useEffect(() => {
    if (
      indexedStep.to.distanceTo(monoidElementToPosition(currentIndex)) < 0.001
    )
      return;
    setIndexedStep({
      from: indexedStep.to,
      to: monoidElementToPosition(currentIndex),
    });
    console.log(
      "reporting from CayleyGraph: current index is",
      currentIndex,
      "current value is",
      value
    );
  }, [currentIndex, vertices]);

  /* Three stuff
   */

  const stableComponent = useMemo(() => {
    console.log(
      "%c refresh",
      `font-size: 1.5em; color: ${~~(Math.random() * 16 ** 6).toFixed(16)};`
    );

    return <Pointer transform={temp_map(indexedStep)} />;
  }, [indexedStep]);

  const initialEdgesList: [number, number][][] = edges.map((list) =>
    list.map(([from, to]) => [
      manualReindexArrays.box[from],
      manualReindexArrays.box[to],
    ])
  );

  const [edgesList, setEdgesList] = useState(initialEdgesList);

  return (
    <div
      className={"CayleyGraph"}
      style={{
        width: "240px",
        aspectRatio: "1/1",
        display: "grid",
        position: "relative",
      }}
    >
      <svg viewBox="0 0 200 200" width={240} height={240}>
        <defs>
          <marker
            id="triangle"
            viewBox="0 0 10 10"
            refX="1"
            refY="5"
            markerUnits="strokeWidth"
            markerWidth="5"
            markerHeight="10"
            orient="auto"
            style={{zIndex:100}}
          >
            <path d="M 3 1 L 6 5 L 3 9 z" fill="#fff" />
          </marker>
        </defs>
        <StaticGraph
          graphData={{ edges, vertices }}
          textAttributes={{ fontSize: "80%", transform: "translate(5, -5)" }}
        />
      </svg>
      {stableComponent}
    </div>
  );
};
