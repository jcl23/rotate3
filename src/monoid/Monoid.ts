import { Quaternion, Vector3 } from "three";
import { Indexed, IndexedFGM } from "./IndexedMonoid";
import { getElementOrder } from "../logic/cayleyLogic";


export type Monoid<T> = {
    name: string;
    identity: T;
    multiply: (a: T, b: T) => T;
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
};

