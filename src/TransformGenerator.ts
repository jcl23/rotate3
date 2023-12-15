// Code by Justin Lee

import { Quaternion } from "three/src/math/Quaternion.js";
import { Vector3 } from "three/src/math/Vector3.js";
import { Transform } from "./Display";

export type TransformGenerator = {
    name: string,
    transform: Transform,
}

export const CubeGenerators: Transform[] = [
     
    { 
        rotation: new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), Math.PI / 2) ,
        position: new Vector3(0, 0, 0), 
    } ,
    {  
        rotation: new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2), 
        position: new Vector3(0, 0, 0), 
    },
    { 
        rotation: new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), Math.PI / 2),
        position: new Vector3(0, 0, 0), 
    },
    
]

export const IcosahedronGenerators: TransformGenerator[] = [
    { name: "X", transform: { 
        rotation: new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), Math.PI / 2) ,
        position: new Vector3(0, 0, 0), 
    } },
    { name: "Y",  transform: {  
        rotation: new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2), 
        position: new Vector3(0, 0, 0), 
    } },
    { name: "Z",  transform: { 
        rotation: new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), Math.PI / 2),
        position: new Vector3(0, 0, 0), 
    } },
    
]

