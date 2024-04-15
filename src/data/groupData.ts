import { GroupName } from "../DefaultMeshes";
import { FinitelyGeneratedMonoid, Indexed, IndexedFGM, IndexedFinExpMonoid, indexMonoid } from "../monoid/IndexedMonoid";
import { ConjugacyClass } from "./subgroupData";

const composePermutations = function(p1: number[], p2: number[]) {
    return p1.map((index) => p2[index]);
}

export type FinExpMonoid<T> = FinitelyGeneratedMonoid<T> & {
    orderOf: (element: T) => number;
} 
const makePermutationGroup = function(generators: number[][], size: number, name: string): IndexedFinExpMonoid<number[]> {
    const labeledGenerators: Indexed<number[]>[] = generators.map((generator, index) => ({ value: generator, index: index + 1 }));
    const identity = Array.from(Array(size).keys());
    generators.forEach((generator, index) => {
        // ensure each is the right length
        if (generator.length != size) {
            throw new Error(`Generator ${index} is not the right length`);
        }
    });

    const orderOf = function(element: number[]): number {
        let order = 0;
        const isIdentity = (element: number[]) => element.every((value, index) => value == index);
        const generator = element;
        element = Array.from(Array(size).keys());
        do {
            element = composePermutations(element, generator);
            order++;
            if (order > 1000) {
                throw new Error("Order too high")
                break;
            }
        } while (!isIdentity(element));
        return order;
    }

    const composePermutationsSafe = function(p1: number[], p2: number[]) {
        const returnVal = composePermutations(p1, p2);
        if (returnVal.length != size) {
            throw new Error("Permutation is not the right length");
        }
    }
    const monoid: FinExpMonoid<number[]> = {
        name,
        generators,
        identity,
        multiply: composePermutations,
        orderOf
    }

    return indexMonoid(monoid, 0.01);
}
let groupData = {
    "1": makePermutationGroup([], 1, "1"),
    "Z_2": makePermutationGroup([[1, 0]], 2, "Z_2"),
    "Z_3": makePermutationGroup([[2, 0, 1]], 3, "Z_3"),
    "Z_4": makePermutationGroup([[3, 0, 1, 2]], 4, "Z_4"),
    "D_8": makePermutationGroup([[3, 0, 1, 2], [1, 0, 3, 2]], 4, "D_8"),
    "K_4": makePermutationGroup([[1, 0, 2, 3], [0, 1, 3, 2]], 4, "K_4"),
    "S_3": makePermutationGroup([[1, 0, 2], [0, 2, 1]], 3, "S_3"),
    "S_4": makePermutationGroup([[3, 0, 1, 2], [0, 3, 1, 2]], 4, "S_4"),
    
} as Partial<Record<GroupName, IndexedFinExpMonoid<number[]>>>;

let S3Els = groupData["D_8"].elements;
if (S3Els) {
    // // console.log("S_3 elements: ", S3Els.length);
}

export default groupData;