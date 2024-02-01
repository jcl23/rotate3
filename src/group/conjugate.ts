import { SubgroupData } from "../data/subgroupData";
import { FinitelyGeneratedMonoid, Indexed, IndexedFGM } from "../monoid/IndexedMonoid";

// Given a monoid where we know an element has an inverse
const createConjugator = function<T>(monoid: IndexedFGM<T>, element: Indexed<T>) {
    // find an inverse
    let inverse;
    monoid.elements.forEach((value) => {
        if (monoid.multiply(value, element) == monoid.identity) {
            inverse = value;
        }
    });

    if (inverse == undefined) {
        throw new Error("Element does not have an inverse");
    }
    return function (x) {
        return monoid.multiply(monoid.multiply(x, element), inverse);
    }
}

