

import { StyleHTMLAttributes, useEffect, useRef, useState } from "react";



import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { defaultShapes } from "./DefaultMeshes";
import { ShapeProps, Step } from "./Shape";

import { PTR_COLOR } from "./cfg/colors";
import { Vector2, Vector3 } from "@react-three/fiber";
import { animated, useSpring } from "react-spring";
import defaultSpringConfig from "./cfg/springs";
import { MathComponent } from "mathjax-react";

type CayleyGraphPointerProps = {
  transform: Step<{x: number, y: number}>;
  text: string;
  width: number;
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
    width: `${style.width}`
  };
  const attrs = useSpring(animatedStyle);
  return {
    style: {   ...style, ...attrs},
    ref: (ref) => {
      // The ref is `null` on component unmount
      if (ref) {
        // setLength(ref.getTotalLength());
      }
    },
  };
}

  
export const Pointer = function({ transform, text, width }: CayleyGraphPointerProps) {
  const frameRef = useRef(null);
  const textRef = useRef(null);
  /*
  const { x, y } = useSpring({
    ...transform,
    config: { mass: 1, tension: 170, friction: 26, precision: 0.001 },
  });
  
  console.log(transform, x, y);
  */
 console.log("Container", textRef.current);
 let currentWidth = textRef.current?.firstChild.firstChild.firstChild.width?.animVal?.value ?? 0;
 /*useEffect(() => {
    console.log("Container", textRef.current);
    currentWidth = textRef.current?.firstChild?.firstChild?.firstChild?.width?.animVal?.value ?? 0;
  }, [textRef.current?.firstChild?.firstChild?.firstChild]);
  */
 const style = {
   
    height: "6%",
    background: "transparent",
    border: "2px solid black",
    width: `${width}px`,
    borderRadius: '15px',
    padding: `0px 3px`,
    // width: `${textRef.current?.getComputedStyle().width ?? 0}px`,
 };
 const position = transform.to;
 const animationProps = useAnimatedPosition(position, style);
 console.log("STYLE:", animationProps.style.transform, animationProps.style.width)
 return (
  <>
    <div className="Pointer" ref={textRef} style={{
      fontSize: `1.75cqw`,
      
    }}>

      <MathComponent  className={"tex2jax_process pointer"}  tex={text ?? "No text"}  />
    </div> 
   <animated.div {...animationProps} ref={frameRef} />
  </>

    );
  }
