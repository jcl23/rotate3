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

        const color = index === active ? rs.getPropertyValue("--button-active"): rs.getPropertyValue("--button-inactive");
        return (
            <g  key={`poset_element_${index}`}>
               
                <foreignObject  x={x-8} y={y - 8} width="16" height="16">
                    <div style={{  backgroundColor: color  }} onClick={(e) => onClick(e)}  xmlns="http://www.w3.org/1999/xhtml" >
                        <span style={{pointerEvents: "none"}}>
                            <MathComponent className={"tex2jax_process"}  style={{height:"100%", width: "20px", background: "transparent"}} tex={"" + ( labels[index] ?? index + 1)} />
                    
                        </span>
                    </div>
                </foreignObject>
            
            </g>
        )
    });
    return (
        <svg className="SubgroupDiagram" xmlns='http://www.w3.org/2000/svg'  style={{}} viewBox="-10 -10 110 110">
            {poset.map(([n, p], i) => {
                const [x, y] = positions[n];
                const [px, py] = positions[p];
                return (
                    <line stroke="var(--accent-dark)" key={`poset_edge_${i}`} x1={x} y1={y} x2={px} y2={py} />
                )
            })}
            {groups}
          
        </svg>
    )
}