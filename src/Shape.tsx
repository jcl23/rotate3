import { useSpring, easings, a } from "@react-spring/three";
import { useFrame, Canvas, CameraProps } from "@react-three/fiber";
import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BoxGeometry,
  BufferGeometry,
  CanvasTexture,
  EdgesGeometry,
  LineDashedMaterial,
  LineSegments,
  Matrix4,
  Mesh,
  MeshLambertMaterial,
  MeshNormalMaterial,
  MeshPhysicalMaterial,

  MeshStandardMaterial,

  NormalMapTypes,

  Quaternion,
  RepeatWrapping,
  UVMapping,
  Vector2,
  Vector3,
} from "three";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import defaultSpringConfig from "./cfg/springs";



import { defaultShapes } from "./DefaultMeshes";
import { E3 } from "./Display";
import { defaultColors, secondaryColors } from "./cfg/colors";

export type Step<T> = { from: T; to: T };
export type ShapeProps = {
  shape: keyof typeof defaultShapes;
  transform: Step<E3>;
};







export const Shape = forwardRef(({ shape, transform }: ShapeProps, ref: any) => {
  // define the spring
  const spring = useSpring({
    from: { t: 0 },
    to: { t: 1 },
    reset: true,
    config: defaultSpringConfig,
  });
  // useFrame to update the rotation value
  useFrame(() => {
    const intermediateRotation = new Quaternion().slerpQuaternions(
      ref.current.quaternion,
      transform.from.rotation,
      0.3
    );
    (ref.current.quaternion as Quaternion).slerpQuaternions(
      intermediateRotation,
      transform.to.rotation,
      spring.t.get()
    );

    const intermediatePosition = new Vector3().lerpVectors(
      ref.current.position,
      transform.from.position,
      0.5
    );
    ref.current.position.lerpVectors(
      intermediatePosition,
      transform.to.position,
      spring.t.get()
    );
  });
  /*useEffect(() => {
      console.log("fromRotation", transform.from.rotation.toArray().toString());
      console.log("toRotation", transform.to.rotation.toArray().toString());
      console.log("fromPosition", transform.from.position.toString());
      console.log("toPosition", transform.to.position.toString());
    }, [transform])*/
  // return the jsx
  let geo: THREE.BufferGeometry;
  
  const color = defaultColors[shape] ?? "0x000000";
  const color2 = secondaryColors[shape] ?? "0x000000";
  geo = useMemo<BufferGeometry>(defaultShapes[shape], [shape]);
  const scaleMiddle = 0.90;
  const scaleInner = 0.80
  const outerFaceGeom = useMemo(() => geo, [geo]);
  const middleFaceGeom = useMemo(() => geo.clone().applyMatrix4(new Matrix4().makeScale(scaleMiddle,scaleMiddle,scaleMiddle)), [geo])
  middleFaceGeom.computeVertexNormals();
  const innerFaceGeom = useMemo(() => geo.clone().applyMatrix4(new Matrix4().makeScale(scaleInner,scaleInner,scaleInner)), [geo])
  innerFaceGeom.computeVertexNormals();
  const matLine = useMemo(
    () =>
      new LineMaterial({
        color: 0xffffff,
        linewidth: 4,
        transparent: false,
        opacity: 1,
      }),
    []
  );

  
  const matFace = useMemo(
    () =>
      new MeshPhysicalMaterial({
        color,
        opacity: 0.5,
        transparent: true,
        reflectivity: 0.2,

      }),
    [color]
  );
  
  const middleMatFace = useMemo(
    () =>
    new MeshPhysicalMaterial({
      color: color2,
      opacity: 0.7,
      transparent: true,
      reflectivity: 0.2,

    }),
    [color]
  );
  
  const innerMatFace = useMemo(
    () =>
      new MeshStandardMaterial({
        color: 0xcccccc,
        metalness: 0.4,
        roughness: 0.2,
        transparent: false,        

        }),
    [shape]
  );

  matLine.resolution.set(window.innerWidth, window.innerHeight);

  const linesMesh = useMemo(
    () =>
      new LineSegments(
        new EdgesGeometry(outerFaceGeom),
        matLine
      ),
    [outerFaceGeom, matLine]
  );

  const outerFaceMesh = useMemo(
    () => new Mesh(outerFaceGeom, matFace),
    [outerFaceGeom, matFace]
  );
  
  const middleFaceMesh = useMemo(
    () => new Mesh(middleFaceGeom, middleMatFace),
    [middleFaceGeom, middleMatFace]
  );
  
//  const middleFaceMesh = useMemo(
//    () => Mesh(middleFaceGeom, color),
//    [middleFaceGeom]
//  );
  const innerFaceMesh = useMemo(
    () => new Mesh(innerFaceGeom, innerMatFace),
    [innerFaceGeom, innerMatFace]
  );
  innerFaceMesh.renderOrder = 0;
  middleFaceMesh.renderOrder = 1;
  outerFaceMesh.renderOrder = 2;
  linesMesh.renderOrder = 3;
  
  innerFaceMesh.castShadow = true;

  innerFaceMesh.receiveShadow = true;
  middleFaceMesh.receiveShadow = false;

  
  return (
    <a.mesh ref={ref}>

      <primitive object={outerFaceMesh} /> 
      <primitive object={middleFaceMesh} /> 
      <primitive object={innerFaceMesh} />
      <primitive object={linesMesh} />
    </a.mesh>
  );
});

