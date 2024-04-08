import {useEffect, useMemo, useState } from "react";
import React from "react";
import { Indexed, IndexedMonoid } from "./IndexedMonoid";
import { defaultShapes } from "../DefaultMeshes";
import { edgeColors } from "../cfg/colors";



export type SetAction<T> = React.Dispatch<React.SetStateAction<T>>
export type MonoidDisplayProps<T> = {
  monoid: IndexedMonoid<T>;
  availableTransformations: Indexed<T>[];
  generators: Indexed<T>[];
  // children: ReactElement<typeof ShapeDisplay>
  //   | Array<ReactElement<typeof ShapeDisplay>>;
    shape: keyof typeof defaultShapes;
  updateHash: string;
  subgroup: string;
  // inclusion: (i: number) => number;
  monoidValue: Indexed<T>;
  setMonoidValue: SetAction<Indexed<T>>;
};

export function useMonoid = function<T> (monoid: IndexedMonoid<T>) {
  const [monoidValue, setMonoidValue] = useState(monoid.identity);
  return { monoidValue, setMonoidValue };
}
export const FGIMonoidDisplay = function<T> ({
  // Responsible for managing 
  monoid,
  availableTransformations,
  generators,
  monoidValue,

  setMonoidValue
}: MonoidDisplayProps<T>) {
  
  const { identity, multiply, name } = monoid;

  const [stepIndex, setStepIndex] = useState(0);


  const composeStateWith = (x: Indexed<T>) => {
    const nextValue = multiply(monoidValue, x);
    setMonoidValue(nextValue);
  }



  /*
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
        style:  
        //new style including the current:  
        Object.assign({}, (child as JSX.Element).props.style, { 
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
      */
  useEffect(() => {
    console.log("Set new monoid value:", monoidValue);
  }, [monoidValue, stepIndex])
  
  if (monoidValue === undefined) console.warn("monoidValue is undefined");
  return (
    <div className="MonoidDisplay_outer">
      <div className="MonoidDisplay_buttons">

        {availableTransformations.map((transform, i) => {
          const isGenerator = generators.some((generator) => generator.index === transform.index);
          const style = isGenerator ? {
            backgroundColor: edgeColors[i % edgeColors.length]
          } : {};
          return (

            <button className={"transform-button"} key={`ShapeDisplay_span#${i}`} style={style}
              onClick={() => {
                //setRotation(new Quaternion().multiplyQuaternions(generator.rotation, transform.rotation));
                composeStateWith(transform);
                setStepIndex(stepIndex + 1);
                
              }}
              >
              {transform.index}
            </button>
        )
        })}
    </div>
   
      
    </div>
  );
};
