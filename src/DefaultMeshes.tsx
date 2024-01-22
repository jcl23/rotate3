import { Mesh, BoxGeometry, IcosahedronGeometry, SphereGeometry, TetrahedronGeometry, DodecahedronGeometry, OctahedronGeometry } from "three";
import { makeMonoidFromGeometry } from "./monoid/makeMonoid";

export type MeshPair = {
    faceMesh: Mesh,
    edgeMesh: Mesh,
}


export const defaultShapes = {
    Cube: () => new BoxGeometry(0.9).toNonIndexed(),//new BoxGeometry(1, 1, 1).toNonIndexed(),
    Icosahedron: () => new IcosahedronGeometry(0.8).toNonIndexed(),
    Tetrahedron: () => new TetrahedronGeometry(0.8).toNonIndexed(),
    Octahedron: () => new OctahedronGeometry(0.9).toNonIndexed(),
    Dodecahedron: () => new DodecahedronGeometry(0.8).toNonIndexed(),
}
export type GeometryName = keyof typeof defaultShapes;  
export type GroupName = "1" | "Z_2" | "Z_3" | "K_4" | "Z_4" | "Z_5" | "Z_6" | "D_4" | "S_3" | "A_4" | "S_4";


export const defaultColors = {
    Cube: "#ff0000",
    Icosahedron: "#d91ca6",
    Tetrahedron: "#66ff22", 
    Octahedron: "#1c3fd9",
    Dodecahedron: "#02b4f5"
}

const cubeMonoid = makeMonoidFromGeometry(new BoxGeometry(1, 1, 1), 3, "Cube");
const icoMonoid = makeMonoidFromGeometry(new IcosahedronGeometry(1), 5, "Ico");
const tetraMonoid = makeMonoidFromGeometry(new TetrahedronGeometry(1), 3, "Tetra");
const octaMonoid = makeMonoidFromGeometry(new OctahedronGeometry(1), 4, "Octa");
const dodMonoid = makeMonoidFromGeometry(new DodecahedronGeometry(1), 3, "Dodeca");