// Given a monoid, attempt to invert it, but break after a given number of steps

import { FinitelyGeneratedMonoid, Indexed, IndexedFGM } from "../monoid/IndexedMonoid";

export function findInverse<T>(monoid: IndexedFGM<T>, element: Indexed<T>, max = 10000): Indexed<T> {
    let inverse = monoid.identity;
    let count = 0;
    while (monoid.multiply(element, inverse).index != 0) {
        inverse = monoid.multiply(element, inverse);
        count++;
        if (count > max) {
            throw new Error("Element does not have an inverse");
        }
    }
    return inverse;
}