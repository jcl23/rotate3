import {
  BufferGeometry,
  Color,
  CylinderGeometry,
  Line,
  LineBasicMaterial,
  Vector3,
} from "three";
import { CayleyGraphEdges } from "./CayleyGraph";
import { GEN_COLORS } from "./cfg/colors";

export type StaticGraphProps = {
  graphEdges: [Vector3, Vector3][][];
};

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

export const StaticGraph = function ({ graphEdges }: StaticGraphProps) {
  const toLine = ([from, to]: [Vector3, Vector3], color: Color) => {
    const geometry = new BufferGeometry().setFromPoints([from, to]);
    geometry.translate(0, 0, -DEPTH);
    const material = new LineBasicMaterial({ color });
    const line = new Line(geometry, material);
    return line;
  };
  return (
    <mesh>
      {graphEdges.map((list, listIndex) =>
        list.map(([from, to], i) => (
          <primitive
            key={`graphEdgePrimitive${i}`}
            object={toLine([from, to], GEN_COLORS[listIndex])}
          />
        ))
      )}
    </mesh>
  );
};
