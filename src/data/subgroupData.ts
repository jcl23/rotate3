import { GeometryName, GroupName } from "../DefaultMeshes";

export type SubgroupData = {
    name: string;
    generators: number[];
    parents?: number[];
}

export type ConjugacyClass = {
    name: string;
    displayName: string;
    members: SubgroupData[];
    // generators: number[];
}

export type IsomorphismClass = {
    name: string;
    displayName: string;
    conjugacyClasses: ConjugacyClass[];
}
export type SubgroupsData = Partial<Record<GeometryName, Partial<Record<GroupName, SubgroupData[]>>>>;
export type OuterGroupName = "S_4" | "A_4" | "A_5";
// 1. Begin with the "big" groups - the ones for the whole shapes.
// 2. Using lagranges theorem, calculate the possible orders of subgroups
// 3. For each order, calculate the possible subgroups
/*
    a. We can do this for small groups with brute force, starting with the power set of our finite set (< 6).
    b. For each element in the power set, the permutations on that define a group.
*/
// typescript conditionals to make lists based off each shape name
export type SubgroupListData<T extends OuterGroupName> = (
    T extends "S_4" ? "1" | "Z_2" | "Z_3" | "Z_4" | "D_4" | "K_4" | "S_3" | "A_4" | "S_4"
    : T extends "A_4" ? "1" | "Z_2" | "Z_3" | "K_4" | "A_4"
    : T extends "A_5" ? "1" | "Z_2" | "K_4" | "Z_3" | "S_3" | "A_4" | "Z_5" | "D_10" | "A_5"
    : "1"
);
export type GeometryGroupData<T extends GeometryName> = (
    T extends "Cube" | "Octahedron" ? "S_4"
    : T extends "Icosahedron" | "Dodecahedron" ? "A_5"
    : T extends "Tetrahedron" ? "A_4"
    : "1"
);


export type SubgroupRecord = {
    [K in OuterGroupName]: Record<SubgroupListData<K>, IsomorphismClass>
}




 

const subgroupsData: SubgroupRecord = {
    S_4: {
        1: {
            name: "1",
            displayName: String.raw`\mathbb{1}`,
            conjugacyClasses: [
                { name: "1", displayName: String.raw`\mathbb{1}`, members: [{ name: "1", generators: [] }] }
            ]
        },
        Z_2: {
            name: "Z_2",
            displayName: String.raw`\mathbb{Z}_2`,
            conjugacyClasses: [
                {
                    name: "Z_2", displayName: String.raw`\mathbb{Z}_2`, members: [
                        { name: "", generators: [17] },
                        { name: "", generators: [19] },
                        { name: "", generators: [20] },
                    ]
                },
                {
                    name: "\Z_2", displayName: String.raw`\mathbb{Z}_2`, members: [
                        { name: "", generators: [12] },
                        { name: "", generators: [18] },
                        { name: "", generators: [7] },
                    ]
                },
            ]
        },
        K_4: {
            name: "K_4", displayName: String.raw`\mathbb{Z}_2^2`, conjugacyClasses: [
                {
                    name: "K_4", displayName: String.raw`\mathbb{Z}_2^2`, members: [
                        { name: "", generators: [17, 19] },
                        { name: "", generators: [19, 20] },
                        { name: "", generators: [20, 17] },
                    ]
                },
                {
                    name: "K_4", displayName: String.raw`\mathbb{Z}_2^2`, members: [
                        { name: "", generators: [12, 8] },
                        { name: "", generators: [8, 7] },
                        { name: "", generators: [7, 12] },
                    ]
                },
            ]
        },
        Z_4: {
            name: "Z_4", displayName: String.raw`\mathbb{Z}_4`, conjugacyClasses: [
                {
                    name: "Z_4", displayName: String.raw`\mathbb{Z}_4`, members: [
                        { name: "", generators: [5] },
                        { name: "", generators: [9] },
                        { name: "", generators: [16] },
                    ]
                },
            ]
        },
        Z_3: {
            name: "Z_3", displayName: String.raw`\mathbb{Z}_3`, conjugacyClasses: [
                {
                    name: "Z_3", displayName: String.raw`\mathbb{Z}_3`, members: [
                        { name: "", generators: [1] },
                        { name: "", generators: [2] },
                        { name: "", generators: [3] },
                        { name: "", generators: [4] },
                    ]
                },
            ]
        },
        S_3: {
            name: "S_3", displayName: String.raw`\mathbb{S}_3`, conjugacyClasses: [
                {
                    name: "S_3", displayName: String.raw`\mathbb{S}_3`, members: [
                        { name: "", generators: [1, 11] },
                        { name: "", generators: [2, 14] },
                        { name: "", generators: [3, 17] },
                        { name: "", generators: [4, 20] },
                    ]
                },
            ]
        },
        D_4: {
            name: "D_4", displayName: String.raw`\mathbb{D}_4`, conjugacyClasses: [
                {
                    name: "D_4", displayName: String.raw`\mathbb{D}_4`, members: [
                        { name: "", generators: [5, 8] },
                        { name: "", generators: [9, 12] },
                        { name: "", generators: [16, 7] },
                    ]
                },
            ]
        },
        A_4: {
            name: "A_4", displayName: String.raw`\mathbb{A}_4`, conjugacyClasses: [
                {
                    name: "A_4", displayName: String.raw`\mathbb{A}_4`, members: [
                        { name: "", generators: [1, 7] },
                    ]
                },
            ]
        },
        S_4: {
            name: "S_4", displayName: String.raw`\mathbb{S}_4`, conjugacyClasses: [
                {
                    name: "S_4", displayName: String.raw`\mathbb{S}_4`, members: [
                        { name: "", generators: [1, 9] },
                    ]
                },
            ]
        },
    },
    A_4: {
        1: {
            name: "1", displayName: "", conjugacyClasses: [
                { name: "1", displayName: String.raw`\mathbb{1}`, members: [{ name: "1", generators: [] }] }
            ]
        },
        Z_2: {
            name: "Z_2",
            displayName: String.raw`\mathbb{Z}_2`,
            conjugacyClasses: [
                {
                    name: "Z_2", displayName: String.raw`\mathbb{Z}_2`, members: [
                        { name: "", generators: [17] },
                        { name: "", generators: [19] },
                        { name: "", generators: [20] },
                    ]
                },
                {
                    name: "\Z_2", displayName: String.raw`\mathbb{Z}_2`, members: [
                        { name: "", generators: [12] },
                        { name: "", generators: [18] },
                        { name: "", generators: [7] },
                    ]
                },
            ]
        },
        Z_3: {
            name: "Z_3", displayName: String.raw`\mathbb{Z}_3`, conjugacyClasses: [
                {
                    name: "Z_3", displayName: String.raw`\mathbb{Z}_3`, members: [
                        { name: "", generators: [1] },
                        { name: "", generators: [2] },
                        { name: "", generators: [3] },
                        { name: "", generators: [4] },
                    ]
                },
            ]
        },
        K_4: {
            name: "K_4", displayName: String.raw`\mathbb{Z}_2^2`, conjugacyClasses: [
                {
                    name: "K_4", displayName: String.raw`\mathbb{Z}_2^2`, members: [
                        { name: "", generators: [17, 19] },
                        { name: "", generators: [19, 20] },
                        { name: "", generators: [20, 17] },
                    ]
                },
                {
                    name: "K_4", displayName: String.raw`\mathbb{Z}_2^2`, members: [
                        { name: "", generators: [12, 8] },
                        { name: "", generators: [8, 7] },
                        { name: "", generators: [7, 12] },
                    ]
                },
            ]
        },
        A_4: {
            name: "A_4", displayName: String.raw`\mathbb{A}_4`, conjugacyClasses: [
                {
                    name: "A_4", displayName: String.raw`\mathbb{A}_4`, members: [
                        { name: "", generators: [1, 7] },
                    ]
                },
            ]
        },
    },
    A_5: {
        1: {
            name: "", displayName: "", conjugacyClasses: [
                { name: "1", displayName: String.raw`\mathbb{1}`, members: [{ name: "1", generators: [] }] }
            ]
        },
        Z_2: {
            name: "Z_2",
            displayName: String.raw`\mathbb{Z}_2`,
            conjugacyClasses: [
                {
                    name: "Z_2", displayName: String.raw`\mathbb{Z}_2`, members: [
                        { name: "", generators: [17] },
                        { name: "", generators: [19] },
                        { name: "", generators: [20] },
                    ]
                },
                {
                    name: "\Z_2", displayName: String.raw`\mathbb{Z}_2`, members: [
                        { name: "", generators: [12] },
                        { name: "", generators: [18] },
                        { name: "", generators: [7] },
                    ]
                },
            ]
        },
        Z_3: {
            name: "Z_3", displayName: String.raw`\mathbb{Z}_3`, conjugacyClasses: [
                {
                    name: "Z_3", displayName: String.raw`\mathbb{Z}_3`, members: [
                        { name: "", generators: [1] },
                        { name: "", generators: [2] },
                        { name: "", generators: [3] },
                        { name: "", generators: [4] },
                    ]
                },
            ]
        },
        K_4: {
            name: "K_4", displayName: String.raw`\mathbb{Z}_2^2`, conjugacyClasses: [
                {
                    name: "K_4", displayName: String.raw`\mathbb{Z}_2^2`, members: [
                        { name: "", generators: [17, 19] },
                        { name: "", generators: [19, 20] },
                        { name: "", generators: [20, 17] },
                    ]
                },
                {
                    name: "K_4", displayName: String.raw`\mathbb{Z}_2^2`, members: [
                        { name: "", generators: [12, 8] },
                        { name: "", generators: [8, 7] },
                        { name: "", generators: [7, 12] },
                    ]
                },
            ]
        },
        Z_5: {
            name: "Z_5", displayName: String.raw`\mathbb{Z}_5`, conjugacyClasses: [
                {
                    name: "Z_5", displayName: String.raw`\mathbb{Z}_5`, members: [
                        { name: "", generators: [1] },
                        { name: "", generators: [2] },
                        { name: "", generators: [3] },
                        { name: "", generators: [4] },
                    ]
                },
            ]
        },
        S_3: {
            name: "S_3", displayName: String.raw`\mathbb{S}_3`, conjugacyClasses: [
                {
                    name: "S_3", displayName: String.raw`\mathbb{S}_3`, members: [
                        { name: "", generators: [1, 11] },
                        { name: "", generators: [2, 14] },
                        { name: "", generators: [3, 17] },
                        { name: "", generators: [4, 20] },
                    ]
                },
            ]
        },
        A_4: {
            name: "A_4", displayName: String.raw`\mathbb{A}_4`, conjugacyClasses: [
                {
                    name: "A_4", displayName: String.raw`\mathbb{A}_4`, members: [
                        { name: "", generators: [1, 7] },
                    ]
                },
            ]
        },
        D_10: {
            name: "D_4", displayName: String.raw`\mathbb{D}_4`, conjugacyClasses: [
                {
                    name: "D_4", displayName: String.raw`\mathbb{D}_4`, members: [
                        { name: "", generators: [5, 8] },
                        { name: "", generators: [9, 12] },
                        { name: "", generators: [16, 7] },
                    ]
                },
            ]
        },
        A_5: {
            name: "", displayName: "", conjugacyClasses: [
                
            ]
        },
    }
};
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