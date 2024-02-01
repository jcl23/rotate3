import { FiniteMonoid, Indexed, IndexedFM } from "./IndexedMonoid";
import { Monoid } from "./Monoid";

const  isHomomorphism = function<A, B>(m: FiniteMonoid<A>, n: FiniteMonoid<B>, f: (a: A) => B): boolean {
    const l = m.elements.length;
    const num_generators = m.generators.length;
    for (let i = 0; i < l; i++) {
        for (let g = 0; g < num_generators; g++) {
            const m1 = m.elements[i];
            const gen1 = m.generators[g];
            const fm1 = f(m1);
            const fgen1 = f(gen1);
            const fm1gen1 = f(m.multiply(m1, gen1));
            const fm1fgen1 = n.multiply(fm1, fgen1);
            if (n.compare(fm1gen1, fm1fgen1) ) {
                return false;
            }
        }
    }
    return true;
}

const makeHomomorphism = function<A, B>(m: IndexedFM<A>, n: Monoid<B>, generatorMap: Map<number, B>): Map<number, B> {
    // beginning at the identity, do a depth-first search using the generators of m.
    // construct a map from elements of m to elements of n.
    const history = new Map<number, number[]>();
    history.set(m.identity.index, []);
    let queue: Indexed<A>[] = [m.identity];
    const seen: Indexed<A>[] = [];
    seen.push(m.identity);
    const hasSeen = (a: Indexed<A>) => seen.findIndex((b) => m.compare(a, b) == 0) >= 0;
    const map = new Map<number,B>();
    map.set(m.identity.index, n.identity);
    while (queue.length) {
        const newQueue: Indexed<A>[] = [];
        let element: Indexed<A> | undefined;
        while (element = queue.shift()) {
            const elementImage = map.get(element.index);
            if (elementImage === undefined) {
                throw new Error("Map is not defined for element");
            }
            for (const generator of m.generators) {
                const composite = m.multiply(element, generator);
                if (composite === undefined) {
                    throw new Error("newElement undefined");
                }
                //const compositeImage = map.get(composite.index);
                const generatorImage = generatorMap.get(generator.index);
                if (generatorImage === undefined) {
                    throw new Error("Ended up with an undefined after mapping a generator");
                }
                if (!hasSeen(composite)) {
                    history.set(composite.index, [...history.get(element.index)!, generator.index]);
                    seen.push(composite);
                    newQueue.push(composite);
                    
                    const imagesComposite = n.multiply(elementImage, generatorImage);
                    if (imagesComposite === undefined) {
                        throw new Error("Ended up with an undefined after trying to multiply in the codomain");
                    }
                    if (n.compare(imagesComposite, n.identity) == 0) {
                        debugger;
                    

                    }
                    map.set(composite.index, imagesComposite);
                }
            }
        }
        queue = newQueue;
    }
    console.log(history);
    
    return map;
}
export { isHomomorphism, makeHomomorphism }