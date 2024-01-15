import { Transform } from "../Display";
import { Monoid } from "./Monoid";
import { makeCayleyTable } from "../logic/cayleyTables";
import { Quaternion } from "three";

export type Indexed<T> = {index: number, value: T};
export type IndexedMonoid<T> = Monoid<Indexed<T>>;   



export interface FinitelyGeneratedMonoid<T> extends Monoid<T> {
    generators: T[];
    // values: Transform[];
}
export interface IndexedFGM<T> extends IndexedMonoid<T> {
    generators: Indexed<T>[];
    values: Indexed<T>[];
    cayleyTable?: Indexed<T>[][];
    // extraRotations?: Quaternion[];
}





export const indexMonoid = <T>(monoid: FinitelyGeneratedMonoid<T>, delta = 0.01): IndexedFGM<T> => {
    let identity = { index: 0, value: monoid.identity };
    
    
    const cayleyTable = makeCayleyTable(monoid);

    let values = cayleyTable[0];

    let multiply = (a: Indexed<T>, b: Indexed<T>): Indexed<T> => {
        const { index, value } = cayleyTable[a.index][b.index];
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
        values,
        name: monoid.name,
        cayleyTable
    }
    
};