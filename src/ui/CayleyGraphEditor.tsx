import { SetStateAction, useEffect, useReducer, useState } from "react";
import { SelectorComponent } from "./Selector";
import styleToCss from "style-object-to-css-string";
import { GroupName } from "../DefaultMeshes";
import { cayleyGraphData } from "../data/cayleyGraphData";
import { CayleyGraph } from "../CayleyGraph";
import ReactHotkeys from "react-hot-keys";
import { Vector2 } from "three";
export type CayleyGraphEditorProps = {
    show: boolean;
    hide: () => void;
}

const CLUSTER_THRESHOLD = 20;
type CayleyGraphEditorState = "Remove" | "Move";
export function CayleyGraphEditor({show}: CayleyGraphEditorProps) {
    
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const [name, chooseName] = useState<GroupName>("Z_2");

    const [mode, setMode] = useState<CayleyGraphEditorState>("Move");

    const [graph, setGraph] = useState<GroupName>("Z_2");
    const [data, setData] = useState(cayleyGraphData[graph]); // initially load
    const [verteInd, setVertexInd] = useState<number>(0);
    
    const min = 0;
    const max = 100;
    const bound = (x: number) => Math.max(min, Math.min(max, x));

    const move = (dx: number, dy: number) => {
        data[verteInd].add(new Vector2(dx, dy));
        setData(data);
        forceUpdate();
    }

    const add = () => { 
        const newData = [...data, new Vector2(0, 0)]
        console.log("added a new vertex", data)
        setData(newData);
        setVertexInd(newData.length - 1);
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
            case "d":
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
                <button onClick={() => { /* hide */}} >Close</button>
            <h2>Cayley Graph Editor</h2>
            <div style={{width: "100%"}}>
                <span>
                    <SelectorComponent name={"mode"} options={["Move", "Delete"]} selected={[mode]} mode={"PickOne"} set={arr => setMode(arr[0])} /> 
                    <button className="CayleyGraphEditor__button" onClick={add}>Add</button>
                </span>
            </div>
            <div className="CayleyGraphEditor__body">
                <div style={{position: "absolute", left: "50%", top: "50%"}}>
                    {data.map((pos, i) => {
                        let background = (i == verteInd) ? "#3c5" : "#ccc";
                        return (
                            <div style={{ position: "absolute", top: pos.y - 5, left: pos.x - 5, width: "10px", height: "10px", background, borderRadius: "5px"}}>
                                <div style={{marginTop: "-15px", marginLeft: "-8px", color: "lightgray"}}>{i}</div>
                            </div>
                        )
                    })}
                    {filteredClusters.map((cluster, i) => {
                        const pos = cluster[0];
                        return (
                            <div style={{ position: "absolute", top: pos.y - 5, left: pos.x + 2, width: "10px", height: "10px"}}>{"" + cluster.length}</div>
                        )
                    })}
                </div>
        
            </div>
            </div>
        </div>
    )
}