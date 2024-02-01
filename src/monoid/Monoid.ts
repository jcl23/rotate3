import { Quaternion, Vector3 } from "three";
import { Indexed, IndexedFGM } from "./IndexedMonoid";
import { getElementOrder } from "../logic/cayleyLogic";
import { quaternionCompare } from "../logic/equality";


export type Monoid<T> = {
    name: string;
    identity: T;
    multiply: (a: T, b: T) => T;
    compare: (a: T, b: T) => boolean | number;
};
 
export const getElementsOfOrder = function<T>(monoid: IndexedFGM<T>, order: number): Indexed<T>[] {
    const elements: Indexed<T>[] = [];
    
    for (let i = 1; i < monoid.elements.length; i++) {
        const current = monoid.elements[i];
        if (getElementOrder(monoid, current) == order) {
            elements.push(current);
        }
    }
    return elements;
}

export type QuaternionMonoid = Monoid<Quaternion>;

export const quaternionMonoid: QuaternionMonoid = {
    name: "Quaternion",
    identity: new Quaternion(),
    multiply: (a, b) => new Quaternion().multiplyQuaternions(b, a),
    compare: quaternionCompare, // lower =  same
};

