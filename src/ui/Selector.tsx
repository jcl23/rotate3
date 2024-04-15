import { HTMLProps } from "react";
import { EditorAction } from "./cayleygraph/CayleyGraphEditor";

export type SelectorData<T> = {
    name: string,
    options: T[] | number[],
    selected: T[] | number[],
    mode: "Value" | "Index",
    useIndices?: boolean
    set: React.Dispatch<React.SetStateAction<(T | number)[]>>,
    outerProps?: HTMLProps<HTMLDivElement>,
}

export function SelectorComponent<T extends { toString: () => string } | number>(data: SelectorData<T>) {
    const {options, selected, set, mode, name, outerProps = {} } = data;
    // console.log("SelectorComponent:", data);
    let elements;
    if (mode == "Value") {
        elements = options.map((option, i) => (
            <button 
                onClick={
                    () => {
                        // console.log("Calling set on", [option]);
                        set([option]) 
                    }
                } 
                key={`SelectorComponent_option#${i}`}
                style={{background: selected.includes(option) ? "lightblue" : "black" }}
            >
                {option.toString()}
            </button>
        ));
    } else {
        elements = options.map((option, i) => (
            <button onClick={() => set(i)} key={`SelectorComponent_option#${i}`}>{option}</button>
        ));
    }
   

    return (
        <div className="SelectorComponent__outer" {...outerProps} >
            <h2>{name}</h2>
            {elements}
        </div>
    )
    return null;
}



