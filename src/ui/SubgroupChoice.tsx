import { SubgroupData } from "../data/subgroupData";
import { MemoizedMathJax } from "./MemoizedMathJax";

export type SubgroupChoiceProps = {
    choices: SubgroupData[];
    choiceIndex: number;
    setChoiceIndex: (n: number) => void;
}

export function SubgroupChoice({choices, choiceIndex, setChoiceIndex}: SubgroupChoiceProps) {
    if (choices == null || choices.length == 0) {
        return (
            <div className="SubgroupChoice__outer">
                <div style={{width: "100%"}}>No subgroups</div>
            </div>
            )
    }
    if (choices.length == 1) {
        return (
            <div className="SubgroupChoice__outer">
                <div style={{width: "100%"}}>{choices[0].name}</div>
            </div>
            )
    }
    const previousIndex = (choiceIndex - 1 + choices.length) % choices.length;
    const nextIndex = (choiceIndex + 1) % choices.length;
    const name = choices[choiceIndex].name.length  
    
        ? <>
        <div style={{height:"10px"}} />
        <MemoizedMathJax formula={`\\[${choices[choiceIndex].name}\\]`} />
        </>
        : (choiceIndex + 1);
    return (<>
        <h4 style={{marginTop: "15px", marginBottom: "-10px"}}>Index In Conjugacy Class</h4>
        <div className="SubgroupChoice__outer">
            <div  style={{width: "20%"}}></div>
            <button className="arrow-leftX" onClick={(() => setChoiceIndex(previousIndex))} style={{width: "20%"}}>Prev</button>
            <h1 style={{width: "30%"}}>{name}</h1>
            <button  className="arrow-rightX" onClick={(() => setChoiceIndex(nextIndex))} style={{width: "20%"}}>Next</button>
            <div style={{width: "20%"}}></div>
        </div>
    </>
    )
}