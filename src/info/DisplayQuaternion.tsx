// a function that makes a quaternion into a formatted matrix in mathajax

import { MathJax } from "better-react-mathjax";
import React, { ReactElement, useMemo, useState } from "react";
import { Quaternion } from "three";
import { SectionTitle } from "./SectionTitle";
import { MemoizedMathJax } from "../ui/MemoizedMathJax";


const decimalToExtendedReal = function( decimal: number, roots_adjoined: number[] ) {
    // For example, if roots_adjoined is [2], then the number 1 + sqrt(2) is represented as [1, 1]
    // We want to search from zero all the numbers around zero to see if some combination of a + b sqrt(2) is equal to the decimal.
    // If we find a match, we return the pair [a, b]
    // If we don't find a match, we return the pair [0, 0]
    // for loop: code begins here
    const maxOut = 5;

    const roots = roots_adjoined.map((root) => Math.sqrt(root));
    let maxOut2 = maxOut / roots[0];
    console.log("from decimalToExtended real: Roots:", roots);
    let close = (j: number, k: number) => Math.abs(j - k) < 0.0001;
    for (let a = -maxOut; a <= -maxOut; a++) {
        for (let b = -maxOut2; b <= maxOut2; b++) {
            if (close(a + b * roots[0], decimal)) {
                return [a, b];
            }
        }
    }
    return [decimal, 0]
}

const fractions = [  
    [0, 1], [1, 1], [1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 6], [5, 6],
    [-1, 1], [-1, 2], [-1, 3], [-2, 3], [-1, 4], [-3, 4], [-1, 5], [-2, 5], [-3, 5], [-4, 5], [-1, 6], [-5, 6]
];
// the above list, but where each fraction is a tuple of numerator and denominator

const matrixDict: Record<string, ReactElement> = {};
const quaternionDict: Record<string, (axis: number) => string> = {};
const range = 5;
const roots = [2, 3, 5];
const hash = (c: number) => Math.round(c * 1618);
const query = (c: number) => matrixDict[hash(c)] ?? c;   
const quaternionQuery = (c: number) => quaternionDict[hash(c)] ?? c;
matrixDict[0] = <>0</>;

type QuaternionDisplayMode = "orthogonal" | "matrix" | "euler" | "axis-angle";
// for loop: code begins here
// for each root, and then for each choice of pair of coefficients, add the value to the dictionary with its representation as the string.
for (let root of roots) {
    for (let [wholeNum, wholeDenom] of fractions) {
        for (let [radNum, radDenom] of fractions) {
            const c1 = wholeNum / wholeDenom;
            const c2 = radNum / radDenom;
            const value = c1 + c2 * Math.sqrt(root);
            const hashValue = hash(value);
            if (matrixDict[hashValue] !== undefined) {
                continue;
            }
           
            const wholeNum_str = (wholeNum == 1) ? wholeNum : (wholeNum == -1) ? "-1" : wholeNum;
            const symbol = (radNum == 0) ? "" : (radNum < 0 || wholeNum < 0) ? "-" : "+";
            radNum = Math.abs(radNum);
            const radNum_str = (radNum == 1) ? ""  : radNum;
    
            const c1_str_flat = (wholeDenom == 1) ? `${wholeNum}` : `${wholeNum_str}/${wholeDenom}`;
            const c2_str_flat = (radDenom == 1) ? `${radNum}` : `${radNum_str}√${root}/${radDenom}`;
            const axisNames = ["", "\\bf i", "\\bf j", "\\bf k"];
            
            const formatRadCoef = function (axisIndex: number, n: number, root: number) {
                if (n == 0) {
                    return "0";
                }
                if (n == 1) {
                    return `\\sqrt{${root}}${axisNames[axisIndex]}`;
                } else if (n == -1) {
                    return `-\\sqrt{${root}}${axisNames[axisIndex]}`;
                }
                return `${n}\\sqrt{${root}}${axisNames[axisIndex]}`;
            }
            const formatCoef = function (axisIndex: number, n: number) {
                if (n == 0) {
                    return "0";
                }
                if (n == 1) {
                    if (axisIndex == 0) {
                        return "1"
                    } else {
                        return axisNames[axisIndex];
                    }
                } else if (n == -1) {
                    if (axisIndex == 0) {
                        return "-1";
                    } else {
                        return `-${axisNames[axisIndex]}`;
                    }
                }
                return `${n}${axisNames[axisIndex]}`;
            } 
            if (wholeNum == 0) {
                if (radNum == 0) {
                    matrixDict[hashValue] = <>0</>;
                    quaternionDict[hashValue] = () => "0";
                    continue;
                }
                matrixDict[hashValue] = <>{`${c2_str_flat}`}</>;
                if (radDenom == 1) {
                    quaternionDict[hashValue] = (i) => `${formatRadCoef(i, radNum, root)}`;
                } else {
                    quaternionDict[hashValue] = (i) => `\\frac{${formatRadCoef(i, radNum, root)}}{${radDenom}}`;
                }
                continue;   
            }
            if (radNum == 0) {
                matrixDict[hashValue] = <>{`${c1_str_flat}`}</>;
                //quaternionDict[hashValue] = (i) => `${wholeNum_str}${axisNames[i]}`;
                if (wholeDenom == 1) {
                    quaternionDict[hashValue] = (i) => `${formatCoef(i, wholeNum)}`;
                } else {
                    quaternionDict[hashValue] = (i) => `\\frac{${formatCoef(i, wholeNum)}}{${wholeDenom}}`;
                }

                continue;
            } else if (wholeDenom == radDenom) {
                matrixDict[hashValue] =<><div className={"fraction_top"}>{`${wholeNum_str} ${symbol} ${radNum_str}√${root}`}</div><div className={"fraction_bottom"}>{`${wholeDenom}`}</div></>;
                quaternionDict[hashValue] = (i) => `\\frac{${wholeNum_str} + ${radNum_str}\\sqrt{${root}}}{${wholeDenom}}${axisNames[i]}`;
            } else {
                matrixDict[hashValue] = <>{`${c1_str_flat} ${symbol} ${c2_str_flat}`}</>;
                quaternionDict[hashValue] = (i) => `\\frac{${wholeNum} + ${radNum_str}\\sqrt{${root}}}{${wholeDenom}}${axisNames[i]}`;
            }
        }
    }
}
console.log("Updated matrixDict:", {matrixDict})

const QuaternionDisplay = {
    
    ["matrix"]: function(q: Quaternion, memo: Map<string, ReactElement>, name: string): ReactElement {
        let {w: w_raw, z: z_raw, x: x_raw, y: y_raw} = q;
        if (w_raw < 0) {
            w_raw = -w_raw;
            x_raw = -x_raw;
            y_raw = -y_raw;
            z_raw = -z_raw;
        }
        // w, x, y, z, minusx, minusy, minusz
        const key = `${x_raw.toFixed(3)}+${y_raw.toFixed(3)}+${z_raw.toFixed(3)}`;


        if (false && memo && memo.has(key)) {
            return memo.get(key);
        }

        const x_text = query(x_raw);
        const y_text = query(y_raw);
        const z_text = query(z_raw);

        const w = <td>{query(w_raw)}</td>;
        const x = <td>{x_text}</td>;
        const y = <td>{y_text}</td>;
        const z = <td>{z_text}</td>;


        const minusx = <td>{query(-x_raw)}</td>;
        const minusy = <td>{query(-y_raw)}</td>;
        const minusz = <td>{query(-z_raw)}</td>;

        const matrix = [
            [w, minusx, minusy, minusz],
            [x, w, minusz, y],
            [y, z, w, minusx],
            [z, minusy, x, w]
        ];


        const table = (
            <table className={"QuaternionMatrix"} style={{ borderCollapse: "collapse", fontSize: "20px"}}>
                <tr>
                    {matrix[0][0]}
                    {matrix[0][1]}
                    {matrix[0][2]}  
                    {matrix[0][3]}
                </tr>
                <tr>
                    {matrix[1][0]}
                    {matrix[1][1]}
                    {matrix[1][2]}
                    {matrix[1][3]}
                </tr>
                <tr>
                    {matrix[2][0]}
                    {matrix[2][1]}
                    {matrix[2][2]}
                    {matrix[2][3]}
                </tr>
                <tr>
                    {matrix[3][0]}
                    {matrix[3][1]}
                    {matrix[3][2]}
                    {matrix[3][3]}
                </tr>
            </table>
        );

        if (memo) memo.set(key, table);

        return (
            <div style={{display: "flex", height: "100%", paddingLeft: "10px", paddingRight: "10px"}}>
                <div style={{ width: "10px", marginTop: "-3px", borderStyle: "solid", borderColor: "var(--TEXT)", borderWidth: "3px 0px 3px 3px", borderTopLeftRadius: "2.5px",  borderRight: "0px", borderBottomLeftRadius: "2.5px", marginRight: "-16px"}} />
                {table}
            
                <div style={{width: "10px", marginTop: "-3px",  border: "3px solid var(--TEXT)", borderLeft: "0px",  borderTopRightRadius: "2.5px", borderBottomRightRadius: "2.5px", marginLeft: "-16px"}} />
            </div>
            )
            return String.raw`\begin{bmatrix}
            ${matrix[0][0]} & ${matrix[0][1]} & ${matrix[0][2]} & ${matrix[0][3]} \\
            ${matrix[1][0]} & ${matrix[1][1]} & ${matrix[1][2]} & ${matrix[1][3]} \\
            ${matrix[2][0]} & ${matrix[2][1]} & ${matrix[2][2]} & ${matrix[2][3]} \\
            ${matrix[3][0]} & ${matrix[3][1]} & ${matrix[3][2]} & ${matrix[3][3]}
        \end{bmatrix}`

    },
    ["quaternion"]: function(q: Quaternion, memo: Map<string, ReactElement>, name: string ): ReactElement  {
        
        // format like xi + yj + zk (we don't include w because it is a rotation)
        let {w: w_raw, z: z_raw, x: x_raw, y: y_raw} = q;
        
        if (w_raw < 0) {
            w_raw = -w_raw;
            x_raw = -x_raw;
            y_raw = -y_raw;
            z_raw = -z_raw;
        }
        let w = quaternionQuery(w_raw);
        let x = quaternionQuery(x_raw);
        let y = quaternionQuery(y_raw);
        let z = quaternionQuery(z_raw);
        let terms: string[] = [];
        let notAlmostZero = (c: number) => Math.abs(c) > 0.0001;
        if (notAlmostZero(w_raw)) {
            terms.push(w(0));
        }
        if (notAlmostZero(x_raw)) {
            terms.push(x(1));
        }
        if (notAlmostZero(y_raw)) {
            terms.push(y(2));
        }
        if (notAlmostZero(z_raw)) {
            terms.push(z(3));
        }
        let text = terms.reduce((prev, curr) =>prev + " + " + curr);
        if (name != undefined) text = name + " = " + text;
        return <MathJax className="MemoizedMathJax" hideUntilTypeset={"every"}>{String.raw`\[${text}\]`}</MathJax>
    },
    // temp
    ["orthogonal"]: function(q: Quaternion): string {
        return "";
    },
    ["euler"]: function(q: Quaternion): string {
        return "";
    },
    ["axis-angle"]: function(q: Quaternion): string {
        return ""
    }
}



type QuaternionDisplayProps = {
    quaternion: Quaternion;
    mode: QuaternionDisplayMode;
    name?: string,
}
export const DisplayQuaternion = ({ quaternion, name,  mode = "matrix", ...props }: QuaternionDisplayProps) => {


        // fractions: an array containing every fraction that is commonly used in representing rotations of degree 2, 3, 4, 5, or 6 in the complex plane.
    
    const memo = new Map<string, ReactElement>();

    console.log({query});
    let style = {};
    if (props.style) {
        // create new object based on props.style, copy the stuff over
        style = {...props.style};
    }
    style.color = "var(--TEXT)";
    style.height = "calc(100% - 10px)";
        
    const titles = {
        "matrix": "Rotation Matrix",
        "quaternion": "Quaternion",
        "orthogonal": "Orthogonal",
        "euler": "Euler",
        "axis-angle": "Axis-Angle"
    }
    return <div style={style}>
        {QuaternionDisplay[mode](quaternion, memo, name)}
    </div>
    console.log(outstr);
    return (
            
                <table>
                  

                </table>
               
                        )
}