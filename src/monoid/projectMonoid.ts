import { E3 } from "../Display";
import { enumerateTransforms } from "../logic/cayleyTables";
import { Indexed, IndexedFGM } from "./IndexedMonoid";

export default function<T>(G: IndexedFGM<T>, newGenerators: Indexed<T>[], H: IndexedFGM<any>) {
    
    if (G == undefined) {
        throw new Error("G is undefined");
    }
    // ensure they have the same number of generators
    if (newGenerators.length !== H?.generators?.length) {
        throw new Error("Groups must have the same number of generators");
    }
    const subG: IndexedFGM<T> = { ...G, generators: newGenerators };
    let compare;
    

    const includedValues = enumerateTransforms<Indexed<T>>(subG);
    const map: Record<number, number> = {};
    if (includedValues.length !== H.elements.length) {
        throw new Error("Groups must have the same number of elements");
    }
    includedValues.forEach((value, i) => {
        map[includedValues[i].index] = H.elements[i].index;
    });

    return function(g: Indexed<T>): Indexed<T> {
        const { index, value } = g;
        if (!(index in map)) {   
            throw new Error("Index out of range");
        }
        return { index: map[index], value };
    }
    

}