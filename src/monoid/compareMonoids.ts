import { IndexedFM } from "./IndexedMonoid";

const compareMonoids = function(m: IndexedFM<any>, n: IndexedFM<any>): boolean {
    if (m.elements.length != n.elements.length) {
        return false;
    }
    
    const l = m.elements.length;
    const num_generators = m.generators.length;
    for (let i = 0; i < l; i++) {
        for (let g = 0; g < num_generators; g++) {
            const m1 = m.elements[i];
            const gen1 = m.generators[g];
            const n1 = n.elements[i];
            const gen2 = n.generators[g];
            const m12 = m.multiply(m1, gen1);
            const n12 = n.multiply(n1, gen2);
            if (m12.index != n12.index) {
                return false;
            }
        }
    }
    return true;
}

export default compareMonoids;