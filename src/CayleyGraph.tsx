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
import { useSpring, useSpringValue } from "@react-spring/three";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { easings } from "@react-spring/three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Step } from "./Shape";
import { Pointer } from "./CayleyGraphPointer";
import { Transform } from "./Display";
import { MyCamera } from "./Camera";
import { defaultShapes } from "./DefaultMeshes";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { StaticGraph } from "./StaticGraph";
export type CayleyGraphVertex = {
  position: Vector2;
  index: number;
};

export type CayleyGraphEdges = [number, number][][];

export type CayleyGraphProps = {
  graphVertices: CayleyGraphVertex[];
  graphEdges: CayleyGraphEdges;
  transform: Indexed<Transform>;
};

export const CayleyGraph = function ({
  transform: { index, value },
  graphVertices,
  graphEdges,
}: CayleyGraphProps): JSX.Element {

  if (value == null) throw new Error("[CayleyGraph] transform.value is null");
  if (graphVertices == null) throw new Error("[CayleyGraph] graphVertices is null");

  const ptrRef = useRef(null);

  const [localStepIndex, setLocalStepIndex] = useState(0);

  const reindex = manualReindexArrays.box;
  const monoidElementToPosition = (index: number): Vector3 => {
    const vertex = graphVertices[index];
    if (vertex === undefined) {
      throw new Error(`vertex is undefined for element ${index}`);
    }
    return new Vector3(
      -0.8 + 0.008 * vertex.position.x,
      0.8 - 0.008 * vertex.position.y,
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

  const initialEdgesList: [number, number][] = graphEdges
    .flat()
    .map(([from, to]) => [
      manualReindexArrays.box[from],
      manualReindexArrays.box[to],
    ]);
  
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
                {graphVertices.map(({position, index}, i) => {
                    return (
                        <>
                            <circle
                                key={`CayleyGraph_circle#${i}`}
                                cx={position.x}
                                cy={position.y}
                                r={1}
                                color="black"
                            />
                            <text x={position.x + 3} y={position.y + 2} fontSize="0.6em">{index}</text>
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
              <StaticGraph
                graphEdges={graphEdges
                  .map(list => list
                  .map(([i, j]) => [
                    monoidElementToPosition(i),
                    monoidElementToPosition(j),
                  ]))}
              />
            </Canvas>
          </div>
        </div>
      </div>
  );
};
