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
const tetraMonoid = makeMonoidFromGeometry(new TetrahedronGeometry(1), 3, "Tetrahedron");
const octaMonoid = makeMonoidFromGeometry(new OctahedronGeometry(1), 4, "Octahedron");
const dodMonoid = makeMonoidFromGeometry(new DodecahedronGeometry(1), 3, "Dodecahedron");

export const SolidMonoids = {
  Cube: cubeMonoid,
  Icosahedron: icoMonoid,
  Tetrahedron: tetraMonoid,
  Octahedron: octaMonoid,
  Dodecahedron: dodMonoid,
};

export const monoids: Partial<Record<GroupName, IndexedFGM<any>>> = {
  
}
