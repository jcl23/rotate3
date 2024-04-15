import { Dispatch, SetStateAction, useEffect } from "react";
import { GeometryName } from "../DefaultMeshes";
import { Tetrahedron } from "@react-three/drei";
import { defaultColors, defaultColorsDark } from "../cfg/colors";

type GeometrySelectorProps = {
    setGeometry: Dispatch<SetStateAction<GeometryName>>;
    geometry: GeometryName;
}

export const GeometrySelector = function({ setGeometry, geometry }: GeometrySelectorProps) {
    const shapeNames = ["Tetrahedron", "Cube", "Octahedron", "Dodecahedron", "Icosahedron"];
    const positions = [
        // an X pattern of 5 things (2 on each side, 1 in the middle) 
        /*
        {left: "50%", top: "0%"},
        {left: "0%", top: "50%"},
        {left: "50%", top: "50%"},
        {left: "100%", top: "50%"},
        {left: "50%", top: "100%"}
        */
        // 1 0 1
        // 0 1 0
        // 1 0 1
        // So the correct positions are:
        {left: "50%", top: "50%"},
        {left: "0%", top: "0%"},
        {left: "100%", top: "0%"},
        {left: "0%", top: "100%"},
        {left: "100%", top: "100%"}

    ]
    let strokeColor = "white";
    let strokeWidth = "6px";
    const icoPts = Array(5).fill(0).map((_, i) => {
        const angle = Math.PI * 2 * i / 5;
        return [-Math.sin(angle), -Math.cos(angle)];
    }).map(([x, y]) => [100 + x * 100, 100 + y * 100]).map(([x, y]) => `${x},${y}`).join(" ");
    const dodecaPts = Array(5).fill(0).map((_, i) => {
        const angle = Math.PI * 2 * i / 5;
        return [-Math.sin(angle), -Math.cos(angle)];
    }).map(([x, y]) => [100 + x * 60, 100 + y * 60]).map(([x, y]) => `${x},${y}`).join(" ");
    const dodecaLines = Array(5).fill(0).map((_, i) => {
        const angle = Math.PI * 2 * i / 5;
        return [-Math.sin(angle), -Math.cos(angle)];
    }).map(([x, y]) => ({x1:100 + x * 60, y1: 100 + y * 60, x2: 100 + x * 100, y2: 100 + y * 100}));
    let shapes = {

        Tetrahedron: <svg viewBox="0 0 200 200" width="50" height="50">
        <polygon points="100,0 187,150 12,150" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
        {/* points from the vertices to center */}
        <line x1="100" y1="0" x2="100" y2="100" stroke={strokeColor} strokeWidth={strokeWidth} /> 
        <line x1="187" y1="150" x2="100" y2="100" stroke={strokeColor} strokeWidth={strokeWidth} />
        <line x1="12" y1="150" x2="100" y2="100" stroke={strokeColor} strokeWidth={strokeWidth} />
        </svg>,
  
        Cube: <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
          <rect x="50" y="50" width="100" height="100" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
          <line x1="0" y1="0" x2="50" y2="50" stroke={strokeColor} strokeWidth={strokeWidth} />
            <line x1="200" y1="0" x2="150" y2="50" stroke={strokeColor} strokeWidth={strokeWidth} />
            <line x1="0" y1="200" x2="50" y2="150" stroke={strokeColor} strokeWidth={strokeWidth} />
            <line x1="200" y1="200" x2="150" y2="150" stroke={strokeColor} strokeWidth={strokeWidth} />
            </svg>,
        Icosahedron: <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
           { // a regular pentagon  with lines from the vertices to the middle. It should be exactly regular and centered.
           }
            <polygon points={icoPts} fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
            <line x1="100" y1="0" x2="100" y2="100" stroke={strokeColor} strokeWidth={strokeWidth} />
            <line x1="200" y1="75" x2="100" y2="100" stroke={strokeColor} strokeWidth={strokeWidth} />
            <line x1="160" y1="190" x2="100" y2="100" stroke={strokeColor} strokeWidth={strokeWidth} />
            <line x1="40" y1="190" x2="100" y2="100" stroke={strokeColor} strokeWidth={strokeWidth} />
            <line x1="0" y1="75" x2="100" y2="100" stroke={strokeColor} strokeWidth={strokeWidth} />
        </svg>,
        Dodecahedron: <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            <polygon points={dodecaPts} fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
           {/* Lines extending straight outward from the vertices to the border */}
            {
                dodecaLines.map((line, i) => <line key={"DodecaLine" + i} {...line} stroke={strokeColor} strokeWidth={strokeWidth} />)
            }
            
            {/* Lines extending from the vertices to the center */}

            </svg>,
        Octahedron: <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            {/* Square with vertices on the circle radius 100 */}
            <rect x="29" y="29" width="141" height="141" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
            {/* Lines from the vertices to the center */}
            <line x1="29" y1="29" x2="100" y2="100" stroke={strokeColor} strokeWidth={strokeWidth} />
            <line x1="171" y1="29" x2="100" y2="100" stroke={strokeColor} strokeWidth={strokeWidth} />
            <line x1="171" y1="171" x2="100" y2="100" stroke={strokeColor} strokeWidth={strokeWidth} />
            <line x1="29" y1="171" x2="100" y2="100" stroke={strokeColor} strokeWidth={strokeWidth} />
            </svg>

          
    } 
    useEffect(() => {
        document.documentElement.style.setProperty("--theme-color", defaultColors[geometry]);
        document.documentElement.style.setProperty("--theme-color-dark", defaultColorsDark[geometry]);

    })
    return (
        <div className="GeometrySelector">
            <div className="GeometrySelector_inner">
                {shapeNames.map((shapeName, i)  => {
                    let className = "GeometryButton";
                    if (shapeName === geometry) {
                        className += " selected";
                    }
                    return (
                    
                        <button className={className} style={{...(positions[i]), background: defaultColors[shapeName]}} key={`GeometrySelector__button[${shapeName}]`} onClick={() => setGeometry(shapeName)}>

                        {shapes[shapeName] ?? shapes["Cube"]}
                    </button>
                    )
                })}
            </div>
        </div>
    )
}