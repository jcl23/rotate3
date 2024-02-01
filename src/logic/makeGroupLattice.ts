import { IndexedFGM } from "../monoid/IndexedMonoid";


export const makeGroupLattice = function (group: IndexedFGM<number[]>) {
    const s = group.elements.length;

    // by lagranges
    const possibleOrders = Array.from(Array(s).keys()).filter((n) => s % n === 0);
    const orderRecord: Record<number, number[]> = {};
    possibleOrders.forEach((order) => {
        orderRecord[order] = [];
    });
    type order = keyof typeof orderRecord;
    // for each order, calculate the possible subgroups
}