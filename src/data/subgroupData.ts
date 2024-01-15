import { GeometryName } from "../DefaultMeshes";

export type Subgroup = {
    name: string;
    generators: number[];
}

export type ConjugacyClass = {
    name: string;
    members: Subgroup[];
    generators: number[];
}

export default ({
Cube: [
    // 0{}
      { name: "1", generators: [], members: [{ name: "1", generators: [] }]},
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
    { name: "Z_2^2",generators: [1, 2],  members:
        [{
            name: "", generators: [17, 19]
        },
        {
            name: "", generators: [19, 20]
        },{
            name: "", generators: [20, 17]
        }]
    },
    // 4,
    { name: "Z_2^2", generators: [1, 2], members:
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
    { name: "S_3", generators: [], members:
        [ { name: "Fix Axis 1", generators: [1, 2] },
        { name: "Fix Axis 2", generators: [2, 3] },
        { name: "Fix Axis 3", generators: [3, 4] },
        { name: "Fix Axis 4", generators: [4, 1] }]
    },
    // 8,
    { name: "D_4", generators: [], members:
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
    { name: "S_4", generators: [], members:
        [{ name: "All Rotations", generators: [1, 2, 5]}],
    
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
} as Record<GeometryName, ConjugacyClass[]>)