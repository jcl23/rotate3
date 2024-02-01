
import { Monoid } from "./Monoid";
import { makeCayleyTable } from "../logic/cayleyTables";


export type Indexed<T> = {index: number, value: T};
type IndexedMonoid<T> = Monoid<Indexed<T>> & {
    cayleyTable?: Indexed<T>[][];
    elements: Indexed<T>[];
};   

export interface FinitelyGeneratedMonoid<T> extends Monoid<T> {
    generators: T[];
    // values: Transform[];
}

export interface FiniteMonoid<T> extends FinitelyGeneratedMonoid<T> {
    elements: T[];
}
export type IndexedFGM<T> = FinitelyGeneratedMonoid<Indexed<T>> & IndexedMonoid<T>



export type IndexedFM<T> = FiniteMonoid<Indexed<T>> & IndexedFGM<T>;
export type IndexedFinExpMonoid<T> = IndexedFGM<T> & {
    orderOf: (element: Indexed<T>) => number;
}




export const indexMonoid = function<T>(monoid: FinitelyGeneratedMonoid<T>, delta = 0.01, maxSize = 1000): IndexedFM<T> {
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
        if (value === undefined) {
            throw new Error("Index out of bounds"); 
        }
        return { index, value };
    }

    values.sort((a, b) => a.index - b.index);   
    
    const generators = values.slice(1, 1 + monoid.generators.length);
    
    return {
        ...monoid,
        identity,
        multiply,
        generators,
        elements: values,
        name: monoid.name,
        cayleyTable,
        compare: (x, y) => x.index - y.index,
    }
    
};