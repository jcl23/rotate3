import { Quaternion } from "three";
import { defaultShapes } from "../DefaultMeshes";
import { Transform } from "../Display";
import { Vector2 } from "three/src/math/Vector2.js";
export type Example = {
    shape: keyof typeof defaultShapes,
    generators: Transform[],
    vertices: Vector2[],
    edges: [number, number][],   
}

export const examples: Record<keyof typeof defaultShapes, Example> = {
    "box": {
        shape: "box",
        generators: [],
        edges: [],
        vertices: [new Vector2(0, 0)],
    },
}