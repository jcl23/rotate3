import {
  BufferGeometry,
  Color,
  CylinderGeometry,
  Line,
  LineBasicMaterial,
  Vector3,
} from "three";
import { CayleyGraphData, CayleyGraphEdges } from "./CayleyGraph";
import { GEN_COLORS } from "./cfg/colors";

import { i_edge } from "./ui/CayleyGraphEditor";


const DEPTH = 0.01;

function edgesToCylinders(edgesGeometry, thickness) {
  const { position } = edgesGeometry.attributes;
  const { array, count } = position;
  const r = thickness / 2;
  const geoms = [];
  for (let i = 0; i < count * 3 - 1; i += 6) {
    const a = new Vector3(array[i], array[i + 1], array[i + 2]);
    const b = new Vector3(array[i + 3], array[i + 4], array[i + 5]);

    const vec = new Vector3().subVectors(b, a);
    const len = vec.length();
    const geom = new CylinderGeometry(r, r, len, 8);
    geom.translate(0, len / 2, 0);
    geom.rotateX(Math.PI / 2);
    geom.lookAt(vec);
    geom.translate(a.x, a.y, a.z);
    geoms.push(geom);
  }
}

export const StaticGraph = function ({ edges, vertices }: CayleyGraphData) {
  const toLine = ([from, to]: [Vector3, Vector3], color: Color) => {
    if (color === undefined) {
      throw new Error("color is undefined");
    }
    const div = document.createElement("div");
    const length = from.distanceTo(to);
    let slope = (to.y - from.y) / (to.x - from.x);
    if (slope === Infinity) slope = 1000000;
    const angle = Math.atan(slope);
    const x = (from.x + to.x) / 2;
    const y = (from.y + to.y) / 2;
    const width = (to.x - from.x);
    const height = (to.y - from.y);
    // convert this to react style element 
    return <div style={{
      transform: `translate(${-width / 2 + x}px, ${height / 2 + y}px) rotate(${angle}rad)`,
      width: `${length}px`,
      height: `${3}px`,
      background: color.getStyle(),
      position: "absolute",
      zIndex: "100",
      borderRadius: "3px",
      transformOrigin: "left"
    }}/>;



  };


  const listToReturn = edges.map((list, listIndex) => list.map(([i, j], edgeIndex) => {
    const [p1, p2] = i_edge ([vertices[i], vertices[j]]);
    return toLine([p1, p2], GEN_COLORS[listIndex % GEN_COLORS.length]);
  })).flat(1);
  return (
    <>
      {listToReturn}
      </>
  );
};
