import { Quaternion, Vector2, Vector3 } from "three";
// import { ShapeDisplay } from "./Shape";
import { Transform } from "./Display";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { ShapeDisplay } from "./ShapeDisplay";

type GraphProps = {
  vertices: Vector2[];
  currentVertex: number;
  edges: [number, number][];
  stepIndex: number;    
};
const makeTransformFromVertex = function (vertex: Vector2) {
    return {
        position: new Vector3(vertex.x, vertex.y, 0),
        rotation: new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), 0)
    } as Transform 
}
export const GraphDisplay = function ({
  currentVertex,
  vertices,
  edges,
  stepIndex,
  ...props
}: GraphProps) {

  return (
    <ShapeDisplay
      shape={"ball"}
      transform={makeTransformFromVertex(vertices[currentVertex])}
      stepIndex={stepIndex}
      cameraType={"orthographic"}
    >
    {edges.map(([from, to], i) => { 
        return <mesh key={`GraphDisplay_edge#${i}`}>
            <edgesGeometry args={[new LineGeometry().setFromPoints([from, to])]} />
            <lineBasicMaterial/>
        </mesh>
    })}
      <mesh>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color={"red"} />
      </mesh>
    </ShapeDisplay>
  );
};
