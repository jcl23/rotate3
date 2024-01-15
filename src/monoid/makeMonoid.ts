import { Box3, BufferGeometry, Quaternion, TypedArray, Vector3 } from "three";
import { FinitelyGeneratedMonoid, Indexed, IndexedFGM, indexMonoid } from "../monoid/IndexedMonoid";
import { E3 } from "../Display";

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

export const makeMonoidFromGeometry = function(geom: BufferGeometry, degree: number, name: string, extraRotations = []) : IndexedFGM<E3> {
    const center = new Vector3(0, 0, 0);
    const points =  getPointsFromGeom(geom);
    const rotations = points.map(point => new Quaternion().setFromAxisAngle(point.normalize(), Math.PI * 2 / degree));
    Array.prototype.push.apply(rotations, extraRotations);
    const monoid: FinitelyGeneratedMonoid<E3> = {
        generators: rotations.map((rotation) => ({ rotation, position: center })),
        identity: { rotation: ROT_ID, position: center },
        multiply: ({ rotation: r1, position: p1 }, { rotation: r2, position: p2 }) => ({ rotation: new Quaternion().multiplyQuaternions(r2, r1), position: new Vector3().addVectors(p1, p2) })
        ,name
    }
    const returnMonoid =  indexMonoid(monoid, 0.01);

    console.log(`Monoid for ${geom.type} of size: `, returnMonoid.values.length);
    return returnMonoid;
}

export const makeSubmonoid = function<T>(m: IndexedFGM<T>, generators: Indexed<T>[]): IndexedFGM<T> {
    
const values: Indexed<T>[] = [];
    let queue: Indexed<T>[] = [m.identity];
    while (queue.length) {
        const newQueue: Indexed<T>[] = [];
        let element;
        while (element = queue.shift()) {
            values.push(element);
            for (const generator of generators) {
                const newElement = m.multiply(element, generator);
                let index = values.findIndex((_el) => _el.index == newElement.index);
                if (index < 0) {
                    // new element in monoid
                    newQueue.push(newElement);
                }
            }
        }
        queue = newQueue;
    }
    
    const monoid: IndexedFGM<T> = {
        generators: generators.slice(),
        identity: m.identity,
        multiply: m.multiply,
        name: m.name,
        values
    }
    console.log("Generated submonoid of size: ", monoid.values.length, " from ", generators.length, " generators.")
     return monoid;
}