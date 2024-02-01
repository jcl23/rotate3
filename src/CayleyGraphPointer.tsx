

import { StyleHTMLAttributes, useRef, useState } from "react";



import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { defaultShapes } from "./DefaultMeshes";
import { ShapeProps, Step } from "./Shape";

import { PTR_COLOR } from "./cfg/colors";
import { Vector2, Vector3 } from "@react-three/fiber";
import { animated, useSpring } from "react-spring";
import defaultSpringConfig from "./cfg/springs";

type CayleyGraphPointerProps = {
  transform: Step<{x: number, y: number}>;
};

function useAnimatedPosition(position: { x: string; y: string }, style: Partial<StyleHTMLAttributes<typeof animated.div>>["style"] = {}) {
  const [length, setLength] = useState(null);

  const x = (position.x.endsWith("%") ? position.x : position.x + "px");
  const y = (position.y.endsWith("%") ? position.y : position.y + "px");
  const animatedStyle = {
    // transform: `translate(${x}, ${y})`,
    left: x,
    top: y,
    config: defaultSpringConfig,
    position: "absolute",
    transform: "translate(-50%, -50%)",
  };
  const attrs = useSpring(animatedStyle);
  return {
    style: { ...attrs,  ...style},
    ref: (ref) => {
      // The ref is `null` on component unmount
      if (ref) {
        // setLength(ref.getTotalLength());
      }
    },
  };
}
export const Pointer = function({ transform }: CayleyGraphPointerProps) {
  const frameRef = useRef(null);
  
  /*
  const { x, y } = useSpring({
    ...transform,
    config: { mass: 1, tension: 170, friction: 26, precision: 0.001 },
  });
  
  console.log(transform, x, y);
  */
 
 const style = {
    width: "6%",
    height: "6%",
    background: "transparent",
    border: "2px solid black",
    borderRadius: "100%",
  
 };
 const position = transform.to;
 const animationProps = useAnimatedPosition(position, style);
 console.log("STYLE:", animationProps.style.transform)
 return (
   
   <animated.div {...animationProps} ref={frameRef} />

    );
  }
