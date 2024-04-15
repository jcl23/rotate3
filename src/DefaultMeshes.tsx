import { Mesh, BoxGeometry, IcosahedronGeometry, SphereGeometry, TetrahedronGeometry, DodecahedronGeometry, OctahedronGeometry, ShapeGeometry, CircleGeometry, CylinderGeometry } from "three";
import { makeMonoidFromGeometry } from "./monoid/makeMonoid";

export type SecondaryShapeName =  keyof typeof secondaryShapes;
export type MeshPair = {
    faceMesh: Mesh,
    edgeMesh: Mesh,
}


export const defaultShapes = {
    Cube: () => new BoxGeometry(1, 1, 1, 2, 2, 2).toNonIndexed(),//new BoxGeometry(1, 1, 1).toNonIndexed(),
    Icosahedron: () => new IcosahedronGeometry(0.8).toNonIndexed().rotateX(Math.PI / 2),
    Tetrahedron: () => new TetrahedronGeometry(0.8).toNonIndexed(),
    Octahedron: () => new OctahedronGeometry(0.9).toNonIndexed(),
    Dodecahedron: () => new DodecahedronGeometry(0.8).toNonIndexed(),
}

export const secondaryShapes = {
    Square: () => new BoxGeometry(0.8, 0.8, 0.1).toNonIndexed(),
    Rectangle: () => new BoxGeometry(1.2, 0.6, 0.1).toNonIndexed(),
    Pentagon: () => new CylinderGeometry(0.5, 0.5, 0.1, 5).toNonIndexed().rotateX(Math.PI / 2).translate(0, 0, 0.5),
    // Sphere: () => new SphereGeometry(0.2).toNonIndexed(),
    Triangle: () => new CylinderGeometry(0.5, 0.5, 0.1, 3).toNonIndexed().rotateX(Math.PI / 2).rotateZ(Math.PI / 6).translate(0, 0, -0.1),
    None: () => new ShapeGeometry().toNonIndexed(),
    Line: () => new ShapeGeometry().toNonIndexed(),
    Tetrahedron: () => new TetrahedronGeometry(0.8).toNonIndexed(),

}
export type GeometryName = keyof typeof defaultShapes;  
export type GroupName = "1" | "Z_2" | "Z_3" | "K_4" | "Z_4" | "Z_5" | "Z_6" | "D_8" | "S_3" | "A_4" | "S_4" | "A_5" | "D_10";




// const cubeMonoid = makeMonoidFromGeometry(new BoxGeometry(1, 1, 1), 3, "Cube");
// const icoMonoid = makeMonoidFromGeometry(new IcosahedronGeometry(1), 5, "Ico");
// const tetraMonoid = makeMonoidFromGeometry(new TetrahedronGeometry(1), 3, "Tetra");
// const octaMonoid = makeMonoidFromGeometry(new OctahedronGeometry(1), 4, "Octa");
// const dodMonoid = makeMonoidFromGeometry(new DodecahedronGeometry(1), 3, "Dodeca");