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
  Color,
  EdgesGeometry,
  ExtrudeGeometry,
  Face,
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
  Raycaster,
  RepeatWrapping,
  UVMapping,
  Vector2,
  Vector3,
} from "three";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import defaultSpringConfig from "./cfg/springs";

// SecondaryShapes: The internal subobjects that are acted upon by subgroups. 1d or 2d shapes when not A_4 or A_5.

import { defaultShapes, SecondaryShapeName, secondaryShapes } from "./DefaultMeshes";
import { E3 } from "./Display";
import { defaultColors, secondaryColors } from "./cfg/colors";
import { getAdditionalUserInfo } from "firebase/auth";
import { Indexed } from "./monoid/IndexedMonoid";
import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";


export type Step<T> = { from: T; to: T };
export type ShapeProps = {
  shape: keyof typeof defaultShapes;
  generators: Indexed<E3>[];
  secondary: SecondaryShapeName;
  transform: Step<E3>;
};







export const Shape = forwardRef(({ shape, generators, transform, secondary }: ShapeProps, ref: any) => {

  const numGenerators = generators.length;
  
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
  let secondGeo: THREE.BufferGeometry;
  const color = defaultColors[shape] ?? "0x000000";
  const color2 = secondaryColors[shape] ?? "0x000000";
  geo = useMemo<BufferGeometry>(defaultShapes[shape], [shape]);
  secondGeo = useMemo<BufferGeometry>(secondaryShapes[secondary], [secondary]);


  const scaleMiddle = 0.95;
  const scaleInner = 0.9
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
        transparent: true,
        opacity: 0.9,
      }),
    []
  );

 const matLine2 = new LineMaterial({
    color: 0xffffff,
  });
  
  const matFace = useMemo(
    () =>
      new MeshPhysicalMaterial({
        color,
        opacity: 0.4,
        transparent: true,
        reflectivity: 0.2,

      }),
    [color]
  );
  
  const middleMatFace = useMemo(
    () =>
    new MeshPhysicalMaterial({
      color: color2,
      opacity: 0.4,
      emissive: color2,
      emissiveIntensity: 0.2,
      transparent: true,
      reflectivity: 0.2,

    }),
    [color]
  );
  const highlight = useMemo(
    () =>
      new MeshPhysicalMaterial({
        color: 0xffffff,
        opacity: 0.5,
        transparent: true,
        reflectivity: 0.2,
      }),
    []
  );
  
  const innerMatFace = useMemo(
    () =>
      new MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.4,
        roughness: 0.2,
        transparent: true,        
        opacity: 5,
        }),
    [shape]
  );
  const secondaryMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: 0xffffff,
        opacity: 1,
        emissive: 0xffffff,
        }),
    [secondary]
  );

  matLine.resolution.set(window.innerWidth, window.innerHeight);
  matLine2.resolution.set(window.innerWidth, window.innerHeight);
  const edges = new EdgesGeometry(outerFaceGeom);
  const linesGeom1 =  new LineSegmentsGeometry().fromEdgesGeometry(edges);
  const linesGeom2 =  new LineSegmentsGeometry().fromEdgesGeometry(edges);
  const linesMesh = useMemo(
    () =>
      new LineSegments2(
        linesGeom1,
        matLine
      ),
    [outerFaceGeom, matLine]
  );
  const linesMesh2 = new LineSegments2(
    linesGeom2,
    matLine2
  );
       
  const outerFaceMesh = useMemo(
    () => {
      const extrudeSettings = {
        steps: 2,
        depth: 16,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 1,
        bevelOffset: 0,
        bevelSegments: 1
      };
      //  const extruded = new ExtrudeGeometry([outerFaceGeom], extrudeSettings)
      if (generators.length == 0) return new Mesh(outerFaceGeom, matFace)
      
      const q = generators[0].value.rotation.clone();
     //  q.invert();
      // nice print quaternion
      //console.log("q", q.toArray().map(c => c.toFixed(2)).toString());
      //const axis = new Vector3(q.x, q.y, q.z).normalize();
      //let secondary = "Pentagon";
      
      // secondGeo.lookAt(axis);
      // secondGeo = secondGeo.clone();//.applyQuaternion(generators[0].value.rotation);
      const mesh =  new Mesh(outerFaceGeom, matFace);
     
     /* const r = new Raycaster();
     r.set(start, axis);
      
         const intersects = [];
         const normalSet = new Set();
         for (let i = 0; i < 27; i++) {
            // convert to one of the vertices around the orgin, with coords in {-1, 0, 1}
            const dx = i % 3 - 1;
            const dy = Math.floor(i / 3) % 3 - 1;
            const dz = Math.floor(i / 9) % 3 - 1;
            console.log([dx, dy, dz])
            const shift = new Vector3(dx, dy, dz).multiplyScalar(0.03);
            r.set(start.clone().add(shift), axis.clone().add(shift).normalize());
            const newIntersects = r.intersectObject(mesh);
            if (newIntersects.length > 0) {
              for (let intersect of newIntersects) {
                const { a, b, c } = intersect.face as Face;
                vertexInstanceCount[a] = (vertexInstanceCount[a] ?? 0) + 1;
                vertexInstanceCount[b] = (vertexInstanceCount[b] ?? 0) + 1;
                vertexInstanceCount[c] = (vertexInstanceCount[c] ?? 0) + 1;
                const normCoords = new Float32Array(intersect.normal?.toArray());
                const quickHash = normCoords[0].toPrecision(3) + 256 * normCoords[1].toPrecision(3) + 65536 * normCoords[2].toPrecision(3);
                normalSet.add(quickHash);
                console.log('quickHash', quickHash);
                intersects.push(intersect);
              }
            }
         }
         const normalsSeen = Array.from(normalSet);
         const numNormals = normalsSeen.length;
         const type = numNormals == 1 ? "Face" : numNormals == 2 ? "Edge" : "Vertex";
         const nearestPointsCount = numNormals;
         console.log({nearestPointsCount})
         // calculate the nearest numNormals points.

        // colorAttribute.setXYZ(face.b, color.r, color.g, color.b);
        // colorAttribute.setXYZ(face.c, color.r, color.g, color.b);
        // for ( let i = 0; i < intersects.length; i ++ ) {
          //   // intersects[ i ].object.material.color.set( 0xffffff );
        
        
        // const intersectionGeom = new BufferGeometry().setFromPoints(points);
        // return new Mesh(intersectionGeom, highlight);
        */
       return mesh;
    },
    [generators[0], outerFaceGeom, matFace]
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
  const secondaryShapeMesh = new Mesh(secondGeo, secondaryMaterial);
  // const secondaryShapeMesh = useMemo(
  //   () => new Mesh(secondGeo, secondaryMaterial),
  //   [secondGeo, secondaryMaterial]
  // );

  innerFaceMesh.renderOrder = 1;
  middleFaceMesh.renderOrder = 2;
  outerFaceMesh.renderOrder = 5;
  secondaryShapeMesh.renderOrder = 4;
  linesMesh.renderOrder = 2;
  linesMesh2.renderOrder = 9;
  innerFaceMesh.castShadow = true;
  secondaryShapeMesh.receiveShadow
  secondaryShapeMesh.material.depthTest = false;
  secondaryShapeMesh.material.depthWrite = false;
  secondaryShapeMesh.material.transparent = true;
  linesMesh.material.depthTest = false;
  linesMesh.material.depthWrite = false;
  linesMesh.material.transparent = true;
  secondaryShapeMesh.onBeforeRender = function (renderer) { renderer.clearDepth(); };
  
  
  // <primitive object={secondaryShapeMesh} />
  return (
    <a.mesh ref={ref}>

      <primitive object={outerFaceMesh} /> 
      <primitive object={middleFaceMesh} /> 
      <primitive object={innerFaceMesh} />
      <primitive object={linesMesh2} />

      <primitive object={linesMesh}  />
    </a.mesh>
  );
});

