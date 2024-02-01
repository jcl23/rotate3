import { Quaternion } from "three";

const quaternionCompare = (a: Quaternion, b: Quaternion): number => Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z, a.w - b.w);

export { quaternionCompare }