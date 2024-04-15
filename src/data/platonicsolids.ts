import { Box3, BoxGeometry, BufferGeometry, TypedArray } from "three";
import { Geometry } from "three/examples/jsm/deprecated/Geometry.js";
import { Vector } from "three/examples/jsm/physics/RapierPhysics.js";
import { DodecahedronGeometry, IcosahedronGeometry, OctahedronGeometry, Quaternion, TetrahedronGeometry, Vector3 } from "three/src/Three.js";
import { FinitelyGeneratedMonoid, Indexed } from "../monoid/IndexedMonoid";
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
const enumerate = function<T>(monoid: IndexedFGM<T>, indices: number[]) {
  let elements = indices.map((index) => monoid.elements[index]);
  let queue = [...elements];
  let set: number[] = [];
  while (queue.length != 0) {
    const newQueue:  Indexed<T>[] = [];
    let current;
    while (current = queue.pop()) {
      if (set.includes(current.index)) continue;
      set.push(current.index);
      for (let gen of elements) {
        const next = monoid.multiply(current, gen);
        newQueue.push(next);
      }
    }
    queue = newQueue;
  }
  return set;
}
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
      //console.log(current.index);
      order++;
    }   
    orders[order] ??= [];
    orders[order].push(prev);
  }
  //console.log({orders});
  
  const orderKeys = Object.keys(orders).map((key) => parseInt(key)).sort((a, b) => a - b);
  // Starting low, enumerate the orbits and remove them from some list
  const orbits: Record<number, number[][]> = {};
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
        //console.log(current, element);
        orbit.push(current.index);
        current = monoid.multiply(current, element);
      }  
      orbitSet.push(orbit);
    }
    orbits[order] = (orbitSet);
  }
  //console.log("ORBITS");
  //console.warn({orbits});
  return orbits;
}
  
export const enumeratePairs = function(monoid: IndexedFGM<any>) {
  const orbits = enumerateOrbits(monoid);
  const orders = new Set(Object.keys(orbits).map((key) => parseInt(key)));
  const pairs = [[2, 2], [2, 3], [3, 3], [2, 4], [2, 5]].filter(([o1, o2]) => orders.has(o1) && orders.has(o2));
  const ret: Record<string, number[]>[] = {};
  for (let [o1, o2] of pairs) {
    let generated: Record<number, string[]> = {};
    let seen: Record<number, Set<string>> = {};
    const orbitset1 = orbits[o1];
    const orbitset2 = orbits[o2];
    const pairs = [];
    for (let i = 0; i < orbitset1.length; i++) {
      for (let j = 0; j < orbitset2.length; j++) {
        const pair = [orbitset1[i][0], orbitset2[j][0]];
        const enumerated = enumerate(monoid, pair);
        const size = enumerated.length;
        generated[size] ??= [];
        const str = enumerated.sort().join(",");
        if (seen[size]?.has(str)) continue;
        seen[size] ??= new Set();
        seen[size].add(str);
        generated[size].push(enumerate(monoid, pair).sort().join(",") + "[" + pair.join(",") + "]");
        // generated[size] = [...new Set(generated[size])];
      }
    }
    //console.log({pairs});
    const key = `${o1}-${o2}`;
    ret[key] = generated;
  }
  return ret;
}


export const SolidMonoids = {
  Cube: cubeMonoid,
  Icosahedron: dodecaMonoid,
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
