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
type CayleyGraphData = Vector2[];
export type CayleyGraphEditorProps = {
    show: boolean;
    hide: () => void;
}

type GraphEdge = [Vector2, Vector2];
const i_edge = (graphEdge: GraphEdge) => {
    // include the vector from R2 into R3
    const [from, to] = graphEdge;
    return [new Vector3(from.x, from.y, 0), new Vector3(to.x, to.y, 0)];    
}
const CLUSTER_THRESHOLD = 6;
const VERTEX_RADIUS = 10;
const MAX_SIZE = 200;
type CayleyGraphEditorState = "Remove" | "Move" | "Arrow";
export function CayleyGraphEditor({show, hide}: CayleyGraphEditorProps) {
    
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const [name, chooseName] = useState<GroupName>("Z_2");

    const [mode, setMode] = useState<CayleyGraphEditorState>("Move");

    const [graph, setGraph] = useState<GroupName>("Z_2");
    const [data, setDataUnsafe] = useState<CayleyGraphData>(cayleyGraphData[graph]); // initially load
    const l = data.length;
    const [edges, setEdges] = useState<GraphEdge[][]>(Array(l).fill(0).map((_, i) => [] ));
    const numEdges = () => {
        console.log(edges);
        return edges.reduce((acc, val) => acc + val.filter(cell => cell != undefined).length, 0);
    
    }
    
    const edgeMap = function<T>(f: (e: GraphEdge, i?: number, j?: number) => T): (T | undefined)[][] {
        return edges.map((row, i) => row.map((cell, j) => cell == undefined ? undefined : f(cell, i, j)));
    }
    const setData = (newData: Vector2[]): boolean => {
        if (newData.length > MAX_SIZE) {
            NotificationManager.error("Too many vertices", "Error", 3000000);
            return false;
        }
        setDataUnsafe(newData);
        return true;
    }
    const [verteInd, setVertexInd] = useState<number>(0);
    
    const ref = useRef<HTMLDivElement>();
    
    const min = 0;
    const max = 100;
    const bound = (x: number) => Math.max(min, Math.min(max, x));
    
    const move = (dx: number, dy: number) => {
        data[verteInd].add(new Vector2(dx, dy));
        data[verteInd].x = bound(data[verteInd].x);
        data[verteInd].y = bound(data[verteInd].y);
        setData(data);
        forceUpdate();
    }

    const [draggedIndex, setDraggedIndex] = useState(-1);

    const add = () => { 
        
        const newData = [...data, new Vector2(50, 50)]
        
        console.log("added a new vertex", data)
        setData(newData);

        const newEdges = [...edges, []];
        setEdges(newEdges);

        setVertexInd(newData.length - 1);
    }
    const reset = () => {
        setData([]);
        setVertexInd(0);
    }
    const clickHide = function() {
        // reset, make blank
        reset();
        hide();
    }

    const vertexDrag = function(i: number) {
        if (i < 0 || i >= data.length) return;
        setDraggedIndex(i);
    }
    const addEdge = function(i: number,j: number) {
        const newEdges = [...edges];
        newEdges[i][j] ??= [data[i], data[j]];
        setEdges(newEdges);
    }
    const vertexDrop = function(i: number) {
        if (i < 0 || i >= data.length) return;
        setDraggedIndex(i);
        if (draggedIndex == i) return;
        addEdge(draggedIndex, i);
    }

    const del = () => {
        const newData = [...data];
        newData.splice(verteInd, 1);
        const success = setData(newData);
        if (success) setVertexInd(Math.max(verteInd - 1, 0));
    }

    const reflectYAxis = () => {
     
        const length = data.length;
        const newData = [...data];
        for (let i = 0; i < length; i++) {
            newData.push(new Vector2(100 - data[i].x, data[i].y));
        }
        const success = setData(newData);

        const newEdges = [...edges, ...new Array(edges.length).fill(0).map((_, i) => [])];
        setEdges(newEdges);

        if (success) setVertexInd(newData.length - 1);


    }
    const reflectXAxis = () => {
   
        const length = data.length;
        const newData = [...data];
        for (let i = 0; i < length; i++) {
            newData.push(new Vector2(data[i].x, 100 - data[i].y));
        }
        const success = setData(newData);
        const newEdges = [...edges, ...new Array(edges.length).fill(0).map((_, i) => [])];
        setEdges(newEdges);
        
        if (success) setVertexInd(newData.length - 1);
    }

    const rotateSpread = (n) => () => {
        // rotate n times with angle 2 pi / n
        const newData = [...data];
        const center = new Vector2(50, 50);
        const length = data.length;
        const unit = 2 * Math.PI / n;
        for (let i = 0; i < length; i++) {
            const v = data[i];
            for (let j = 1; j < n; j++) {
                const newV = v.clone().rotateAround(center, unit * j);
                newData.push(newV);
            }
        }
        const success = setData(newData);
        const newEdges = [...edges, ...new Array((n - 1) * edges.length).fill(0).map((_, i) => [])];
        setEdges(newEdges);
        if (success) setVertexInd(newData.length - 1);
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
                setVertexInd((verteInd - 1 + data.length) % data.length);
            break;
            case "]":
                setVertexInd((verteInd - 1 + data.length) % data.length);
            break;
            case "n":
                add();
                break;
            case "x":
                setData(data.filter((_, i) => i != verteInd));
                break;
            default:
              console.log("Invalid direction");
              return;
            }
            forceUpdate();
        }
        

        const currentVertex = data?.[verteInd];
        // Detect overlapping vertices for the entire set of vertices, forming an array of clusters
    const clusters = data.map((pos, i) => {
        const cluster = data.filter((_, j) => i < j && pos.distanceTo(data[j]) < CLUSTER_THRESHOLD);
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
                        Vertices: {data.length} Edges: {numEdges()}
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
                <div className="CayleyGraphEditor__grid"  style={{height: "100%", border: "1px solid black"}}>
                    <StaticGraph graphEdges={edges} />
                    {data.map((pos, i) => {
                        const mainWidth: number = ref.current?.offsetWidth ?? 0;
                        const y = mainWidth / 100 * pos.y;
                        const x = mainWidth / 100 * pos.x;
                        let background = (i == verteInd) ? "#3c5" : "#aaa";
                        // Log whether arrow mode (with enthusiasm) or a different mode (in a sad tone)
                        if (mode === "Arrow") console.log("Arrow mode");
                        else console.log("Not arrow mode");
                        return (
                            <div  onDrop={(e) => {  e.preventDefault();vertexDrop(i)}} style={{ position: "absolute", top: y - VERTEX_RADIUS, left: x - VERTEX_RADIUS, width:`${2 * VERTEX_RADIUS}px`, height: `${2 * VERTEX_RADIUS}px`, background, borderRadius: `${VERTEX_RADIUS}px`}}>
                                <div 
                                draggable={mode === "Arrow"} 
                                onDragStart={(e) =>{ vertexDrag(i) }} 
                                onDragOver={(e) => { e.preventDefault(); }}
                                onDrop={(e) => {  e.preventDefault();vertexDrop(i)}} style={{marginTop: `${ -VERTEX_RADIUS}px`, marginLeft: "-8px", color: "lightgray"}}>{i}</div>
                            </div>
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
                    <button>Generate</button>
                </div>
            </div>
            </div>
        </div>
    )
}