import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Quaternion } from "three/src/math/Quaternion.js";
import { step } from "three/examples/jsm/nodes/Nodes.js";
import { cameraPositionKeys } from "./cfg/camera-positions";
import { Vector3 } from "three";
import { defaultShapes } from "./DefaultMeshes";
import { GraphDisplay } from "./GraphDisplay";
import { examples } from "./exampleData/Example";
export type E3 = {
    rotation: Quaternion;
    position: Vector3;
}
