import { Quaternion, Vector3 } from "three";


export type Monoid<T> = {
    name: string;
    identity: T;
    multiply: (a: T, b: T) => T;
    generators?: T[];
};

export type QuaternionMonoid = Monoid<Quaternion>;

export const quaternionMonoid: QuaternionMonoid = {
    name: "Quaternion",
    identity: new Quaternion(),
    multiply: (a, b) => new Quaternion().multiplyQuaternions(b, a),
};

