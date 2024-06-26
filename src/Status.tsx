import { CayleyGraphProps } from "./ui/cayleygraph/CayleyGraph";
import { GeometryName } from "./DefaultMeshes";
import subgroupData, { SubgroupData } from "./data/subgroupData";
import subgroupDiagramData from "./data/subgroupDiagramData";

type SampleData = {
    name: GeometryName,
    cayleyGraph: CayleyGraphProps,
    subgroups: SubgroupData[]
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