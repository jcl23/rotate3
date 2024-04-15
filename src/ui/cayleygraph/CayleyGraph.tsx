import {
  BufferGeometry,
  Line,
  Line3,
  LineBasicMaterial,
  LineSegments,
  Vector2,
  Vector3,
} from "three";
import { Monoid } from "../../monoid/Monoid";
import { Indexed } from "../../monoid/IndexedMonoid";
import { manualReindexArrays } from "../../logic/cayleyTables";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { easings } from "@react-spring/three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Step } from "../../Shape";
import { Pointer } from "./CayleyGraphPointer";

import { MyCamera } from "../../Camera";
import { StaticGraph } from "./StaticGraph";
import { edgeColors } from "../../cfg/colors";
import { MathComponent } from "mathjax-react";
import { Controls } from "../../App";
import { MemoizedMathJax } from "../MemoizedMathJax";

export type CayleyGraphVertex = { x: number; y: number, name?: string };

const vertexDistance = (a: CayleyGraphVertex, b: CayleyGraphVertex) => {
 return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}
export type CayleyGraphEdges = [number, number][][];

export type CayleyGraphData = {
  vertices: CayleyGraphVertex[]; // list of vertices
  edges: CayleyGraphEdges; // list of lists of pairs of indices
  status: boolean;
};
export type CayleyGraphProps = CayleyGraphData & {
  currentIndex: number;
  vertexNames: string;
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
  vertexNames,
  status
}: CayleyGraphProps): JSX.Element {

if (status == false) return <div 
  className={"CayleyGraph__outer labelled not-ready"}
  style={{
    height: "calc(100% - 2* 20px)",
  }}
>
    Graph is not ready
</div>


  if (currentIndex === null)
    throw new Error("[CayleyGraph] currentIndex is null");
  if (vertices == null) throw new Error("[CayleyGraph] vertices is null");

  const ptrRef = useRef(null);
  const graphRef = useRef(null);

  const [localStepIndex, setLocalStepIndex] = useState(0);

  const reindex = manualReindexArrays.box;
  function monoidElementToPosition(index: number): CayleyGraphVertex {
  const vertex = vertices[index];
    if (vertex === undefined) {
      throw new Error(`vertex is undefined for element ${index}`);
    }
    const vec = new Vector3(vertex.x * 1, vertex.y, 0);
    return { x: vec.x, y: vec.y, name: vertex.name };
  }

  
  const [indexedStep, setIndexedStep] = useState<Step<CayleyGraphVertex>>({
    from: monoidElementToPosition(0),
    to: monoidElementToPosition(0),
  });
  const value = vertices[currentIndex];

  // get the current width of the selected vertex, by navigating down from graphRef.
  const refObj = graphRef.current;
  const width = refObj ? refObj.getBoundingClientRect().width : 28;
  // console.log({current: graphRef.current})
  useEffect(() => {
    if (
      vertexDistance(indexedStep.to, monoidElementToPosition(currentIndex)) < 0.001
    )
      return;
    setIndexedStep({
      from: indexedStep.to,
      to: monoidElementToPosition(currentIndex),
    });
    /* console.log(
      "reporting from CayleyGraph: current index is",
      currentIndex,
      "current value is",
      value
    );*/
  }, [currentIndex, vertices]);

  /* Three stuff
   */

  const stableComponent = useMemo(() => {
    return <Pointer width={width ?? 0} transform={temp_map(indexedStep)} text={vertices[currentIndex].name} />;
  }, [indexedStep, currentIndex]);

  const initialEdgesList: [number, number][][] = edges.map((list) =>
    list.map(([from, to]) => [
      manualReindexArrays.box[from],
      manualReindexArrays.box[to],
    ])
  );
  
  const [edgesList, setEdgesList] = useState(initialEdgesList);
  
  const getVertexStyleData = () => {
    // at the ref, the circle inside the group
    const circle = graphRef.current?.children[0];
    // console.log("circle", circle);
  };
  
  const VertexDisplay = ({vertex}) => {

    if (vertexNames === "none") return null;
    if (vertexNames === "selected" && currentIndex !== vertices.indexOf(vertex)) return null;    
    return (
        <MemoizedMathJax className={"labelled vertexLabel"} formula={vertex.name} />
    );
  }
  const WIDTH = 200;
  const PADDING_WIDTH = 20;
  const PADDING_RESCALE = 0.8333;

  const numGenerators = edgesList.length;
  const markerHeight = 10;
  const markerWidth = 15;

  const trianglePathText = `M ${3 * markerWidth / 5} ${2 * markerHeight / 10} L ${6 * markerWidth / 5} ${10 * markerHeight / 10} L ${3 * markerWidth / 5} ${18 * markerHeight / 10} z`
  const markerStyle = {
    viewBox: "0 0 10 20",
    refX: "1",
    refY: "10",
    markerUnits: "strokeWidth",
    markerWidth,
    markerHeight,
    orient:"auto",
    style:{zIndex:100}
  }
  useEffect(() => {
    console.warn("VertexNames changed", vertexNames);
  }, [vertexNames]);
  return (

    <div 
    className={"CayleyGraph__outer labelled"}
    style={{
      padding: "20px",
      height: "calc(100% - 2* 20px)",
    }}>
    <div
      className={"CayleyGraph"}
      style={{
        display: "grid",
        position: "relative",  
        aspectRatio: "1"
      }}
    >
     



      <svg viewBox="0 0 200 200" width={"100%"} height={"100%"} preserveAspectRatio="none">
        <defs>
        {/*edgesList.map((list, listIndex) =>
          <marker
            id={"triangle" + listIndex}
            {...markerStyle}
          >
            <path d="M 3 1 L 6 5 L 3 9 z" fill={edgeColors[listIndex]} />
          </marker>
    )*/}
        <marker
            id={"triangle0"}
            {...markerStyle}
          >
            <path d={trianglePathText} fill={edgeColors[0]} />
          </marker>
        
          <marker
            id={"triangle1"}
            {...markerStyle}
          >
            <path d={trianglePathText} fill={edgeColors[1]} />
          </marker>
    
        </defs>

        <StaticGraph
          
          selected={currentIndex}
          graphData={{ edges, vertices }}
          textAttributes={{ fontSize: "60%", transform: "translate(5, -5)" }}
        />
      </svg>
      <div style={{
        position: "absolute",
        width: "100%",
        height: "100%"
      }}>

        {vertices.map((v, i) => {

          return  <div 
          className="label"
          key={`StaticGraph__vertex[${i}]`} ref={i == currentIndex ? graphRef : null}
          style={{
            left: `calc(${v.x / 2}%)`, top: `calc(${v.y / 2}%`, transform: `translate(-50%,-50%`,position: 'absolute', fontSize: "15px", textShadow: "1px 1px 1px white"
          }}>
            <VertexDisplay vertex={v} />
          </div>
          /*return (
            <MathComponent className={"tex2jax_process"}  tex={v.name ?? ""}  />
            <g>
              <circle
                key={`CayleyGraph_circle#${i}`}
                cx={v.x / 2 + "%"}
                cy={v.y / 2 + "%"}
                r={"2%"}
                fill={"white"}
                />
            
              <foreignObject 
                width={WIDTH + 2 * PADDING_WIDTH} height={WIDTH + 2 * PADDING_WIDTH} 
                
                className="label"
                >
                <div style={{
                  left: `calc(${v.x / 2 * PADDING_RESCALE}% + ${PADDING_WIDTH}px)`, top: `calc(${v.y / 2 * PADDING_RESCALE}%  + ${PADDING_WIDTH}px)`, transform: `translate(-50%,-50%`,position: 'absolute', fontSize: "9px", textShadow: "1px 1px 1px white"
                }}>

                <MathComponent className={"tex2jax_process"}  tex={v.name ?? ""}  />
                </div>
              </foreignObject>
    
              
              {
              <text x={v.x} y={v.y + 2} {...textAttributes}>
              {v.name}
              </text>
            }
            </g>
          
          );*/
        })}
      </div>
      {stableComponent}
      </div>
    </div>


  );
};
