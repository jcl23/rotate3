import { useSpring, easings, a, animated } from "@react-spring/three";
import { useFrame } from "@react-three/fiber";
import { forwardRef, useEffect, useMemo, useRef } from "react";
import {
  Quaternion,
  Vector3,
  MeshPhysicalMaterial,
  LineSegments,
  EdgesGeometry,
  LineDashedMaterial,
  Mesh,
  SphereGeometry,
} from "three";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { defaultShapes } from "./DefaultMeshes";
import { ShapeProps, Step } from "./Shape";
import { to } from "@react-spring/three";
import { PTR_COLOR } from "./cfg/colors";
type CayleyGraphPointerProps = {
  transform: Step<Vector3>;
};
export const Pointer = forwardRef(
  ({ transform }: CayleyGraphPointerProps, ref: any) => {
    const frameRef = useRef(null);

    // define the spring
    const { t } = useSpring({
      from: { t: 0 },
      to: { t: 1 },
      reset: true,
      config: {
        easing: easings.easeOutBounce,
        clamp: true,
      },
    });

    let geo: THREE.SphereGeometry;

    geo = useMemo(() => new SphereGeometry(0.05, 32, 32), []);

    const faceGeom = useMemo(() => geo, [geo]);
    const matLine = useMemo(
      () =>
        new LineMaterial({
          color: 0xee00ee,
          linewidth: 4,
          transparent: true,
          opacity: 0.5,
        }),
      []
    );
    const matFace = useMemo(
      () =>
        new MeshPhysicalMaterial({
          color: PTR_COLOR,
          opacity: 1,
          reflectivity: 1,
          transparent: true,
        }),
      []
    );
    // let mmobj = createMultiMaterialObject(geom, [matLine, matFace]);
    matLine.resolution.set(window.innerWidth, window.innerHeight);

    const faceMesh = useMemo(
      () => new Mesh(faceGeom, matFace),
      [faceGeom, matFace]
    );

    // useFrame to update the rotation value
    useFrame((state, delta) => {
      if (ref == null || ref.current === null) return;

      const intermediatePosition = new Vector3().lerpVectors(ref.current.position, transform.from, 0.5);

     (ref.current.position as Vector3).lerpVectors(
        intermediatePosition,
        transform.to,
        t.get()
      );
    });


    const toValue = (t: number) => {
      const x = transform.from.x + (transform.to.x - transform.from.x) * t;
      return x;
    };
    return (
      <a.mesh ref={ref}>
        <primitive object={faceMesh} />
      </a.mesh>
    );
  }
);
