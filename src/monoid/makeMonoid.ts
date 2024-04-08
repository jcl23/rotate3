import { Box3, BufferGeometry, Quaternion, TypedArray, Vector3 } from "three";
import { FiniteMonoid, FinitelyGeneratedMonoid, Indexed, IndexedFGM, IndexedFM, indexMonoid } from "../monoid/IndexedMonoid";
import { E3 } from "../Display";
import { Monoid } from "./Monoid";

export const getCenter = (geom: BufferGeometry) => (new Box3().setFromPoints(getPointsFromGeom(geom)).getCenter(new Vector3()));

export const getPointsFromGeom = function(geom: BufferGeometry): Vector3[] {
    const points: TypedArray = geom.attributes.position.array 

    let vec3List: Vector3[] = [];
    for (let coordIndex = 0; coordIndex < points.length; coordIndex += 3) {
        const x = points[coordIndex];
        const y = points[coordIndex + 1];
        const z = points[coordIndex + 2];
        vec3List.push(new Vector3(x, y, z));
    }

    const maxDist: number = vec3List.reduce((max, vec) => Math.max(max, vec.length()), 0);
    vec3List = vec3List.filter((vec) => vec.length() + 0.01 >= maxDist);
    const vectorEquality = (a: Vector3, b: Vector3) => a.distanceTo(b) < 0.01;
    // Remove duplicates
    vec3List = vec3List.filter((vec, index) => vec3List.findIndex((vec2) => vectorEquality(vec, vec2)) == index);
    // remove points on the same axis, considering inverse vectors to be equal
    vec3List = vec3List.filter((vec, index) => vec3List.findIndex((vec2) => vectorEquality(vec, vec2.negate())) == index);
    vec3List = vec3List.filter((vec, index) => vec3List.findIndex((vec2) => vectorEquality(vec, vec2.negate())) == index);
    vec3List = vec3List.filter((vec, index) => vec3List.findIndex((vec2) => vectorEquality(vec, vec2.negate())) == index);
    vec3List = vec3List.filter((vec, index) => vec3List.findIndex((vec2) => vectorEquality(vec, vec2.negate())) == index);

    return vec3List;
}

export const POS_ID = new Vector3();
export const ROT_ID = new Quaternion();
export const makeMonoidFromEdgeList = function(edges: [number, number][][]) {

    // Generate a monoid from a list of lists of edges
    const monoid: FinitelyGeneratedMonoid<number> = {
        generators: edges.map((edgeList, i) => i),
        name: "Monoid generated from edge list",
        identity: 0,
        multiply: function (a: number, b: number): number {
            throw new Error("Function not implemented.");
        }
    };

}

export const makeMonoidFromGeometry = function(geom: BufferGeometry, degree: number, name: string, extraRotations = []) : IndexedFGM<E3> {
    const center = new Vector3(0, 0, 0);
    const points =  getPointsFromGeom(geom);
    const rotations = points.map(point => new Quaternion().setFromAxisAngle(point.normalize(), Math.PI * 2 / degree).normalize());
    Array.prototype.push.apply(rotations, extraRotations);
    const monoid: FinitelyGeneratedMonoid<E3> = {
        generators: rotations.map((rotation) => ({ rotation, position: center })),
        identity: { rotation: ROT_ID, position: center },
        multiply: ({ rotation: r1, position: p1 }, { rotation: r2, position: p2 }) => ({ rotation: new Quaternion().multiplyQuaternions(r2, r1), position: new Vector3().addVectors(p1, p2) })
        ,name
    }
    const returnMonoid =  indexMonoid(monoid, 0.01);

    console.log(`Monoid for ${geom.type} of size: `, returnMonoid.elements.length);
    return returnMonoid;
}

export const makeEmbeddedSubmonoid = function<T>(m: IndexedFGM<T>, generators: Indexed<T>[], name = m.name) {
    // This time, we keep the indices the same and just have arrays with some undefined elements
    const values: Indexed<T>[] = [m.identity];
    let queue: Indexed<T>[] = [m.identity];
    let seenIndices = new Set();
    seenIndices.add(0);
    
    // filter the identity
    generators = generators.filter((gen) => gen.index !== 0);
    while (queue.length) {
        const newQueue: Indexed<T>[] = [];
        let element;
        while ((element = queue.shift()) !== undefined) {
            
            for (const generator of generators) {
                let newElement = m.multiply(element, generator);
                
                newElement = {...newElement, index: newElement.index, value: newElement.value};
                if (
                    newElement.index >= m.elements.length
                    || newElement.index < 0) {
                    throw new Error("Index out of bounds");
                }
                let presentInValues = seenIndices.has(newElement.index);
                
                
                if (!presentInValues) {
                    seenIndices.add(newElement.index);
                    
                    // new element in monoid
                    values.push({...newElement});
                    newQueue.push(newElement);
                }
            }
        }
        queue = newQueue;
    };
    let cayleyTable: Indexed<T>[][];
    if (m.cayleyTable) {
        // a new cayley table
        cayleyTable = [];
        for (let i = 0; i < values.length; i++) {
            const value1 = values[i];
            cayleyTable[value1.index] = [];
            for (let j = 0; j < values.length; j++) {
                const value2 = values[j];
                cayleyTable[value1.index][value2.index] = (m.cayleyTable[value1.index][value2.index]);
            }
        }
    }
    const monoid: IndexedFGM<T> = {
        generators: generators.slice(),
        identity: m.identity,
        multiply: m.multiply,
        compare: m.compare,
        name,
        elements: values,
        cayleyTable: cayleyTable ?? m.cayleyTable
    }
    console.log("Generated submonoid of size: ", monoid.elements.length, " from ", generators.length, " generators.")
     return monoid;
}
type HasName = { name: string };
export const  labelMonoid = function<T>(m: IndexedFGM<T>, generators: { el: Indexed<T>, name: string }[]): IndexedFGM<T> {
    // update the typescript types later to accomodate a name parameter
    const values: (Indexed<T> & HasName)[] = [{...m.identity, name: "" }];
    let queue: Indexed<T>[] = [values[0]];

    let seenIndices = new Set();
    seenIndices.add(0);
    
    // filter the identity
    generators = generators.filter((gen) => gen.el.index !== 0);
    while (queue.length) {
        const newQueue: Indexed<T>[] = [];
        let element;
        while ((element = queue.shift()) !== undefined) {
            
            for (const generator of generators) {
                const { el: generatorEl, name: generatorName } = generator;
                const product = m.multiply(element, generatorEl);
                
                let presentInValues = seenIndices.has(product.index);
                
                
                if (!presentInValues) {
                    // m.elements.find(canonical => canonical.index == newElement.index).name = element.name + generatorName;
                    seenIndices.add(product.index);
                    
                    // new element in monoid
                    let newElement = {...product, name: element.name + generatorName}
                    values.push(newElement);
                    newQueue.push(newElement);
                }
            }
        }
        queue = newQueue;
    }
    values[0].name = "e";

    for (const element of values) {
        let name = element.name;
        let count = 1;
        let newName = "";
        for (let i = 1; i < name.length; i++) {
            if (name[i] === name[i - 1]) {
                count++;
            } else {
                if (count > 1) {
                    newName += `${name[i - 1]}^${count}`;
                } else {
                    newName += name[i - 1];
                }
                count = 1;
            }
        }
        if (count > 1) {
            newName += `${name[name.length - 1]}^${count}`;
        } else {
            newName += name[name.length - 1];
        }
        element.name = newName;
    }
    return {
        ...m,
        multiply: function(a: Indexed<T>, b: Indexed<T>) {
            const underlying =  m.cayleyTable[a.index][b.index];
            return { ...underlying  };
            
        },
        generators: generators.map(({ el }, i) => values[i + 1]),
        elements: values,
        compare: (x, y) => x.index - y.index,
    }
}

export const makeSubmonoid = function<T>(m: FinitelyGeneratedMonoid<T>, generators: T[]): FiniteMonoid<T> {
    const values: T[] = [m.identity];
    let queue: T[] = [m.identity];
    let index = 1;
    let seen = new Set();
    const resultGenerators = [];
    seen.add(m.identity);
    let max = 10000;
    
    while (queue.length) {
        const newQueue: T[] = [];
        let element;
        while ((element = queue.shift()) !== undefined) {
            
            for (const generator of generators) {
                const newElement = m.multiply(element, generator);
                
                let presentInValues = seen.has(newElement);
                
                
                if (!presentInValues) {
                    seen.add(newElement);
                    // new element in monoid
                    values.push(newElement);
                    index++;
                    newQueue.push(newElement);
                    if (index > max) {
                        throw new Error("Max size exceeded");
                    }
                }
            }
        }
        queue = newQueue;
    }
    
    const monoid: FiniteMonoid<T> = {
        generators: generators.slice(),
        identity: m.identity,
        multiply: m.multiply,
        compare: m.compare,
        name: m.name,
        elements: values
    }
    console.log("Generated submonoid of size: ", monoid.elements.length, " from ", generators.length, " generators.")
     return monoid;
}