import { GeometryName } from "../DefaultMeshes";
import { OuterGroupName } from "./subgroupData";

export type SubgroupDiagramData = {
    positions: [number, number][];
    poset: [number, number][];
    labels: string[];
}
export default {
    ["S_4"]:{

        positions: [
            [50, 90], [50, 70],  [28, 70],  [50, 50],  [28, 50], [6, 50],[80, 55], [80, 35], [28, 30], [50, 30], [50, 5], 
        ],
        poset: [
            [10, 9], [10, 7], [10, 8], [9, 6], [9, 4], [8, 5], [8, 4], [8, 3], [7, 6], [7, 1], [5, 2], [4, 2], [3, 2], [3, 1], [2, 0], [1, 0], [6, 0]
        ],
        labels: [
          "\\mathbb{1}", "\\mathbb{Z}_2", "\\mathbb{Z}_2", "\\mathbb{Z}^2_2", "\\mathbb{Z}^2_2", "\\mathbb{Z}_4", "\\mathbb{Z}_3", "S_3", "D_4", "A_4", "S_4"
        ]
    },
    ["A_5"]:{

      positions: [
          [50, 90], [20, 70],  [45, 70], [78, 70],  [10, 47], [50, 30], [40, 50], [82, 42], [50, 4],
      ],
      poset: [
          [1, 0], [2, 0], [3, 0], [4, 1], [5, 6], [6,2], [7, 3], [4, 2], [7, 2], [5, 3], [8, 7], [8, 4], [8, 5]
      ],
      labels: [
        "\\mathbb{1}", "\\mathbb{Z}_2", "\\mathbb{Z}_3", "\\mathbb{Z}_5", "\\mathbb{Z}^2_2", "\\mathbb{A}_4", "S_3", "D_10", "A_5"
      ]
  },
  ["A_4"]:{

    positions: [
        [50, 90], [50, 70], [30, 70], [10, 70], [30, 50], [75, 60], [50, 10], [50, 10], [50, 10], [50, 10], [50, 10]
    ],
    poset: [
        [10, 9], [10, 7], [10, 8], [9, 6], [9, 4], [8, 5], [8, 4], [8, 3], [7, 6], [7, 1], [5, 2], [4, 2], [3, 2], [3, 1], [2, 0], [1, 0], [6, 0]
    ],
    labels: [
      "\\mathbb{1}", "\\mathbb{Z}_2", "\\mathbb{Z}_2", "\\mathbb{Z}_2", "\\mathbb{Z}^2_2", "\\mathbb{Z}_3", "A_4"
    ]
},

    


} as Record<OuterGroupName, SubgroupDiagramData>;