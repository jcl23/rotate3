import { ReactElement, cloneElement, useEffect, useMemo, useState } from "react";
import { ShapeDisplay } from "../ShapeDisplay";
import React, { Children } from "react";
import { Monoid } from "./Monoid";
import { Transform } from "../Display";
import { Indexed } from "./IndexedMonoid";
import { CayleyGraph } from "../CayleyGraph";
import { defaultShapes } from "../DefaultMeshes";
import { Quaternion, Vector3 } from "three";
import { DefaultVertices } from "../logic/cayleyTables";



export type MonoidDisplayProps<T extends Indexed<Transform>> = {
  monoid: Monoid<Indexed<Transform>> ;
  generators: T[];
  children: ReactElement<typeof ShapeDisplay>
    | Array<ReactElement<typeof ShapeDisplay>>;
    shape: keyof typeof defaultShapes;
  updateHash: string;
  subgroup: string;
};

export const FGIMonoidDisplay = function<T extends Indexed<Transform>> ({
  monoid,
  generators,
  children,
  shape,
  subgroup
}: MonoidDisplayProps<Indexed<Transform>>) {
  
  const { identity, multiply, name } = monoid;

  const [stepIndex, setStepIndex] = useState(0);
  const [monoidValue, setMonoidValue] = useState(identity);

  const composeStateWith = (x: T) => {
    const nextValue = multiply(monoidValue, x);
    setMonoidValue(nextValue);
  }
  useEffect(() => {
    setMonoidValue(identity);
  }, [shape, subgroup]);

  let childrenArray = Children.toArray(children);

  

  const newElements = useMemo(() => (Children).map(childrenArray, (child, i) => (
    (
      (child as JSX.Element).type === ShapeDisplay 
      || (child as JSX.Element).type === CayleyGraph
    )
    ? 
    React.cloneElement(child, {
        key: `MonoidDisplay_element1#${i}`,
        stepIndex: stepIndex,
        transform: monoidValue,
        style: /* new style including the current: */ Object.assign({}, (child as JSX.Element).props.style, { 
          position: "absolute",
          top: "0px",
          left: "0px",
          width: "100%",
          height: "100%",
        }),
        cameraType: child.props.cameraType ?? "front-facing",
        shape
      })
      : child
  )), [monoidValue, shape]);

  useEffect(() => {
    console.log("Set new monoid value:", monoidValue);
  }, [monoidValue, stepIndex])
  
  if (monoidValue === undefined) console.warn("monoidValue is undefined");
  return (
    <div className="MonoidDisplay_outer">
      <div className="MonoidDisplay_buttons">

        {generators.map((generator, i) => (

            <button className="generator-button" key={`ShapeDisplay_span#${i}`}
              onClick={() => {
                //setRotation(new Quaternion().multiplyQuaternions(generator.rotation, transform.rotation));
                composeStateWith(generator);
                setStepIndex(stepIndex + 1);
                
              }}
              >
              {generator.index}
            </button>
        ))}
    </div>
      <div>{...newElements}</div> 
      
    </div>
  );
};
