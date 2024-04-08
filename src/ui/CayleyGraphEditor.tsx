import { ReactComponentElement, SetStateAction, useEffect, useReducer, useRef, useState } from "react";
import { SelectorComponent } from "./Selector";
import styleToCss from "style-object-to-css-string";

import {NotificationContainer, NotificationManager} from 'react-notifications';
import ReactHotkeys from "react-hot-keys";
import { Vector2, Vector3 } from "three";
import { StaticGraph } from "../StaticGraph";
import { ActionSelectorComponent } from "./ActionSelector";
import { VERTEX_ACTIVE, VERTEX_INACTIVE } from "../cfg/colors";
import { CayleyGraphData, CayleyGraphVertex } from "../CayleyGraph";
import { GeneratorSelector } from "./GeneratorSelector";
import { validateCayleyGraph, determineGeneratorOrder, getElementOrder  } from "../logic/cayleyLogic";

import { GeometryName, GroupName } from "../DefaultMeshes";
import groupData from "../data/groupData";


import { GraphMatchingSelector } from "./GraphMatchingSelector";
import { set } from "firebase/database";
import { SolidMonoids } from "../data/platonicsolids";
import { cayleyGraphData } from "../data/cayleyGraphData";
import subgroupsData from "../data/subgroupData";

//cayleygraphdata type


export type CayleyGraphEditorProps = {
    show: boolean;
    hide: () => void;
}

export type GraphEdge = [number, number];

const CLUSTER_THRESHOLD = 6;
const VERTEX_RADIUS = 8;
const MAX_SIZE = 200;
const WIDTH = 200;
type CayleyGraphEditorState = "Remove" | "Move" | "Arrow";
export type EditorAction = "Add" | "Delete" | "Reflect (Y-axis)" | "Reflect (X-axis)" | "Rotate2" | "Rotate3" | "Rotate4" | "Rotate5" | "Reset" | "Generate";

export function CayleyGraphEditor({show, hide}: CayleyGraphEditorProps) {
    
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    // Editing
    const [mode, setMode] = useState<CayleyGraphEditorState>("Arrow");
    const [draggedIndex, setDraggedIndex] = useState(-1);
    const [vertexInd, setVertexInd] = useState<number>(0);
    // Graph data
    const [numGenerators, setNumGenerators] = useState<number>(0);
    const [currentGeneratorIndex, setCurrentGeneratorIndex] = useState<number>(0);
    // Group Data
    
    const [geomName, setGeomName] = useState<GeometryName>("Cube");
    const transformationGroup = SolidMonoids[geomName];
    const [groupName, setChosenGroup] = useState<GroupName>("1");
    // const [subgroupName, setChosenSubgroup] = useState<GroupName>("1");
   // const group = groupData[outerGroupName];
    if (false) {
        throw new Error(`[CayleyGraphEditor] Group ${groupName} is undefined`);
    }
    // result data
    const [outputString, setOutputString] = useState<string>("");

    const [vertices, setVerticesUnsafe] = useState<CayleyGraphVertex[]>([]); // initially load
    const [edges, setEdges] = useState<GraphEdge[][]>(Array(numGenerators).fill(0).map((_, i) => [] ));
    const [generatedEdges, setGeneratedEdges] = useState<GraphEdge[]>([]);
    const loadExample = () => {
        reset();
        // Load our K4 example;
        const vertices = [

            new Vector2(35, 35),
            new Vector2(35, 65),
            new Vector2(65, 65),
            new Vector2(65, 35),
        ];

        const edges: [number,number][][] = [
            [[0, 1], [1, 0], [2, 3], [3, 2]],
            [[0, 3], [3, 0], [1, 2], [2, 1]],
        ]
        setChosenGroup("K_4");
        setNumGenerators(2);
        setVertices(vertices);
        setEdges(edges);
    }

    const loadExample2 = () => {
        reset();
        // Load our K4 example;
        const { vertices, edges } = {
            "vertices":[{"x":20,"y":20},{"x":60,"y":60},{"x":20,"y":180},{"x":140,"y":60},{"x":60,"y":140},{"x":180,"y":180},{"x":180,"y":20},{"x":140,"y":140}],
            "edges":[[[0,1],[1,0],[3,4],[4,3],[6,7],[7,6],[2,5],[5,2]],[[0,7],[7,5],[5,4],[4,0],[1,3],[3,2],[2,6],[6,1]]]
        };
        setChosenGroup("D_4");
        setNumGenerators(2);
        setVertices(vertices);
        setEdges(edges);
    }
   
    const addGenerator = () => {
        setCurrentGeneratorIndex(numGenerators);
        console.log("Set current gen index to", numGenerators);
        setNumGenerators(numGenerators + 1);
        edges.push([]);
    }
    const removeGenerator = () => {
        const newMaxIndex = numGenerators - 1;
        setNumGenerators(Math.max(numGenerators - 1, 0));
        setCurrentGeneratorIndex(currentGeneratorIndex > newMaxIndex ? newMaxIndex : currentGeneratorIndex);
        edges.pop();
    }    

    const reloadStoredGraph = () => {
        const stored = localStorage.getItem("cayleygraph");
        if (stored == null) return;
        const {vertices, edges} = JSON.parse(stored);
        setVertices(vertices);
        setNumGenerators(edges.length);
        setEdges(edges);
    }
    useEffect(() => {
        reloadStoredGraph();
    }, []);
    const numEdges = () => edges.reduce((acc, row) => acc + row.length, 0);
    //
    const edgesMap = function<T>(edges: GraphEdge[][], f: (e: GraphEdge, listIndex: number, vertexIndex: number) => T): (T)[][] {
       // edges are a list of lists of pairs.
        return edges.map((row, i) => row.map((edge, j) => f(edge, i, j)));
    }
    const edgeFilter = function(edges: GraphEdge[][], f: (e: GraphEdge, listIndex?: number, vertexIndex?: number) => boolean): (GraphEdge)[][] {
       // edges are a list of lists of pairs.
        return edges.map((row, i) => row.filter((edge, j) => edge));
    }
    const setVertices = (newVertices: CayleyGraphVertex[]): boolean => {
        if (newVertices.length > MAX_SIZE) {
            NotificationManager.error("Too many vertices", "Error", 3000000);
            return false;
        }
        setVerticesUnsafe(newVertices);
        return true;
    }
  
   
    const ref = useRef<HTMLDivElement>();
    
    const min = 0;
    const max = WIDTH;
    const bound = (x: number) => Math.max(min, Math.min(max, x));
    
    const move = (dx: number, dy: number) => {
        vertices[vertexInd].x = bound(vertices[vertexInd].x + dx);
        vertices[vertexInd].y = bound(vertices[vertexInd].y + dy);
        setVertices(vertices);
        forceUpdate();
    }


    const add = () => { 
        
        const newVertices = vertices.slice(0);
        
        newVertices.push(new Vector2(WIDTH / 2, WIDTH / 2));
        console.log("added a new vertex", vertices)
        setVertices(newVertices);

        setVertexInd(newVertices.length - 1);
    }
    const reset = () => {
        setVertices([]);
        setEdges([]);
        setNumGenerators(0);
        setVertexInd(0);
    }
    const clickHide = function() {
        // reset, make blank
        reset();
        hide();
    }

    const vertexDrag = function(i: number) {
        if (i < 0 || i >= vertices.length) return;
        setDraggedIndex(i);
    }
    const addEdge = function(i: number,j: number, listIndex: number) {
        if (edges.flat().some(([a, b]) => (a == i && b == j))) return;
        const newEdges = [...edges];
        if (listIndex >= newEdges.length) {
            throw new Error(`[CayleyGraphEditor] listIndex ${listIndex} is out of bounds for edges of length ${newEdges.length}`);
        }
        newEdges[listIndex].push([i, j]);
        setEdges(newEdges);
    }
    const vertexDrop = function(i: number) {
        if (i < 0 || i >= vertices.length) return;
        if (numGenerators == 0) {
            addGenerator();
            setCurrentGeneratorIndex(0);
        }
        if (draggedIndex == i) return;
        addEdge(draggedIndex, i, currentGeneratorIndex);
    }

    const del = () => {
        const newVertices = [...vertices];
        newVertices.splice(vertexInd, 1);
        let reindex = (n: number) => n - (n > vertexInd ? 1 : 0);
        const unmappedNewEdges = edgeFilter(edges, ([i, j]) => i != vertexInd && j != vertexInd);
        const newEdges: GraphEdge[][] = edgesMap(unmappedNewEdges, ([i, j]) => [reindex(i), reindex(j)]);
        setEdges(newEdges);
        const success = setVertices(newVertices);
        if (success) setVertexInd(Math.max(vertexInd - 1, 0));
    }

    const reflectYAxis = () => {
     
        const length = vertices.length;
        const newVertices = [...vertices];
        for (let i = 0; i < length; i++) {
            newVertices.push({x: WIDTH - vertices[i].x, y: vertices[i].y});
        }
        const success = setVertices(newVertices);

        const addedEdges = edgesMap(edges, ([i, j]): [number,number] => [i + length, j + length]);
        const newEdges = [...edges];
        for (let i = 0; i < addedEdges.length; i++) {
            newEdges[i] = [...newEdges[i], ...addedEdges[i]];
        }
        setEdges(newEdges);

        if (success) setVertexInd(newVertices.length - 1);
    }
    const reflectXAxis = () => {
   
        const length = vertices.length;
        const newVertices = [...vertices];
        const map: number[] = [];
        for (let i = 0; i < length; i++) {
            newVertices.push(new Vector2(vertices[i].x, WIDTH - vertices[i].y));
            let recentIndex = newVertices.length - 1;
            map[i] = recentIndex;
        }
        const success = setVertices(newVertices);
        const addedEdges: [number, number][][] = edgesMap(edges, ([i, j]) => [map[i], map[j]]);
        const newEdges = [...edges];
        for (let i = 0; i < addedEdges.length; i++) {
            newEdges[i] = [...newEdges[i], ...addedEdges[i]];
        }
        setEdges(newEdges);
        
        if (success) setVertexInd(newVertices.length - 1);
    }

    const rotateSpread = (n) => () => {

        //const map: number[][] = new Array(n).fill(0).map(_ => []);
        // rotate n times with angle 2 pi / n
        const newVertices = [...vertices];
        const center = new Vector2(WIDTH / 2, WIDTH / 2);
        const length = vertices.length;
        const unit = 2 * Math.PI / n;
        for (let j = 1; j < n; j++) {
            for (let i = 0; i < length; i++) {
                const v = vertices[i];
                const { x, y } = new Vector2(v.x, v.y).rotateAround(center, unit * j);
                newVertices.push({x, y});

            }
        }
        const success = setVertices(newVertices);
        
        //const addedEdges = edgesMap(edges, ([i, j]) => [map[i], map[j]]);
        const newEdges = edges.map(r => r.slice());
        for (let edgeListIndex = 0; edgeListIndex < edges.length; edgeListIndex++)  {
            for (let spokeIndex = 1; spokeIndex < n; spokeIndex++) {
                edges[edgeListIndex].forEach(([i, j]) => {
                    const newI = i + vertices.length * spokeIndex;
                    const newJ = j + vertices.length * spokeIndex;
                    newEdges[edgeListIndex].push([newI, newJ]);
                });
            }
        }
        
        
        // const newEdges = [...edges, ...new Array((n - 1) * edges.length).fill(0).map((_, i) => [])];
        setEdges(newEdges);
        if (success) setVertexInd(newVertices.length - 1);
    }

    const MOVEMENT_INTERVAL = 10;
    // a trivial useEffect to rerender the component when the data changes
    const moveLeft = () => move(-MOVEMENT_INTERVAL, 0);
    const moveRight = () => move(MOVEMENT_INTERVAL, 0);
    const moveUp = () => move(0, -MOVEMENT_INTERVAL);
    const moveDown = () => move(0, MOVEMENT_INTERVAL);
    
    if (!show) return null;
    let containerStyle = styleToCss({
        position: "absolute",
        top: 0, left: 0,
        width: "100%", height: "100%",
    });
    
    let outerStyle = styleToCss({
        position: "absolute",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "50vw", height: "80vh",
       
        border: "1px solid black",
        zIndex: 1,
        padding: "30px",
    })

    let buttonStyle = styleToCss({position: "fixed", right: "50px", top: "30px", border: "2px solid grey", padding: "5px", borderRadius: "5px", background: "#40a6f440"});
    
    // conctenate the style strings with extra lines between
    let styleProps = {
        CayleyGraphEditor__container: containerStyle,
        CayleyGraphEditor__outer: outerStyle,
        CayleyGraphEditor__button: buttonStyle,
    }
    // console.log(Object.entries(styleProps).map(([tagname, body]) => `.${tagname} {\n${body}\n}`).join("\n\n"));
    onkeydown = function(e: React.KeyboardEvent<HTMLDivElement>) {
        // switch on event key
   
        switch (e.key.toLowerCase()) {
            case "w":
            case "arrowup":
                moveUp();
                break;
            case "s":
            case "arrowdown":
                moveDown();
              break;
            case "a":
            case "arrowleft":
                    moveLeft();
                    break;
            case "d":
            case "arrowright":
                moveRight();
            break;
            case "[":
                setVertexInd((vertexInd - 1 + vertices.length) % vertices.length);
            break;
            case "]":
                setVertexInd((vertexInd - 1 + vertices.length) % vertices.length);
            break;
            case "n":
                add();
                break;
            case "x":
                del();
                break;
            default:
              console.log("Invalid direction");
              return;
            }
            forceUpdate();
        }
        


        // Detect overlapping vertices for the entire set of vertices, forming an array of clusters
    const distance = (a: CayleyGraphVertex, b: CayleyGraphVertex) => Math.hypot(a.x - b.x, a.y - b.y);
    const clusters = vertices.map((pos, i) => {
        const cluster = vertices.filter((_, j) => i < j && distance(pos, vertices[j]) < CLUSTER_THRESHOLD);
        return [pos, ...cluster];
    });
    
    let seen = new Set();
    // map reduce to get rid of duplicates, by not including neighbors weve seen
    const filteredClusters = clusters.reduce((acc, cluster) => {
        if (cluster.length == 0) return acc;
        const [first, ...rest] = cluster;
        if (seen.has(first)) return acc;
        if (rest.length === 0) return acc;
        cluster.forEach(t => seen.add(t));
        return [...acc, cluster];
    }, []);
    
    const printDebug = function() {
        console.log("vertices", vertices);
        console.log("edges:", edges);
    }

    
    let isValidCayleyGraph = validateCayleyGraph(vertices, edges);
    console.log("isValidCayleyGraph", isValidCayleyGraph);
    
    
    let edgeOrders;
    if (isValidCayleyGraph) {
        // Display the other section of the GUI, where we select a monoid
        edgeOrders = edges.map((row, i) => determineGeneratorOrder(row));
        console.log("Orders:", edgeOrders);
       // orderToElements = monoidToOrderToPossibleElements(group);
    }

    const toPrinted = () => {
        // make a new list of vertices by mapping round down the decimals of the x and y values to 1 place
        const roundedVertices = vertices.map(({x, y}) => ({x: Math.round(x), y: Math.round(y)}));
        const str = JSON.stringify({vertices: roundedVertices, edges}).replaceAll("\"", "");


        return str;
    
    }
    
// persist the state in storage so that we can load it later
   
let subgroupNames = [...new Set(Object.values(subgroupsData).map(d => Object.keys(d)).flat())]

    return (
        <div className="CayleyGraphEditor__container" onKeyPress={(event) => onkeydown(event)}>
            <div className="SelectorPanel">
                <div className="SelectorComponent__outer SelectorGroup">
                    <SelectorComponent name={"mode"} options={["Move", "Delete", "Arrow"]} selected={[mode]} mode={"PickOne"} set={arr => setMode(arr[0])} /> 
                    <ActionSelectorComponent name={""} actions={{
                        "Add": add,
                        "Delete": del,
                    }} />
                    <ActionSelectorComponent name={"Generators"} actions={{
                        "Add": addGenerator,
                        "Delete": removeGenerator,
                    }} />
                     
                    <div style={{display: "flex", flexDirection: "row"}}>
                        {Array(numGenerators).fill(0).map((_, i) => (
                            <button key={`CayleyGraphEditor__generator[${i}]`} onClick={() => setCurrentGeneratorIndex(i)}>{i + 1}</button>
                        ))}
                    </div>
                

                    <ActionSelectorComponent name={""} actions={{
                        ["Reflect (Y-axis)"]: reflectYAxis,
                        ["Reflect (X-axis)"]: reflectXAxis,
                        ["Rotate2"]: rotateSpread(2),
                        ["Rotate3"]: rotateSpread(3),
                        ["Rotate4"]: rotateSpread(4),
                        ["Rotate5"]: rotateSpread(5),
                    }} />
                    <button style={{padding:"10px"}} onClick={loadExample}>Example</button>
                    <button style={{padding:"10px"}} onClick={loadExample2}>Example2</button>
                </div>

                
            {isValidCayleyGraph && (
                <div className="SelectorComponent__outer SelectorGroup">
                    <div>
                        {subgroupNames.map(name => (
                            <button key={`CayleyGraphEditor__subgroup[${name}]`} onClick={() => setChosenGroup(name)}>{name}</button>
                        ))}
                    </div>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        {["Cube","Icosahedron", "Tetrahedron", "Octahedron", "Dodecahedron"].map((s, i) => (
                            <button style={(s == geomName) ? {background: "lightblue"} : {}} key={`CayleyGraphEditor__generator[${i}]`} onClick={() => setGeomName(s)}>{s}</button>
                        ))}
                    </div>
                    <GraphMatchingSelector 
                        mainGroup={transformationGroup} 
                        subgroupName={groupName}  
                        edgeOrders={edgeOrders} 
                        edges={edges} 
                        vertices={vertices} 
                        setGeneratedEdges={setGeneratedEdges} 
                        setOutputString={setOutputString}
                    />
                </div>
             
            )}
            </div>
             <ReactHotkeys 
                keyName="shift+a,alt+s" 
                   filter={(event) => {
                    return true;
                   }}
                onKeyDown={onkeydown}
            />
            <div className="CayleyGraphEditor__outer" >
                <button onClick={clickHide} >Close</button>
            <h4>Cayley Graph Editor</h4>
            <NotificationContainer/>
            <div style={{width: "100%"}}>
                <div style={{display: "flex", flexDirection: "column"}}>
                    <button className="CayleyGraphEditor__button" onClick={printDebug}>Debug</button>

                    <span className="CayleyGraphEditor__vertexAndEdgeCount">
                        Vertices: {vertices.length} Edges: {numEdges()} (Demo contains {generatedEdges?.length ?? 0} steps)
                    </span>
                    
                   
                </div>
            </div>
            <div className="CayleyGraphEditor__body" ref={ref}>
                <div className="CayleyGraphEditor__grid"  style={{position: "relative", height: "100%", border: "1px solid black"}}>
                    <svg viewBox="0 0 200 200" width={200} height={200}>
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
                                <path d="M 3 1 L 6 5 L 3 9 z" fill="#ffffff" />
                            </marker>
                        </defs>
                        <StaticGraph graphData={{vertices, edges}} textAttributes={{fontSize: "6px", transform: "translate(2,4)"}}/>
                    </svg>
                    {vertices.map((pos, i) => {
                        const mainWidth: number = ref.current?.offsetWidth ?? 0;
                        const y = mainWidth / 200 * pos.y;
                        const x = mainWidth / 200 * pos.x;
                        let background = (i == vertexInd) ? VERTEX_ACTIVE : VERTEX_INACTIVE;
                        // Log whether arrow mode (with enthusiasm) or a different mode (in a sad tone)
                        if (mode === "Arrow") console.log("Arrow mode");
                        else console.log("Not arrow mode");
                        return (
                            <div 
                            key={`CayleyGraphEditor__vertex[${i}]`}
                                onDrop={(e) => {  e.preventDefault();vertexDrop(i)}} 
                                draggable={mode === "Arrow"} 
                                onDragStart={(e) =>{ vertexDrag(i) }} 
                                onDragOver={(e) => { e.preventDefault(); }}
                                style={{ position: "absolute", top: y - VERTEX_RADIUS, left: x - VERTEX_RADIUS, width:`${2 * VERTEX_RADIUS}px`, height: `${2 * VERTEX_RADIUS}px`, background, borderRadius: `${VERTEX_RADIUS}px`}}
                               
                            />
                        )
                    })}
                    {filteredClusters.map((cluster, i) => {
                        const mainWidth: number = ref.current?.offsetWidth ?? 0;
                        const y = mainWidth / 100 * cluster[0].y;
                        const x = mainWidth / 100 * cluster[0].x;
                        return (
                            <div style={{ position: "absolute", top: y - 22, left: x + 12, width: "10px", height: "10px"}}>{"" + cluster.length}</div>
                        )
                    })}

                </div>
        
                <div className="CayleyGraphEditor__lower"  style={{border: "1px solid black", height: "20px"}}>
                    <button onClick={reset}>Reset</button>
                    <button onClick={() => {
                        localStorage.setItem("cayleygraph", JSON.stringify({vertices, edges}));
                    }}>
                        Save
                    </button>
                    <button onClick={() => {
                        // copy the string to clipboard
                        navigator.clipboard.writeText(toPrinted());
                    }}>Copy</button>
                </div>
            </div>
            </div>
        </div>
    )
}