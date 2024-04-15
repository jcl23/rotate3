import { CayleyGraphEdges } from "./CayleyGraph";
import { IndexedFGM } from "../../monoid/IndexedMonoid";
import { Monoid } from "./Monoid";

export const makeEdges = function(monoid: IndexedFGM): CayleyGraphEdges {
    const edges: CayleyGraphEdges = [];
    for (const generator of monoid.generators) {
        edges[generator.index] = [];
        for (const value of monoid.values) {
            try {
                const product = monoid.multiply(value, generator);
                edges[
                    generator.index
                ][
                    value.index
                ] = [
                    value.index, 
                    (() => product.index)(),
                ];
            } catch (e) {
                // console.log("error", {edges}, {generator}, {value}, edges[generator.index].length.toString());
                throw e;
            }
        }
    }
    return edges;
}