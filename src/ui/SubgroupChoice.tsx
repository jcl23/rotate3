import { SubgroupData } from "../data/subgroupData";

export type SubgroupChoiceProps = {
    choices: SubgroupData[];
    choiceIndex: number;
    setChoiceIndex: (n: number) => void;
}

export function SubgroupChoice({choices, choiceIndex, setChoiceIndex}: SubgroupChoiceProps) {
    if (choices == null || choices.length == 0) {
        return <div style={{width: "100%"}}>No subgroups</div>
    }
    if (choices.length == 1) {
        return <div style={{width: "100%"}}>{choices[0].name}</div>
    }
    const previousIndex = (choiceIndex - 1 + choices.length) % choices.length;
    const nextIndex = (choiceIndex + 1) % choices.length;
    return (
        <div className="SubgroupChoice__outer" style={{display: "inline-flex"}}>
            <div style={{width: "20%"}}>Prev</div>
            <button onClick={(() => setChoiceIndex(previousIndex))} style={{width: "20%"}}>{'<'}</button>
            <div style={{width: "30%"}}>{choices[choiceIndex].name}</div>
            <button onClick={(() => setChoiceIndex(nextIndex))} style={{width: "20%"}}>{'>'}</button>
            <div style={{width: "20%"}}>Next</div>
        </div>
    )
}