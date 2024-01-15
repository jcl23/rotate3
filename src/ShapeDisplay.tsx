import { Canvas } from "@react-three/fiber";
import { useRef, useState, useEffect, useMemo, useLayoutEffect } from "react";
import { Quaternion, Vector3,  PerspectiveCamera, Camera, OrthographicCamera, Color, CanvasTexture, UVMapping, RepeatWrapping, PCFSoftShadowMap } from "three";
import { MyCamera } from "./Camera";
import { defaultShapes } from "./DefaultMeshes";
import { Transform } from "./Display";
import { Indexed } from "./monoid/IndexedMonoid";
import { Step } from "./Shape";
import { Shape } from "./Shape";
import { CameraControls, Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
export type ShapeDisplayProps = {
    children?: JSX.Element | JSX.Element[];
    shape: keyof typeof defaultShapes;
    transform: Indexed<E3>;
    stepIndex: number;
    cameraType:
      | "front-facing"
      | "perspective"
      | "perspectiveOffset"
      | "orthographic";
  };
export const ShapeDisplay = function ({
    shape,
    transform: { value: { rotation, position } },
    stepIndex,
    cameraType,
    children,
  }: ShapeDisplayProps) {
    const shapeRef = useRef();
  
    const [localStepIndex, setLocalStepIndex] = useState(0);
  
    const [transformStep, setTransformStep] = useState<Step<E3>>({
      from: { rotation: new Quaternion(), position: new Vector3() } as Transform,
      to: { rotation: new Quaternion(), position: new Vector3() } as Transform,
    });
  

    const [cameraState, setCameraState] = useState<Camera>(new PerspectiveCamera(75, 1, 0.1, 1000));
    useEffect(() => {
        let camera: Camera;
        switch (cameraType) {
            case "perspective":
            camera = new PerspectiveCamera(75, 1, 0.1, 1000);
            camera.position.set(1, 2, 3);
            break;
            case "front-facing":
            default:
            camera = new PerspectiveCamera(75, 1, 0.1, 1000);
            camera.position.set(0, 0, 3);
            break;
            case "orthographic":
            camera = new OrthographicCamera(75, 1, 0.1, 1000);
            camera.position.set(0, 0, 3);
            break;
        }

        setCameraState(camera);
    }, [cameraType]);

    const camera = useMemo(() => cameraState, [cameraState]);
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
  
    const stableShape = useMemo(() => {
      console.log("ShapeDisplay", shape);  
      return <Shape ref={shapeRef} shape={shape}  transform={transformStep}  />
    }, [transformStep, shape, cameraType]);
  
    useEffect(() => {
      console.log("ShapeDisplay", shape);
    }, [shape])
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
          <div>
          <Canvas
             style={{
              width: "100%",
              aspectRatio: "1/1",

            }}
            background={new Color("#000")}
            camera={camera}
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
             
             
            <fog attach="fog" args={["#eee", 0, 15]} />
              <MyCamera type={cameraType} />
              <CameraControls />
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
           <Lightformer
              form="rect"
              intensity={1}
              color="red" // (optional = white)
               // Scale it any way you prefer (optional = [1, 1])
               scale={[0.5, 2, 0]}
               position={[0,1,0]}
              target={[0, 0, 0]} // Target position (optional = undefined)
            />
              {/* below: a spotlight pointing straight down */}
                
              {stableShape}
              {children}
             
       
            </Canvas>
          </div>
        </div>
    );
  };
  