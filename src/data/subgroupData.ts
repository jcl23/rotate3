import { Group } from "three/examples/jsm/libs/tween.module.js";
import { GeometryName, GroupName } from "../DefaultMeshes";

export type SubgroupData = {
    name: string;
    generators: number[];
    parents?: number[];
};

export type ConjugacyClass = {
    flatIndex?: number;
    name: GroupName;
    displayName: string;
    members: SubgroupData[];
    // generators: number[];
};

export type IsomorphismClass = {
    name: GroupName;
    displayName: string;
    conjugacyClasses: ConjugacyClass[];
};
export type SubgroupsData = Partial<
    Record<GeometryName, Partial<Record<GroupName, SubgroupData[]>>>
>;
export type OuterGroupName = "S_4" | "A_4" | "A_5";
// 1. Begin with the "big" groups - the ones for the whole shapes.
// 2. Using lagranges theorem, calculate the possible orders of subgroups
// 3. For each order, calculate the possible subgroups
/*
    a. We can do this for small groups with brute force, starting with the power set of our finite set (< 6).
    b. For each element in the power set, the permutations on that define a group.
*/
// typescript conditionals to make lists based off each shape name
export type SubgroupName<T extends OuterGroupName> = T extends "S_4"
    ? "1" | "Z_2" | "Z_3" | "Z_4" | "D_4" | "K_4" | "S_3" | "A_4" | "S_4"
    : T extends "A_4"
    ? "1" | "Z_2" | "Z_3" | "K_4" | "A_4"
    : T extends "A_5"
    ? "1" | "Z_2" | "K_4" | "Z_3" | "S_3" | "A_4" | "Z_5" | "D_10" | "A_5"
    : "1";
//export type SubgroupName = SubgroupName<OuterGroupName>;

export type GeometryGroupData<T extends GeometryName> = T extends
    | "Cube"
    | "Octahedron"
    ? "S_4"
    : T extends "Icosahedron" | "Dodecahedron"
    ? "A_5"
    : T extends "Tetrahedron"
    ? "A_4"
    : "1";

type x = SubgroupName<OuterGroupName>;

export type SubgroupRecord = {
    [K in OuterGroupName]: Record<SubgroupName<K>, IsomorphismClass>;
};

const subgroupsData: SubgroupRecord = {
    S_4: {
        1: {
            name: "1",
            displayName: String.raw`\mathbb{1}`,
            conjugacyClasses: [
                {
                    name: "1",
                    displayName: String.raw`\mathbb{1}`,
                    members: [{ name: "*", generators: [] }],
                },
            ],
        },
        Z_2: {
            name: "Z_2",
            displayName: String.raw`C_2`,
            conjugacyClasses: [
                {
                    name: "Z_2",
                    displayName: String.raw`C_2`,
                    members: [
                        { name: "Edge 1", generators: [17] },
                        { name: "Edge 2", generators: [19] },
                        { name: "Edge 3", generators: [20] },
                    ],
                },
                {
                    name: "Z_2",
                    displayName: String.raw`C_2`,
                    members: [
                        { name: "Face 1", generators: [12] },
                        { name: "Face 2", generators: [8] },
                        { name: "Face 3", generators: [7] },
                    ],
                },
            ],
        },
        K_4: {
            name: "K_4",
            displayName: String.raw`C_2^2`,
            conjugacyClasses: [
                {
                    name: "K_4",
                    displayName: String.raw`C_2^2`,
                    members: [
                        { name: "", generators: [17, 8] },
                        { name: "", generators: [19, 20] },
                        { name: "", generators: [20, 17] },
                    ],
                },
                {
                    name: "K_4",
                    displayName: String.raw`C_2^2`,
                    members: [
                        { name: "", generators: [12, 8] },
                        { name: "", generators: [8, 7] },
                        { name: "", generators: [7, 12] },
                    ],
                },
            ],
        },
        Z_4: {
            name: "Z_4",
            displayName: String.raw`C_4`,
            conjugacyClasses: [
                {
                    name: "Z_4",
                    displayName: String.raw`C_4`,
                    members: [
                        { name: "", generators: [5] },
                        { name: "", generators: [9] },
                        { name: "", generators: [16] },
                    ],
                },
            ],
        },
        Z_3: {
            name: "Z_3",
            displayName: String.raw`C_3`,
            conjugacyClasses: [
                {
                    name: "Z_3",
                    displayName: String.raw`C_3`,
                    members: [
                        { name: "", generators: [1] },
                        { name: "", generators: [2] },
                        { name: "", generators: [3] },
                        { name: "", generators: [4] },
                    ],
                },
            ],
        },
        S_3: {
            name: "S_3",
            displayName: String.raw`S_3`,
            conjugacyClasses: [
                {
                    name: "S_3",
                    displayName: String.raw`S_3`,
                    members: [
                        { name: "", generators: [1, 11] },
                        { name: "", generators: [2, 14] },
                        { name: "", generators: [3, 17] },
                        { name: "", generators: [4, 20] },
                    ],
                },
            ],
        },
        D_4: {
            name: "D_4",
            displayName: String.raw`\mathbb{D}_4`,
            conjugacyClasses: [
                {
                    name: "D_4",
                    displayName: String.raw`\mathbb{D}_4`,
                    members: [
                        { name: "", generators: [5, 8] },
                        { name: "", generators: [9, 12] },
                        { name: "", generators: [16, 7] },
                    ],
                },
            ],
        },
        A_4: {
            name: "A_4",
            displayName: String.raw`\mathbb{A}_4`,
            conjugacyClasses: [
                {
                    name: "A_4",
                    displayName: String.raw`\mathbb{A}_4`,
                    members: [{ name: "", generators: [1, 7] }],
                },
            ],
        },
        S_4: {
            name: "S_4",
            displayName: String.raw`S_4`,
            conjugacyClasses: [
                {
                    name: "S_4",
                    displayName: String.raw`S_4`,
                    members: [{ name: "S_4", generators: [1, 9] }],
                },
            ],
        },
    },
    A_4: {
        1: {
            name: "1",
            displayName: "",
            conjugacyClasses: [
                {
                    name: "1",
                    displayName: String.raw`\mathbb{1}`,
                    members: [{ name: "1", generators: [] }],
                },
            ],
        },
        Z_2: {
            name: "Z_2",
            displayName: String.raw`C_2`,
            conjugacyClasses: [
                {
                    name: "Z_2",
                    displayName: String.raw`C_2`,
                    members: [
                        { name: "E_1", generators: [9] },
                        { name: "E_2", generators: [10] },
                        { name: "E_3", generators: [11] },
                    ],
                }
            ],
        },
        Z_3: {
            name: "Z_3",
            displayName: String.raw`C_3`,
            conjugacyClasses: [
                {
                    name: "Z_3",
                    displayName: String.raw`C_3`,
                    members: [
                        { name: "F_1", generators: [1] },
                        { name: "F_2", generators: [2] },
                        { name: "F_3", generators: [3] },
                        { name: "F_4", generators: [4] },
                        
                    ],
                },
            ],
        },
        K_4: {
            name: "K_4",
            displayName: String.raw`C_2^2`,
            conjugacyClasses: [
                {
                    name: "K_4",
                    displayName: String.raw`C_2^2`,
                    members: [
                        { name: "E_{1,2}", generators: [9, 10] },
                        { name: "E_{2,3}", generators: [10, 11] },
                        { name: "E_{1,3}", generators: [9, 11] },
                    ],
                },
                {
                    name: "K_4",
                    displayName: String.raw`C_2^2`,
                    members: [
                        { name: "", generators: [9, 10] },
                    ],
                },
            ],
        },
        A_4: {
            name: "A_4",
            displayName: String.raw`\mathbb{A}_4`,
            conjugacyClasses: [
                {
                    name: "A_4",
                    displayName: String.raw`\mathbb{A}_4`,
                    members: [{ name: "", generators: [1, 9] }],
                },
            ],
        },
    },
    A_5: {
        1: {
            name: "1",
            displayName: "",
            conjugacyClasses: [
                {
                    name: "1",
                    displayName: String.raw`\mathbb{1}`,
                    members: [{ name: "1", generators: [] }],
                },
            ],
        },
        Z_5: {
            name: "Z_5",
            displayName: String.raw`C_5`,
            conjugacyClasses: [
                {
                    name: "Z_5",
                    displayName: String.raw`C_5`,
                    members: [
                        { name: "F_1", generators: [45] },
                        { name: "F_2", generators: [13] },
                        { name: "F_3", generators: [39] },
                        { name: "F_4", generators: [57] },
                        { name: "F_5", generators: [54] },
                        { name: "F_6", generators: [34] },
                    ],
                },
            ],
        },
        Z_2: {
            name: "Z_2",
            displayName: String.raw`C_2`,
            conjugacyClasses: [
                {
                    name: "Z_2",
                    displayName: String.raw`C_2`,
                    members: [
                        { name: "Edge Flip 1", generators: [14] },
                        { name: "Edge Flip 2", generators: [15] },
                        { name: "Edge Flip 3", generators: [16] },
                        { name: "Edge Flip 4", generators: [22] },
                        { name: "Edge Flip 5", generators: [23] },
                        { name: "Edge Flip 6", generators: [28] },
                        { name: "Edge Flip 7", generators: [30] },
                        { name: "Edge Flip 8", generators: [32] },
                        { name: "Edge Flip 9", generators: [35] },
                        /* 40, 41, 42, 43, 46, 47 */
                        { name: "Edge Flip 10", generators: [40] },
                        
                    ],
                },
            ],
        },
        Z_3: {
            name: "Z_3",
            displayName: String.raw`C_3`,
            conjugacyClasses: [
                {
                    name: "Z_3",
                    displayName: String.raw`C_3`,
                    members: [
                        /*  [11, 19, 24, 31, 17, 44, 20, 37, 33, 26, 1, 5, 2, 7, 3, 10, 4, 9, 8, 6] */
                        { name: "V_1", generators: [ 1 ] },
                        { name: "V_2", generators: [ 2 ] },
                        { name: "V_3", generators: [ 3 ] },
                        { name: "V_4", generators: [ 4 ] },
                        { name: "V_5", generators: [ 5 ] },
                        { name: "V_6", generators: [ 6 ] },
                        { name: "V_7", generators: [ 7 ] },
                        { name: "V_8", generators: [ 8 ] },
                        { name: "V_9", generators: [ 9 ] },
                        { name: "V_10", generators: [ 10 ] },
                       
                    ],
                },
            ],
        },
        D_10: {
            name: "D_10",
            displayName: String.raw`\mathbb{D}_{10}`,
            conjugacyClasses: [
                {
                    name: "D_10",
                    displayName: String.raw`\mathbb{D}_{10}`,
                    members: [
                        { name: "", generators: [45, 23] },
                        { name: "", generators: [9, 12] },
                        { name: "", generators: [16, 7] },
                    ],
                },
            ],
        },

        A_4: {
            name: "A_4",
            displayName: String.raw`\mathbb{A}_4`,
            conjugacyClasses: [
                {
                    name: "A_4",
                    displayName: String.raw`\mathbb{A}_4`,
                    members: [{ name: "", generators: [1, 7] }],
                },
            ],
        },

        K_4: {
            name: "K_4",
            displayName: String.raw`C_2^2`,
            conjugacyClasses: [
                {
                    name: "K_4",
                    displayName: String.raw`C_2^2`,
                    members: [
                        { name: "", generators: [14, 16] },
                        { name: "", generators: [15, 40] },
                        { name: "", generators: [22, 30] },
                        { name: "", generators: [23, 41] },
                        { name: "", generators: [28, 35] },
                    ],
                },
            ],
        },
        S_3: {
            name: "S_3",
            displayName: String.raw`S_3`,
            conjugacyClasses: [
                {
                    name: "S_3",
                    displayName: String.raw`S_3`,
                    members: [
                        { name: "1", generators: [37, 14 ] },
                        { name: "2", generators: [33, 14 ] },
                        { name: "", generators: [26, 15 ] },
                        { name: "", generators: [19, 16 ] },
                        { name: "", generators: [44, 16 ] },
                        { name: "", generators: [20, 22 ] },
                        { name: "", generators: [31, 23 ] },
                        { name: "", generators: [11, 28 ] },
                        { name: "", generators: [24, 32 ] },
                        { name: "", generators: [17, 32 ] },
                    ],
                },
            ],
        },

        A_5: {
            name: "A_5",
            displayName: String.raw`\mathbb{A}_5`,
            conjugacyClasses: [
                {
                    name: "A_5",
                    displayName: String.raw`\mathbb{A}_5`,
                    members: [
                        { name: "", generators: [16, 36] },
                        { name: "", generators: [16, 36] },
                        { name: "", generators: [16, 36] },
                        { name: "", generators: [16, 36] },
                    ],
                },
            ],
        },
    },
};

for (let outerGroupName of ["A_4", "S_4", "A_5"]) {
    const groupData: Record<
        SubgroupName<OuterGroupName>,
        IsomorphismClass
    > = subgroupsData[outerGroupName];
    const conjugacyClasses = Object.values(groupData)
        .map((isoClass) => isoClass.conjugacyClasses)
        .flat();
    conjugacyClasses.forEach((cjClass, i) => {
        cjClass.flatIndex = i;
    });
}
export default subgroupsData;
/*
        Z_2: [
            {name: "", generators: [17]},
            {name: "", generators: [19]},
            {name: "", generators: [20]},
            {name: "", generators: [12]},
            {name: "", generators: [8]},
            {name: "", generators: [7]},
        ],
        K_4: [
            {name: "", generators: [17, 8]},
            {name: "", generators: [19, 20]},
            {name: "", generators: [20, 17]},
            {name: "", generators: [12, 8]},
            {name: "", generators: [8, 7]},
            {name: "", generators: [7, 12]},
        ],
        S_4:[
            {name: "", generators: [5, 1]},
        ],
    }
} as Partial<Record<GeometryName, Partial<Record<GroupName, SubgroupData[]>>>>;
/*
    // 0{}
      { name: "1",members: [{ name: "1", generators: [] }]},
    // 1
      { name: "Z_2", generators: [1], members: [{ 
            name: "2", generators: [17]
        },{ 
            name: "2", generators: [19]
        },{ 
            name: "2", generators: [20]
        }]
     },
    // 2 
    { name: "Z_2", generators: [1], members: 
        [{
            name: "Fix Y-Faces", generators: [12]
        },{
            name: "Fix X-Faces", generators: [8]
        },{
            name: "Fix Z-Faces", generators: [7]
        }]
    },
    // 3
    { name: "K_4",generators: [1, 2],  members:
        [{
            name: "", generators: [17, 8]
        },
        {
            name: "", generators: [19, 20]
        },{
            name: "", generators: [20, 17]
        }]
    },
    // 4,
    { name: "K_4", generators: [1, 2], members:
        [{
            name: "Fix Y-Faces", generators: [12, 8]
        },{
            name: "Fix X-Faces", generators: [8, 7]
        },{
            name: "Fix Z-Faces", generators: [7, 12]
        }]
    },
    // 5,
    { name: "Z_4", generators: [], members:
        [{
            name: "Fix Y-Faces", generators: [5]
        },
        {
            name: "Fix X-Faces", generators: [9]
        },
        {
            name: "Fix Z-Faces", generators: [16]
        }]
    },
    // 6,
    { name: "Z_3",generators: [],  members:
        [
            { name: "Fix Axis 1", generators: [1] },
            { name: "Fix Axis 2", generators: [2] },
            { name: "Fix Axis 3", generators: [3] },
            { name: "Fix Axis 4", generators: [4] }
        ]
    },
    // 7,
    { name: "S_3",  members:
        [ 
            { name: "", generators: [1, 11] },
            { name: "", generators: [2, 3] },
            { name: "", generators: [3, 4] },
            { name: "", generators: [4, 1] }
        ]
    },
    // 8,
    { name: "D_4", generators: [1, 2], members:
        [{
            name: "Dihedral group for Y faces", generators: [5, 8]
        },
        {
            name: "Dihedral group for X faces", generators: [9, 12]
        },
        {
            name: "Dihedral group for Z faces", generators: [16, 7]
        }]
    },
    // 9,
    { name: "A_4", generators: [], members:
        [{ name: "Axis Rotations", generators: [1, 2, 3, 4] },]
    },
    // 10,
    { name: "S_4", generators: [1, 2], members:
        [{ name: "All Rotations", generators: [5, 1]}],
    
    },
],
Icosahedron: [
   { name: "1", generators: [], members: [{ name: "1", generators: [] }] },
],
Dodecahedron: [
    { name: "1",generators: [],  members: [{ name: "1", generators: [] }]},
],
Tetrahedron: [
    { name: "1",generators: [],  members: [{ name: "1", generators: [] }]},
],
Octahedron: [
    { name: "1",generators: [],  members: [{ name: "1", generators: [] }]},
]
} as Record<GroupName, ConjugacyClass[]>)*/
