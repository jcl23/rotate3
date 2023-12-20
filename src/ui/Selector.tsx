export type SelectorData<T> = {
    name: string,
    options: T[] | number[],
    selected: T[] | number[],
    mode: "PickOne" | "PickMany" | "Index",
    useIndices?: boolean
    set: React.Dispatch<React.SetStateAction<T[]>>,
}

export function SelectorComponent<T extends { toString: () => string } | number>(data: SelectorData<T>) {
    const {options, selected, set, mode, name, useIndices = false  } = data;

    let elements;
    if (mode == "PickOne") {
        elements = options.map((option, i) => (
            <button 
                onClick={
                    () => set([useIndices ? i : option])
                } 
                key={`SelectorComponent_option#${i}`}
                style={{background: selected.includes(option) ? "lightblue" : "white" }}
            >
                {option.toString()}
            </button>
        ));
    }
    if (mode == "PickMany") {
        elements = options.map((option, i) => (
            <button onClick={() => set([...selected, useIndices ? i : option])} key={`SelectorComponent_option#${i}`}>{option}</button>
        ));
    }
    if (mode == "Index") {
        elements = options.map((option, i) => (
            <button onClick={() => set([option])} key={`SelectorComponent_option#${i}`}>{useIndices ? i : option}</button>
        ));
    }
    return (
        <div className="SelectorComponent__outer">
            <h2>{name}</h2>
            {elements}
        </div>
    )
    return null;
}