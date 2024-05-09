import { MathJax } from "better-react-mathjax";
import { Component, useMemo } from "react";

type MemoizedMathJaxProps = {
    formula: string;
}

export const MemoizedMathJax = function({ formula, ...props }: MemoizedMathJaxProps) {
    const element = useMemo(() => {
        if (!formula.startsWith("\\[")) formula = "\\[" + formula + "\\]";
        return <MathJax className="MemoizedMathJax" hideUntilTypeset={"every"} {...props} dynamic>{formula ?? "ERR"}</MathJax>
    }, [formula]);


    return element;
}