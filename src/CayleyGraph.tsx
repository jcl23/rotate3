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
import { Transform } from "./Display";
import { MyCamera } from "./Camera";
import { StaticGraph } from "./StaticGraph";

export type CayleyGraphVertex = Vector2;

export type CayleyGraphEdges = [number, number][][];

export type CayleyGraphData = {
  vertices: CayleyGraphVertex[];
  edges: CayleyGraphEdges;
};
export type CayleyGraphProps = CayleyGraphData & {
  transform: Indexed<E3>;
};

export const CayleyGraph = function ({
  transform: { index, value },
  vertices,
  edges,
}: CayleyGraphData & {transform: {index: number, value: Transform}}): JSX.Element {

  if (value == null) throw new Error("[CayleyGraph] transform.value is null");
  if (vertices == null) throw new Error("[CayleyGraph] vertices is null");

  const ptrRef = useRef(null);

  const [localStepIndex, setLocalStepIndex] = useState(0);

  const reindex = manualReindexArrays.box;
  function monoidElementToPosition (index: number): Vector3 {
    const vertex = vertices[index];
    if (vertex === undefined) {
      throw new Error(`vertex is undefined for element ${index}`);
    }
    return new Vector3(
      -0.8 + 0.008 * vertex.x,
      0.8 - 0.008 * vertex.y,
      0
    );
  };

  const [indexedStep, setIndexedStep] = useState<Step<Vector3>>({
    from: monoidElementToPosition(0),
    to: monoidElementToPosition(0),
  });

  useEffect(() => {
    if (indexedStep.to.distanceTo(monoidElementToPosition(index)) < 0.001)
      return;
    setIndexedStep({
      from: indexedStep.to,
      to: monoidElementToPosition(index),
    });
    console.log(
      "reporting from CayleyGraph: current index is",
      index,
      "current value is",
      value
    );
  }, [value]);

  /* Three stuff
   */

  const stableComponent = useMemo(() => {
    console.log("refresh");
    return <Pointer ref={ptrRef} transform={indexedStep} />;
  }, [indexedStep, value]);

  const initialEdgesList: [number, number][][] = edges
    .map(list => list.map(([from, to]) => [
      manualReindexArrays.box[from],
      manualReindexArrays.box[to],
    ]));
  
    const [edgesList, setEdgesList] = useState(initialEdgesList);

    console.log("edgesList", edgesList);

  return (
      <div>
        <div
          style={{
            width: "100%",
            aspectRatio: "1/1",
          }}
        >
          
            <svg viewBox="-20 -20 240 240" width={240} height={240} style={{margin: 0, padding: 0, width:"100%", height: "100%", background: "white"}}>
                {vertices.map((v, i) => {
                    return (
                        <>
                            <circle
                                key={`CayleyGraph_circle#${i}`}
                                cx={v.x}
                                cy={v.y}
                                r={1}
                                color="black"
                            />
                            <text x={v.x + 3} y={v.y + 2} fontSize="0.6em">{index}</text>
                        </>
                            )
                })}
            </svg>
            
          <div style={{marginTop:"-100%"}}>
            <Canvas
              style={{
                width: "100%",
                height: "100%",
                aspectRatio: "1/1",
                display: "inherit",
                marginTop: "-100%",
                background: "transparent",
              }}
              // camera={camera}
            >
              <MyCamera type={"orthogonal"} props={{ position: [0, 1, 0] }} />
              <ambientLight />
              <pointLight position={[0, 4, 2]} intensity={20} />

              {stableComponent}
            </Canvas>
            <StaticGraph
              edges={edges}
              vertices={vertices}
            />
          </div>
        </div>
      </div>
  );
};
