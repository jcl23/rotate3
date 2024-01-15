import { GeometryName } from "../DefaultMeshes";

export type SubgroupDiagramData = {
    positions: [number, number][];
    poset: [number, number][];
    labels: string[];
}
export default {
    ["Cube"]:{

        positions: [
            [50, 85], [50, 67],  [28, 67],  [50, 50],  [28, 50], [10, 50],[80, 55], [80, 35], [28, 30], [50, 25], [50, 0]
        ],
        poset: [
            [10, 9], [10, 7], [10, 8], [9, 6], [9, 4], [8, 5], [8, 4], [8, 3], [7, 6], [7, 1], [5, 2], [4, 2], [3, 2], [3, 1], [2, 0], [1, 0], [6, 0]
        ],
        labels: [
          "\\mathbb{1}", "\\mathbb{Z}_2", "\\mathbb{Z}_2", "\\mathbb{Z}^2_2", "\\mathbb{Z}^2_2", "\\mathbb{Z}_4", "\\mathbb{Z}_3", "S_3", "D_4", "A_4", "S_4"
        ]
    },

    ["Tetrahedron"]:{

        positions: [
        ],
        poset: [
        ],
        labels: [
          "\\mathbb{1}"
        ]
    },
    ["Icosahedron"]:{

        positions: [
        ],
        poset: [
        ],
        labels: [
          "\\mathbb{1}"
        ]
    },
    ["Dodecahedron"]:{

        positions: [
        ],
        poset: [
        ],
        labels: [
          "\\mathbb{1}"
        ]
    },
    ["Octahedron"]:{

        positions: [
        ],
        poset: [
        ],
        labels: [
          "\\mathbb{1}"
        ]
    },
    


} as Record<GeometryName, SubgroupDiagramData>;