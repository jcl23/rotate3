import { CameraProps, Canvas, } from "@react-three/fiber";
import { useRef, useState, useEffect, useMemo, useLayoutEffect } from "react";
import { Quaternion, Vector3,  PerspectiveCamera, Camera, OrthographicCamera, Color, CanvasTexture, UVMapping, RepeatWrapping, PCFSoftShadowMap, BufferGeometry, Line, LineBasicMaterial, ExtrudeGeometry, Vector2, MeshBasicMaterial, Mesh, CylinderGeometry, MeshPhongMaterial } from "three";
import { MyCamera } from "./Camera";
import { defaultShapes } from "./DefaultMeshes";
import { E3  } from "./Display";
import { Indexed } from "./monoid/IndexedMonoid";
import { Step } from "./Shape";
import { Shape } from "./Shape";
import { CameraControls, Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import { set } from "firebase/database";
import { Partial } from "@react-spring/three";

const AXIS_RADIUS = 0.05;
export type ShapeDisplayProps = {
    children?: JSX.Element | JSX.Element[];
    shape: keyof typeof defaultShapes;
    transform: Indexed<E3>;
    stepIndex: number;
    availableTransformations: Indexed<E3>[];
    generators: Indexed<E3>[];
    cameraType:
      | "front-facing"
      | "perspective"
      | "perspectiveOffset"
      | "orthographic";
    cameraProps: Partial<CameraProps>;
  };
// map from a quaternion to a three fiber line, with width, representing the axis of rotation
export const quaternionToAxis = function(numSegments: number) {
  return function(q: Quaternion) {
    //const axis = new Vector3(q.x, q.y, q.z);
    const x = new Vector3(1, 0, 0);
    const y = new Vector3(0, 1, 0);
    const z = new Vector3(0, 0, 1);

   
    const axis = new Vector3(q.x, q.y, q.z).normalize();
    const geometry = new CylinderGeometry(AXIS_RADIUS, AXIS_RADIUS, 5, numSegments);
    // center the geometry
    geometry.rotateX(Math.PI / 2);
   // geometry.translate(0, AXIS_RADIUS, 0);
    const material = new MeshPhongMaterial( { color: 0xffffff, reflectivity: 2 } );
    const cylinder = new Mesh(geometry, material);
    cylinder.lookAt(axis);
    return cylinder;
  }
}

export const ShapeDisplay = function ({
    shape,
    transform: { value: { rotation, position } },
    stepIndex,
    cameraType,
    
    children,

    generators,
  }: ShapeDisplayProps) {
    const shapeRef = useRef();
    
    
    const [localStepIndex, setLocalStepIndex] = useState(0);
  
    const [transformStep, setTransformStep] = useState<Step<E3>>({
      from: { rotation: new Quaternion(), position: new Vector3() } as Transform,
      to: { rotation: new Quaternion(), position: new Vector3() } as Transform,
    });
  

    //const [cameraState, setCameraState] = useState<Camera>(new PerspectiveCamera(75, 1, 0.1, 1000));
    let camera: Camera;
        switch (cameraType) {
            case "perspective":
            camera = new PerspectiveCamera(75, 1, 0.1, 1000);
            camera.position.set(1, 2, 3);
            break;
            case "front-facing":
              camera = new PerspectiveCamera(75, 1, 0.1, 1000);
              camera.position.set(0, 0, 3);
              break;
            case "orthographic":
            default:
            camera = new OrthographicCamera(75, 1, 0.1, 1000);
            camera.position.set(0, 0, 3);
            break;
        }
    

 
    useEffect(() => {
      if (
        rotation.equals(transformStep.to.rotation) &&
        position.equals(transformStep.to.position)
      )
        return;
      setTransformStep({
        from: transformStep.to,
        to: { rotation, position },
      });
    }, [rotation, position]);
    
    let dummy;
    const stableShape = useMemo(() => {
      console.log("ShapeDisplay ()", shape);  
      return (
        <>
            <Shape ref={shapeRef} shape={shape}  transform={transformStep}  />
        </>
      )
    }, [shape, dummy, transformStep]);

    [transformStep, shape, cameraType].forEach((val) => {
      useEffect(() => {
        console.log("ShapeDisplay", shape);
      }, [val])
    });
    useEffect(() => {
      console.log("ShapeDisplay (shape)", shape);
      dummy = shape;
    }, [shape])
    useEffect(() => {
      console.log("ShapeDisplay (transformStep)", transformStep.from.rotation, transformStep.to.rotation);
      dummy = transformStep;
    }, [transformStep])
    useEffect(() => {
      console.log("ShapeDisplay (CameraType)", cameraType);
      dummy = cameraType;
    }, [cameraType])
    /*const setRotation = function (rotation: Quaternion) {
      setFromRotation(toRotation);
      setToRotation(rotation);
    };*/
  
    const [fromPosition, setFromPosition] = useState(new Vector3());
    const [toPosition, setToPosition] = useState(new Vector3());
  
    const setPosition = function (position: Vector3) {
      setFromPosition(toPosition);
      setToPosition(position);
    };
  
    const firstUpdate = useRef(true);
  
    useLayoutEffect(() => {
      if (firstUpdate.current) {
        firstUpdate.current = false;
        return;
      }
      if (localStepIndex === stepIndex) return;
      setLocalStepIndex(stepIndex);
      // setTransform({ rotation, position });
    }, [stepIndex, cameraType]);
  
    
  
    useEffect(() => {
        console.log("camera set: ", cameraType);
    }, [cameraType]);


    return (
        <div className="ShapeDisplay">
          <div style={{
              width: "100%",
              height: "100%",

            }}>
          <Canvas
             style={{
              width: "100%",
              height: "100%",

            }}
            background={"#FF0000"}
            
            gl={{ 
              antialias:true, 
              powerPreference: "high-performance",
              shadowMap: {
                enabled: true,
                type: PCFSoftShadowMap,
              },
              
            }}  
            
            shadows
          >
            <PerformanceMonitor onDecline={() => set(true)} />
             
             
            <fog attach="fog" args={["#999", 0, 15]} />
              <MyCamera type={cameraType} />
              <CameraControls  />

              <spotLight position={[2, 2, 1]}  intensity={2} castShadow={true} />
              <spotLight position={[-2, -2, -4]}  intensity={4} castShadow={true} />
              <pointLight position={[0, 4, 2]} intensity={20} />
              <ambientLight intensity={0.1}/>
              {/*
              <pointLight  position={[-4, -1, -2]} intensity={100} />


           
           <mesh receiveShadow={true} position={[0, -1, 0]} rotation={[Math.PI * 3/ 2,0,0]} >
             <planeGeometry args={[50, 50, 1, 1]} />
             <meshStandardMaterial
              metalness={0.2}
              roughness={0.4}
              color="#ffffff"
              />
           </mesh>
          */}
     
              {/* below: a spotlight pointing straight down */}
                
              {stableShape}
              {generators.map(({value: {rotation}}) => rotation).map(quaternionToAxis(6), { lineWidth: 4 }).map((data, i) => <primitive key={`ShapeDisplay_prim[${i}]`} object={data} />)}
              {children}
             
       
            </Canvas>
          </div>
        </div>
    );
  };
  