import { Transform } from "../Display";
import { Monoid } from "./Monoid";
import { makeCayleyTable } from "../logic/cayleyTables";
import { Quaternion } from "three";
import { FinExpMonoid } from "../data/groupData";

export type Indexed<T> = {index: number, value: T};
export type IndexedMonoid<T> = Monoid<Indexed<T>>;   



export interface FinitelyGeneratedMonoid<T> extends Monoid<T> {
    generators: T[];
    // values: Transform[];
}
export interface IndexedFGM<T> extends IndexedMonoid<T> {
    generators: Indexed<T>[];
    elements: Indexed<T>[];
    cayleyTable?: Indexed<T>[][];
    // extraRotations?: Quaternion[];
}

export type IndexedFinExpMonoid<T> = IndexedFGM<T> & {
    orderOf: (element: Indexed<T>) => number;
}




export const indexMonoid = function<T>(monoid: FinExpMonoid<T>, delta = 0.01): IndexedFinExpMonoid<T> {
    let identity = { index: 0, value: monoid.identity };
    
    
    const cayleyTable = makeCayleyTable(monoid);

    let values = cayleyTable[0];

    let multiply = function(a: Indexed<T>, b: Indexed<T>): Indexed<T> {
        // if values are undefined or out of range, throw an error.
        if (
            a?.value == undefined || 
            b?.value == undefined || 
            a.index >= values.length ||
            b.index >= values.length ||
            a.index < 0 ||
            b.index < 0
        ) {
            throw new Error("Index out of bounds");
        }

        const { index, value } = cayleyTable[a.index][b.index];

        if ( index >= values.length || index < 0) {
            throw new Error("Index out of bounds");
        }
        if (value == undefined) {
            throw new Error("Index out of bounds"); 
        }
        return { index, value };
    }

    values.sort((a, b) => a.index - b.index);   
    
    const generators = values.slice(1, 1 + monoid.generators.length);
    
    return {
        identity,
        multiply,
        generators,
        elements: values,
        name: monoid.name,
        cayleyTable,
        orderOf: (element: Indexed<T>) => monoid.orderOf(element.value),
    }
    
};