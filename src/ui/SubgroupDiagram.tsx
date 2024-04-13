import { MathComponent } from "mathjax-react";
import { useState } from "react";

export type PosetDiagramComponentProps = {
    size: number;
    poset: [number, number][]; // pairs of a number and its parent
    positions: [number, number][]; // x and y
    labels: string[];
    active: number;
    // react set state hook
    setActive: (n: number) => void;
}

const root = document.querySelector(':root');
const rs = getComputedStyle(root);
export const SubgroupDiagramComponent = function(props: PosetDiagramComponentProps) {
    const { size, poset, positions, labels, active, setActive  } = props;
    const [localStepIndex, setLocalStepIndex] = useState(0);
    
    let groups = positions.map(([x, y], index) => {
        const onClick = (e) => {
            console.log("Clicked:", index);
            setActive(index);
        }

        // const color = index === active ? rs.getPropertyValue("--button-active"): rs.getPropertyValue("--button-inactive");
        return (
 
                    <button key={`poset_element_${index}`} className={"SubgroupDiagram__button"} style={{ left: `calc(${x}% - 2pc)`, top: `calc(${y}% - 1.5pc)`, 
                         }} onClick={(e) => onClick(e)}  xmlns="http://www.w3.org/1999/xhtml" >
                            <MathComponent className={"tex2jax_process"}  style={{height:"100%", width: "100%", background: "transparent"}} tex={"" + ( labels[index] ?? index + 1)} />
                        {/* <span>
                        </span>
                         */}
                    </button>
             
      
        )
    });
    return (
        <div className="SubgroupDiagram"  >
            <svg xmlns='http://www.w3.org/2000/svg'  style={{}} viewBox="0 0 100 100">
                {poset.map(([n, p], i) => {
                    const [x, y] = positions[n];
                    const [px, py] = positions[p];
                    return (
                        <line stroke="white" key={`poset_edge_${i}`} x1={x} y1={y} x2={px} y2={py} />
                    )
                })}
            
            </svg>
           
            <div style={{width: "100%", aspectRatio: 1 }}>

                {groups}
            </div>
        </div>
    )
}