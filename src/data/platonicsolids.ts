import { Box3, BoxGeometry, BufferGeometry, TypedArray } from "three";
import { Geometry } from "three/examples/jsm/deprecated/Geometry.js";
import { Vector } from "three/examples/jsm/physics/RapierPhysics.js";
import { DodecahedronGeometry, IcosahedronGeometry, OctahedronGeometry, Quaternion, TetrahedronGeometry, Vector3 } from "three/src/Three.js";
import { FinitelyGeneratedMonoid } from "../monoid/IndexedMonoid";
import { POS_ID, getPointsFromGeom, makeMonoidFromGeometry } from "../monoid/makeMonoid";
import { GroupName, defaultShapes } from "../DefaultMeshes";
import { IndexedFGM } from "../monoid/IndexedMonoid";
type SolidNames =
  | "Cube"
  | "Tetrahedron"
  | "Octahedron"
  | "Dodecahedron"
  | "Icosahedron";

const topFaceRotation = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0).normalize(), Math.PI * 2 / 4);
const cubeMonoid = makeMonoidFromGeometry(new BoxGeometry(1, 1, 1), 3, "Cube", [topFaceRotation]);
const icoMonoid = makeMonoidFromGeometry(new IcosahedronGeometry(1), 5, "Icosahedron");
const dodecaMonoid = makeMonoidFromGeometry(new DodecahedronGeometry(1), 3, "Dodecahedron");
const tetraMonoid = makeMonoidFromGeometry(new TetrahedronGeometry(1), 3, "Tetrahedron");
// const octaMonoid = makeMonoidFromGeometry(new OctahedronGeometry(1), 4, "Octahedron");
// const dodMonoid = makeMonoidFromGeometry(new DodecahedronGeometry(1), 3, "Dodecahedron");

export const enumerateOrbits = (monoid: IndexedFGM<any>) => {
  // calcualte the order of each element and console log it
  const orders = {};
  for (let i = 0; i < monoid.elements.length; i++) {
    const element = monoid.elements[i];
   // calcualte by hand
    let order = 1;
    let current = element;
    let prev = monoid.identity;
    while (current.index != 0) {
      prev = current;
      current = monoid.multiply(current, element);
      console.log(current.index);
      order++;
    }   
    orders[order] ??= [];
    orders[order].push(prev);
  }
  console.log({orders});
  const orderKeys = Object.keys(orders).map((key) => parseInt(key)).sort((a, b) => a - b);
  // Starting low, enumerate the orbits and remove them from some list
  const orbits: number[][][] = [];
  const unseen = new Set(monoid.elements.map((_, i) => i));
  for (let order of orderKeys) {
    const elements = orders[order];
    const orbitSet: number[][] = [];
    for (let element of elements) {
      let current = element;
      if (!unseen.has(current.index)) continue;
      let orbit: number[] = [];
      while (current.index != 0) {
        unseen.delete(current.index);
        console.log(current, element);
        orbit.push(current.index);
        current = monoid.multiply(current, element);
      }  
      if (orbit.length) orbitSet.push(orbit);
    }
    orbits.push(orbitSet);
  }
  console.log("ORBITS");
  console.log({orbits});
}
  



export const SolidMonoids = {
  Cube: cubeMonoid,
  Icosahedron: icoMonoid,
  Tetrahedron: tetraMonoid,
  Octahedron: cubeMonoid,
  Dodecahedron: dodecaMonoid,
  // Octahedron: octaMonoid,
  // Dodecahedron: dodMonoid,
} as Record<SolidNames, IndexedFGM<any>>;
SolidMonoids.Cube.name = "S_4";
SolidMonoids.Octahedron.name = "S_4";
SolidMonoids.Tetrahedron.name = "A_4";
SolidMonoids.Icosahedron.name = "A_5";
SolidMonoids.Dodecahedron.name = "A_5";

export const monoids: Partial<Record<GroupName, IndexedFGM<number>>> = {
  
}
