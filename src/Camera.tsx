import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useEffect, useLayoutEffect } from "react";
import { Vector3 } from "three/src/math/Vector3.js";
import { cameraPositions } from "./cfg/camera-positions";


type MyCameraProps = {
    type: keyof typeof cameraPositions;
}
export const MyCamera = function ({ type, ...props }: MyCameraProps) {
  const cameraRef = useRef();
  const set = useThree(({ set }) => set);
  const size = useThree(({ size }) => size);

  useLayoutEffect(() => {
    if (cameraRef.current) {
      // cameraRef.current = 
      cameraRef.current.aspect = size.width / size.height;
      cameraRef.current.updateProjectionMatrix();
      cameraRef.current.lookAt(new Vector3(0,0,0));
    }
  }, [size, type]);

  useLayoutEffect(() => {
    set({ camera: cameraRef.current });
  }, [type]);

  return <perspectiveCamera  position={cameraPositions[type] ?? cameraPositions["front-facing"]} ref={cameraRef} {...props} />;
};
