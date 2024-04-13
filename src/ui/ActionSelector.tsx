import { EditorAction } from "./cayleygraph/CayleyGraphEditor";

export type ActionSelectorData<ActionName extends string> = {
    name: string,
    actions: Partial<Record<ActionName, () => void>>,
}


export function ActionSelectorComponent(data: ActionSelectorData<EditorAction>) {
    const { actions, name } = data;

    let elements;
    const options = Object.keys(actions) as EditorAction[];
    elements = options.map((option, i) => (
        <button 
            onClick={actions[option]} 
            key={`SelectorComponent_option#${i}`}
        >
            {option.toString()}
        </button>
    ));
   
    return (
        <div className="SelectorComponent__outer">
            {name != "" && (<h2>{name}</h2>)}
            {elements}
        </div>
    )
    return null;
}