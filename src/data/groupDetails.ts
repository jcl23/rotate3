// mathematical information stored in a record, where the keys are GroupNames,

import { GroupName } from "../DefaultMeshes";
type GroupDetails = {
    name: string;
    abstract: string;
    order: number;
    rank: number;
}
export const groupDetails: Record<GroupName, GroupDetails> = {
    1: {
        name: "1",
        abstract: "The trivial group.",
        order: 1,
        rank: 0
    },
    Z_2: {
        name: "C_2",
        abstract: "Cyclic group of order 2",
        order: 2,
        rank: 1
    },
    Z_3: {
        name: "Z_3",
        abstract: "Cyclic group of order 3",
        order: 3,
        rank: 1
    },
    K_4: {
        name: "C^2_2",
        abstract: "The Klein four-group.",
        order: 4,
        rank: 2
    },
    Z_4: {
        name: "C_4",
        abstract: "The cyclic group of order 4.",
        order: 4,
        rank: 1
    },
    Z_5: {
        name: "C_5",
        abstract: "The cyclic group of order 5.",
        order: 5,
        rank: 1
    },
    Z_6: {
        name: "C_6",
        abstract: "The cyclic group of order 6.",
        order: 6,
        rank: 1
    },
    D_8: {
        name: "D_8",
        abstract: "The dihedral group of order 8.",
        order: 8,
        rank: 2
    },
    S_3: {
        name: "S_4",
        abstract: "The symmetric group on 3 elements.",
        order: 6,
        rank: 2
    },
    A_4: {
        name: "A_4",
        abstract: "The even permutations of 4 elements.",
        order: 12,
        rank: 2
    },
    S_4: {
        name: "S_4",
        abstract: "The symmetric group on 4 elements.",
        order: 24,
        rank: 2
    },
    A_5: {
        name: "A_5",
        abstract: "The even permutations of 5 elements.",
        order: 60,
        rank: 2
    },
    D_10: {
        name: "D_{10}",
        abstract: "The dihedral group of order 10.",
        order: 10,
        rank: 2
    }
};