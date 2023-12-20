import { CayleyGraphProps } from "./CayleyGraph";
import { GeometryName } from "./DefaultMeshes";
import subgroupData, { Subgroup } from "./data/subgroupData";
import subgroupDiagramData from "./data/subgroupDiagramData";

type SampleData = {
    name: GeometryName,
    cayleyGraph: CayleyGraphProps,
    subgroups: Subgroup[]
}
export function StatusComponent() {
    
    const status: Record<GeometryName, SampleData> = {
        Cube: {
            name: "Cube",
            cayleyGraph: CayleyGraph

        },
        Icosahedron: {

        },
        Tetrahedron: {

        },
        Octahedron: {

        },
        Dodecahedron: {

        }
    }
    
    return (
        <div className="Status__outer">
            
        </div>
    );
}  