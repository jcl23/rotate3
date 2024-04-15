import { useState, useEffect } from "react";
import { Euler, Matrix3, Matrix4, Quaternion, Vector3 } from "three";
import { defaultShapes } from "./DefaultMeshes";
import { Transform } from "./Display";
import { GraphDisplay } from "./GraphDisplay";
import { cameraPositionKeys } from "./cfg/camera-positions";
import { examples } from "./exampleData/Example";
import { TransformGenerator } from "./TransformGenerator";
type ControlBlockProps<InT> = {
    title: string;
    shape: keyof typeof defaultShapes;
    generators: TransformGenerator[];
    children?: JSX.Element | JSX.Element[];
    operation: (state: InT, el: InT) => InT;
};


export const ControlBlock = function ({ children, title, shape, generators }: ControlBlockProps) {
    
    const [stepIndex, setStepIndex] = useState(0);
    const [transform, setTransform] = useState({ rotation: new Quaternion(), position: new Vector3() } as Transform);
    const [cayleyTransform, setCayleyTransform] = useState({ rotation: new Quaternion(), position: new Vector3() } as Transform);
    useEffect(() => { console.log("transform: [ position: ", transform.position.toArray().toString(), ", rotation: ", transform.rotation.toArray().toString(), "]" )}, [transform])
    
    const [cameraType, setCameraType] = useState<"front-facing"|"perspective">("front-facing");
    const [x, setX] = useState(0);  

    const setRotation = (rotation: Quaternion) => {
        setTransform({ ...transform, rotation });
    }



    const eulerAngle = new Euler().setFromQuaternion(transform.rotation);

    const [rotationMatrix, setRotationMatrix] = useState(new Matrix4().makeRotationFromEuler(eulerAngle));

    const [eigenVector, setEigenVector] = useState(new Vector3(1, 0, 0));
    const makeColumnMatrix4 = (v: Vector3) => {
        return new Matrix4().makeRotationFromEuler(new Euler().setFromQuaternion(new Quaternion().setFromUnitVectors(new Vector3(1, 0, 0), v)));
    }
    const computeEigenvector = (m: Matrix4) => {
        const eigenValue = m.determinant();
        const eigenVector = new Vector3();
        const eigenVectorMatrix = makeColumnMatrix4(eigenVector);
        return new Matrix4(...m.toArray()).invert().compose(eigenVector, new Quaternion(), new Vector3(1, 1, 1)).decompose(new Vector3(), new Quaternion(), eigenVector);
    }

    const {  vertices, edges } = examples[shape];
    const applyTransform = (_transform: Transform) => {
        setTransform({
            position: new Vector3().addVectors(transform.position, _transform.position),
            rotation: new Quaternion().multiplyQuaternions(_transform.rotation, transform.rotation)
        });
    }

    const setPosition = (_position: Vector3) => {
        setTransform({
            position: _position,
            rotation: transform.rotation,
        });
    }
    return (
        <div className="ControlBlock">
            {/* Rotation buttons */}
            <div>
                {generators.map((generator, i) => {
                    return (
                    <span key={`ShapeDisplay_span#${i}`}>
                        <button
                        onClick={() => {
                            //setRotation(new Quaternion().multiplyQuaternions(generator.rotation, transform.rotation));
                            applyTransform(generator.transform);
                            setStepIndex(stepIndex + 1);
                        }}
                        >
                        {generator.name}
                        </button>
                    </span>
                    );
                })}
            </div>
            {/* Camera manipulation buttons */}
            
            {/* Movement test buttons  */}
            <div>
                {[new Vector3(1, 0, 0), new Vector3(-1, 0, 0)].map((vd: Vector3, i) => {
                    return (
                        <span key={`ControlBlock_positionspan#${i}`}>
                        <button
                        onClick={() => {
                           setPosition(new Vector3().addVectors(transform.position, vd));
                           setStepIndex(stepIndex + 1);
                           // console.log("move!", transform.position );
                        }}
                        >
                        {vd.toArray().toString()}
                        </button>
                    </span>
                    );
                })}
            </div>
            <h2>{title}</h2>
            <ShapeDisplay shape={shape} transform={transform} stepIndex={stepIndex} cameraType={cameraType}>
                <mesh>
                    
                </mesh>
            </ShapeDisplay>
            <GraphDisplay stepIndex={stepIndex} vertices={vertices} currentVertex={0} edges={edges} />
            {children}
            
        </div>
    )
    
}