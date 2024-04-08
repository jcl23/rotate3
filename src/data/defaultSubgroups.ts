import { GeometryName } from "../DefaultMeshes";
import { OuterGroupName, SubgroupName } from "./subgroupData";

const Cube: SubgroupName<"S_4"> = "A_4";
const Icosahedron: SubgroupName<"A_5"> = "A_4";
const Dodecahedron: SubgroupName<"A_5"> = "A_4";
const Octahedron: SubgroupName<"S_4"> = "A_4";
const Tetrahedron: SubgroupName<"A_4"> = "A_4";
export default {
    Cube, Icosahedron, Dodecahedron, Octahedron, Tetrahedron
} as Record<GeometryName, SubgroupName<OuterGroupName>>;