import { Vector3 } from "three";

export const cameraPositions = {
    ['front-facing']: new Vector3(0, 0, 2),
    ['perspective']: new Vector3(1, 2, 1.4),
    ['perspectiveOffset']: new Vector3(2.0, 1.3, 1.3),
    ['orthographic']: new Vector3(0, 0, 2),
}

export const cameraPositionKeys = Object.keys(cameraPositions) as (keyof typeof cameraPositions)[];