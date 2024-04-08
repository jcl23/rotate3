// a function that makes a quaternion into a formatted matrix in mathajax

import { MathJax } from "better-react-mathjax";
import React, { ReactElement, useMemo, useState } from "react";
import { Quaternion } from "three";


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

const dict: Record<string, ReactElement> = {};
const range = 5;
const roots = [2, 3, 5];
const hash = (c: number) => Math.round(c * 1618);
const query = (c: number) => dict[hash(c)] ?? c;   
dict[0] = <>0</>;

type QuaternionDisplayMode = "orthogonal" | "matrix" | "euler" | "axis-angle";
// for loop: code begins here
// for each root, and then for each choice of pair of coefficients, add the value to the dictionary with its representation as the string.
for (let root of roots) {
    for (let [n1, d1] of fractions) {
        for (let [n2, d2] of fractions) {
            const c1 = n1 / d1;
            const c2 = n2 / d2;
            const value = c1 + c2 * Math.sqrt(root);
            const hashValue = hash(value);
            if (dict[hashValue] !== undefined) {
                continue;
            }
           
            const n1_str = (n1 == 1) ? n1 : (n1 == -1) ? "-1" : n1;
            const symbol = (n2 == 0) ? "" : (n2 < 0 || n1 < 0) ? "-" : "+";
            n2 = Math.abs(n2);
            const n2_str = (n2 == 1) ? ""  : n2;
    
            const c1_str = (d1 == 1) ? `${n1}` : `${n1_str}/${d1}`;
            const c2_str = (d2 == 1) ? `${n2}` : `${n2_str}√${root}/${d2}`;
            if (n1 == 0) {
                if (n2 == 0) {
                    dict[hashValue] = <>0</>;
                    continue;
                }
                dict[hashValue] = <>{`${c2_str}`}</>;
                continue;   
            }
            if (n2 == 0) {
                dict[hashValue] = <>{`${c1_str}`}</>;
                continue;
            }
            if (d1 == d2) {
                dict[hashValue] =<><div className={"fraction_top"}>{`${n1_str} ${symbol} ${n2_str}√${root}`}</div><div className={"fraction_bottom"}>{`${d1}`}</div></>;
            } else {
                dict[hashValue] = <>{`${c1_str} ${symbol} ${c2_str}`}</>;
            }
        }
    }
}
console.log("Updated dict:", {dict})

const QuaternionDisplay = {
    
    ["matrix"]: function(q: Quaternion): ReactElement {
        let {w: w_raw, z: z_raw, x: x_raw, y: y_raw} = q;
        if (w_raw < 0) {
            w_raw = -w_raw;
            x_raw = -x_raw;
            y_raw = -y_raw;
            z_raw = -z_raw;
        }
       // w, x, y, z, minusx, minusy, minusz
       console.log({w_raw, x_raw, y_raw, z_raw})
       console.log(query(-0))
        const w = <td>{query(w_raw)}</td>;
        const x = <td>{query(x_raw)}</td>;
        const y = <td>{query(y_raw)}</td>;
        const z = <td>{query(z_raw)}</td>;


        const minusx = <td>{query(-x_raw)}</td>;
        const minusy = <td>{query(-y_raw)}</td>;
        const minusz = <td>{query(-z_raw)}</td>;

        const matrix = [
            [w, minusx, minusy, minusz],
            [x, w, minusz, y],
            [y, z, w, minusx],
            [z, minusy, x, w]
        ];
        return (
            <div style={{display: "inline-flex", height: "100%", paddingLeft: "10px", paddingRight: "10px"}}>
            <div style={{height: "calc(100% - 20px)", width: "10px", marginTop: "3px", border: "solid black", borderWidth: "3px 0px 3px 3px", borderTopLeftRadius: "2.5px", borderBottomLeftRadius: "2.5px", marginRight: "-16px"}} />
                
            <table className={"DisplayQuaternion"} style={{ borderCollapse: "collapse", fontSize: "20px"}}>
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
            <div style={{height: "calc(100% - 20px)", width: "10px", marginTop: "3px", border: "solid black", borderWidth: "3px 3px 3px 0px", borderTopRightRadius: "2.5px", borderBottomRightRadius: "2.5px", marginLeft: "-16px"}} />
            </div>
            )
            return String.raw`\begin{bmatrix}
            ${matrix[0][0]} & ${matrix[0][1]} & ${matrix[0][2]} & ${matrix[0][3]} \\
            ${matrix[1][0]} & ${matrix[1][1]} & ${matrix[1][2]} & ${matrix[1][3]} \\
            ${matrix[2][0]} & ${matrix[2][1]} & ${matrix[2][2]} & ${matrix[2][3]} \\
            ${matrix[3][0]} & ${matrix[3][1]} & ${matrix[3][2]} & ${matrix[3][3]}
        \end{bmatrix}`;

    },
    ["quaternion"]: function(q: Quaternion): string {
        
        // format like xi + yj + zk (we don't include w because it is a rotation)
        let {w: w_raw, z: z_raw, x: x_raw, y: y_raw} = q;
        
        if (w_raw < 0) {
            w_raw = -w_raw;
            x_raw = -x_raw;
            y_raw = -y_raw;
            z_raw = -z_raw;
        }
        let w = query(w_raw);
        let x = query(x_raw);
        let y = query(y_raw);
        let z = query(z_raw);
        let terms: string[] = [];
        let notAlmostZero = (c: number) => Math.abs(c) > 0.0001;
        if (notAlmostZero(w_raw)) {
            terms.push(`${w}`);
        }
        if (notAlmostZero(x_raw)) {
            terms.push(`${x}i`);
        }
        if (notAlmostZero(y_raw)) {
            terms.push(`${y}j`);
        }
        if (notAlmostZero(z_raw)) {
            terms.push(`${z}k`);
        }
       
        return String.raw`\[${terms.join(" + ")}\]`;  
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
}
export const DisplayQuaternion = ({ quaternion, mode = "matrix" }: QuaternionDisplayProps) => {


        // fractions: an array containing every fraction that is commonly used in representing rotations of degree 2, 3, 4, 5, or 6 in the complex plane.
        
    console.log({query});
        

    return QuaternionDisplay[mode](quaternion);
    console.log(outstr);
    return (
            
                <table>
                  

                </table>
               
                        )
}