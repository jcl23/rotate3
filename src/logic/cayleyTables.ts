import { Vector2 } from "three";

import { FinitelyGeneratedMonoid, Indexed } from "../monoid/IndexedMonoid";


const isEqualApprox = function(a: any, b: any): boolean {
    // if they are arrays, check each element
    if (Array.isArray(a)) {
        return a.every((el, i) => isEqualApprox(el, b[i]));
    }
    if (typeof a == "number") {
        return a == b;
    }
    if ("index" in a) {
        return a.index == b.index;
    }
    try {
        return a.rotation.angleTo(b.rotation) < 0.01 && a.position.distanceTo(b.position) < 0.01;
    } catch (e) {
        debugger;
        var x = 1;
    };       
        
}

///
/// Returns a list of all elements in the monoid
///
export const  enumerateTransforms = function<T>(monoid: FinitelyGeneratedMonoid<T>): T[] {
    // Hope its finite
        
    const valueSet = new Array<T>();    
    valueSet.push(monoid.identity);
    let queue: T[] = [monoid.identity];

    let safetyIndex = 0;
    const numGenerators = monoid.generators.length;
    let compare;
   /* if ("rotation" in monoid.identity && "position" in monoid.identity) {
        compare = (a: E3, b: E3) => {
            return a.rotation.angleTo(b.rotation) < 0.05 && a.position.distanceTo(b.position) < 0.05;
        }
    } else if ("index" in monoid.identity) {
        compare = (a: Indexed<any>, b: Indexed<any>) => {
            return a.index == b.index;
        }
    }
*/
    while (queue.length) {
        const newQueue: T[] = [];
        let element;
        while (element = queue.shift()) {
            
            for (let i = 0; i < numGenerators; i++) {
                const generator = monoid.generators[i];
                const newElement = monoid.multiply(element, generator);
                let index = valueSet.findIndex((_el) => isEqualApprox(_el, newElement));
                if (index < 0) {
                    // new element in monoid
                    valueSet.push(newElement);
                    newQueue.push(newElement);
                }
            }
            safetyIndex++;
            if (safetyIndex > 100) {
                throw new Error("Too many elements in monoid");
            }
        }
        queue = newQueue;
    }
    console.log("Monoid of size: ", valueSet.length);

    // cayleyTable = cayleyTable.slice(0, valueList.length).map((row) => row.slice(0, valueList.length));
    return [...valueSet];
}
export function makeCayleyTable(monoid: FinitelyGeneratedMonoid<any>): Indexed<any>[][] {
    const valueSet = enumerateTransforms(monoid);
    const numElements = valueSet.length;
    const cayleyTable = Array<Indexed<any>[]>(numElements).fill([]).map(() => Array<Indexed<any> | null>(numElements).fill(null));
    for (let i = 0; i < numElements; i++) {
        for (let j = 0; j < numElements; j++) {
            const result = monoid.multiply(valueSet[i], valueSet[j]);
            const resultIndex = valueSet.findIndex((_el) => isEqualApprox(_el, result, 0.05, 0.05));
            cayleyTable[i][j] = { index: resultIndex, value: result }
        }
    }
    if (cayleyTable.some((row) => row.some((el) => el == null))) {
        throw new Error("Cayley table not complete");
    }
    // typescript assert that the table hsa non-null values

    return cayleyTable as Indexed<any>[][];
}

const findEdges = function(cayleyTable: number[][], start: number, step: number) {
    const edgeList: [number, number][] = [];
    let current = start;
    while (true) {
        const next = cayleyTable[current][step];
        if (next === start) {
            break;
        }
        edgeList.push([current, next]);
        current = next;
    }
    return edgeList;
}
export const manualReindexArrays = {
    "box": [
        0, 6, 3, 12,       
        9, 19, 1, 18,       
        15, 7, 20, 2,       
        21, 13, 8, 4,       
        22, 10, 14, 16,       
        5, 23, 11, 17,       
    ]
}
export const DefaultVertices = {
    Cube: [0, 1, 2, 3].map(turn => [
        new Vector2(0, 0),              
        
                                        
                                new Vector2(60, 20),
    
    
                                    new Vector2(70, 50),
    
                                        
                new Vector2(20, 60),
                            new Vector2(50, 70),
                                            new Vector2(80, 80)
        ].map((v) => v.clone().rotateAround(new Vector2(100, 100), turn * Math.PI / 2)))/*.map(
            (v, j) => ({
                index: turn * 6 + j,
                position: v,
            })
        ))  */  
        .flat()
}
    

