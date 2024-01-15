import { SetStateAction, useEffect, useReducer, useRef, useState } from "react";
import { SelectorComponent } from "./Selector";
import styleToCss from "style-object-to-css-string";
import { GroupName } from "../DefaultMeshes";
import { cayleyGraphData } from "../data/cayleyGraphData";
import { CayleyGraph } from "../CayleyGraph";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import ReactHotkeys from "react-hot-keys";
import { Vector2, Vector3 } from "three";
import { StaticGraph } from "../StaticGraph";
//cayleygraphdata type
import { CayleyGraphData } from "../data/cayleyGraphData";
export type CayleyGraphEditorProps = {
    show: boolean;
    hide: () => void;
}

type GraphEdge = [number, number]; // indices [from, to]
export const i_edge = (graphEdge: [Vector2, Vector2]) => {
    // include the vector from R2 into R3
    const [from, to] = graphEdge;
    return [new Vector3(from.x, from.y, 0), new Vector3(to.x, to.y, 0)];    
}
const CLUSTER_THRESHOLD = 6;
const VERTEX_RADIUS = 4;
const MAX_SIZE = 200;
type CayleyGraphEditorState = "Remove" | "Move" |"Arrow";
export function CayleyGraphEditor({show, hide}: CayleyGraphEditorProps) {
    
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const [name, chooseName] = useState<GroupName>("Z_2");

    const [mode, setMode] = useState<CayleyGraphEditorState>("Move");

    const [graph, setGraph] = useState<GroupName>("Z_2");
    const [data, setDataUnsafe] = useState<CayleyGraphData>(cayleyGraphData[graph]); // initially load
    const {vertices, edges} = data;
    const l = data.vertices.length;

    const numEdges = () => edges.length;
    
    const edgeMap = function<T>(f: (e: GraphEdge, i?: number, j?: number) => T): (T | undefined)[][] {
        return edges.map(list => list.map(([from, to], index) => f([from, to], from, to)));
    }
    const setData = (newData: CayleyGraphData) : boolean => {
        if (newData.vertices.length > MAX_SIZE) {
            NotificationManager.error("Too many vertices", "Error", 3000000);
            return false;
        }
        setDataUnsafe(newData);
        return true;
    }
    const [vertexInd, setVertexInd] = useState<number>(0);
    
    const ref = useRef<HTMLDivElement>();
    
    const min = 0;
    const max = 100;
    const bound = (x: number) => Math.max(min, Math.min(max, x));
    
    const move = (dx: number, dy: number) => {
        if (vertexInd < 0 || vertexInd >= data.vertices.length) return;
        vertices[vertexInd].add(new Vector2(dx, dy));
        vertices[vertexInd].x = bound(vertices[vertexInd].x);
        vertices[vertexInd].y = bound(vertices[vertexInd].y);
        setData({...data, vertices});
        forceUpdate();
    }

    const [draggedIndex, setDraggedIndex] = useState(-1);

    const add = () => { 
        
        const newVertices = [...data.vertices, new Vector2(50, 50)]
        
        console.log("added a new vertex", data)
        setData({...data, vertices: newVertices});

        setVertexInd(newVertices.length - 1);
    }
    const reset = () => {
        setData({
            vertices: [],
            edges: []
        });
        setVertexInd(-1);
    }

    const copy = () => {
        // copy the current graph to the clipboard
        const smallData = {
            // round the values to two decimal placesd
            vertices: data.vertices.map(v => `!!new Vector2(${Math.round(v.x * 100) / 100}, ${Math.round(v.y * 100) / 100})!!`),
            edges: data.edges
        }
        const quotedText = JSON.stringify(smallData);
        const copyText = quotedText.replace(/("!!)|(!!")/g, ""); 
        navigator.clipboard.writeText(copyText);
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
    const addEdge = function(i: number,j: number) {
        const index = edges.findIndex(([from, to]) => from == i && to == j);
        if (index != -1) return;
        const newEdges = [...edges];
        newEdges.push([i, j]);
        setData({...data, edges: newEdges});
    }
    const vertexDrop = function(i: number) {
        if (i < 0 || i >= vertices.length) return;
        setDraggedIndex(i);
        if (draggedIndex == i) return;
        addEdge(draggedIndex, i);
    }

    const del = () => {
        const newVertices = [...vertices];
        newVertices.splice(vertexInd, 1);
        const success = setData({...data, vertices: newVertices});
        if (success) setVertexInd(Math.max(vertexInd - 1, 0));
    }

    const reflectYAxis = () => {
     
        const length = vertices.length;
        const newVertices = [...vertices];
        for (let i = 0; i < length; i++) {
            newVertices.push(new Vector2(100 - vertices[i].x, vertices[i].y));
        }
        const success = setData({...data, vertices: newVertices});


        if (success) setVertexInd(newVertices.length - 1);


    }
    const reflectXAxis = () => {
     
        const length = vertices.length;
        const newVertices = [...vertices];
        for (let i = 0; i < length; i++) {
            newVertices.push(new Vector2(vertices[i].x, 100 - vertices[i].y));
        }
        const success = setData({...data, vertices: newVertices});


        if (success) setVertexInd(newVertices.length - 1);


    }

    const rotateSpread = (n) => () => {
        // rotate n times with angle 2 pi / n
        const newVertices = [...vertices];
        const center = new Vector2(50, 50);
        const length = vertices.length;
        const unit = 2 * Math.PI / n;
        for (let i = 0; i < length; i++) {
            const v = vertices[i];
            for (let j = 1; j < n; j++) {
                const newV = v.clone().rotateAround(center, unit * j);
                newVertices.push(newV);
            }
        }
        const success = setData({...data, vertices: newVertices});

        if (success) setVertexInd(newVertices.length - 1);
    }
    // a trivial useEffect to rerender the component when the data changes
    const moveLeft = () => move(-5, 0);
    const moveRight = () => move(5, 0);
    const moveUp = () => move(0, -5);
    const moveDown = () => move(0, 5);
    
    if (!show) return null;
    let containerStyle = styleToCss({
        position: "absolute",
        top: 0, left: 0,
        width: "100%", height: "100%",
        background: "#ffffffaa",            
    });
    
    let outerStyle = styleToCss({
        position: "absolute",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "50vw", height: "80vh",
        background: "white",
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
    console.log(Object.entries(styleProps).map(([tagname, body]) => `.${tagname} {\n${body}\n}`).join("\n\n"));
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
                setData({...data, vertices: vertices.filter((_, i) => i != vertexInd)});
                break;
            default:
              console.log("Invalid direction");
              return;
            }
            forceUpdate();
        }
        

        const currentVertex = data?.[vertexInd];
        // Detect overlapping vertices for the entire set of vertices, forming an array of clusters
    const clusters = vertices.map((pos, i) => {
        const cluster = vertices.filter((_, j) => i < j && pos.distanceTo(vertices[j]) < CLUSTER_THRESHOLD);
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
    


    console.log(filteredClusters);

    // get rid of duplicoate clusters by position
    

    return (
        <div className="CayleyGraphEditor__container" onkeypress={(event) => onkeydown(event)}>
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
                    <span className="CayleyGraphEditor__vertexAndEdgeCount">
                        Vertices: {vertices.length} Edges: {numEdges()}
                    </span>
                    <SelectorComponent name={"mode"} options={["Move", "Delete", "Arrow"]} selected={[mode]} mode={"PickOne"} set={arr => setMode(arr[0])} /> 
                    <section style={{
                        display: "inline",
                        flexDirection: "row",
                        flex: "1em 25em 5em"
                    }}>
                        <button className="CayleyGraphEditor__button" onClick={add}>Add</button>
                        <button className="CayleyGraphEditor__button" onClick={del}>Delete</button>

                    </section>
                    <section style={{display: "inline-flex", flexDirection: "row", maxWidth: "100px"}}>
                    <button className="CayleyGraphEditor__button" onClick={reflectYAxis}>Reflect Y-axis</button>
                    <button className="CayleyGraphEditor__button" onClick={reflectXAxis}>Reflect X-axis</button>
                    <button className="CayleyGraphEditor__button" onClick={rotateSpread(2)}>Rotate-2</button>
                    <button className="CayleyGraphEditor__button" onClick={rotateSpread(3)}>Rotate-3</button>
                    <button className="CayleyGraphEditor__button" onClick={rotateSpread(4)}>Rotate-4</button>
                    <button className="CayleyGraphEditor__button" onClick={rotateSpread(5)}>Rotate-5</button>
                    </section>
                </div>
            </div>
            <div className="CayleyGraphEditor__body" ref={ref}>
                <div className="CayleyGraphEditor__grid" >
                    <StaticGraph edges={edges} vertices={vertices} />
                    {vertices.map((pos, i) => {
                        const mainWidth: number = ref.current?.offsetWidth ?? 0;
                        const y = mainWidth / 100 * pos.y;
                        const x = mainWidth / 100 * pos.x;
                        let background = (i == vertexInd) ? "#3c5" : "#aaa";
                        // Log whether arrow mode (with enthusiasm) or a different mode (in a sad tone)
                        if (mode === "Arrow") console.log("Arrow mode");
                        else console.log("Not arrow mode");
                        return (
                            <div  onDrop={(e) => {  e.preventDefault();vertexDrop(i)}} style={{ position: "absolute", top: y - VERTEX_RADIUS, left: x - VERTEX_RADIUS, width:`${2 * VERTEX_RADIUS}px`, height: `${2 * VERTEX_RADIUS}px`, background, borderRadius: `${VERTEX_RADIUS}px`}}>
                                <div 
                                draggable={mode === "Arrow"} 
                                onDragStart={(e) =>{ vertexDrag(i) }} 
                                onDragOver={(e) => { e.preventDefault(); }}
                                onDrop={(e) => {  e.preventDefault();vertexDrop(i)}} style={{marginTop: `${ -VERTEX_RADIUS - 2}px`, marginLeft: `${ -VERTEX_RADIUS}px`, color: "#aaa", fontSize: `${2*VERTEX_RADIUS}px`}}>{i}</div>
                            </div>
                        )
                    })}
                    {filteredClusters.map((cluster, i) => {
                        const mainWidth: number = ref.current?.offsetWidth ?? 0;
                        const y = mainWidth / 100 * cluster[0].y;
                        const x = mainWidth / 100 * cluster[0].x
                        return (
                            <div style={{ position: "absolute", top: y - 20, left: x + 2, width: "5px", height: "5px"}}>{"" + cluster.length}</div>
                        )
                    })}

                </div>
        
                <div className="CayleyGraphEditor__lower"  style={{border: "1px solid black", height: "20px"}}>
                    <button onClick={reset}>Reset</button>
                    <button onClick={copy}>Copy</button>
                </div>
            </div>
            </div>
        </div>
    )
}