import react, { Dispatch } from 'react';
import { FinitelyGeneratedMonoid, Indexed, IndexedFGM } from '../monoid/IndexedMonoid';
import { Monoid } from '../monoid/Monoid';
import { SetAction } from '../monoid/MonoidDisplay';
import { Controls } from '../App';
import { DisplayQuaternion } from '../info/DisplayQuaternion';
import { MathJax } from 'better-react-mathjax';
import { MemoizedMathJax } from './MemoizedMathJax';
import { E3 } from '../Display';
import { edgeColors } from '../cfg/colors';
import { SectionTitle } from '../info/SectionTitle';
import { compressElementName } from '../monoid/makeMonoid';

// takes a monoid with its generators, and creates an interactive UI with buttons for the generators, that then display a string of the current multiplication sequence, the result, and then an option to reset.
// A type definition for types that have tostring.
type HasName = {
    name: string;
}

type GroupInputProps<T> = {
    append: Dispatch<T>;
    reset: Dispatch<void>;
    monoidValue: Indexed<T>;
    currentSequence: Indexed<T>[];
    generators: Indexed<T>[];
    labels?: Record<number, string>[];
    m: IndexedFGM<T>
}

export const GroupInput = function<T extends HasName & E3>({generators, monoidValue, labels, currentSequence, append, reset, m}: GroupInputProps<T>) {
    console.log(currentSequence);
    let longSequenceString = currentSequence.map(el => el.name).join('');
    if (longSequenceString.length == 0) longSequenceString += "e";
    console.log({monoidValue});
    let currentName = monoidValue.name ?? labels?.[monoidValue.index] ?? monoidValue.index ?? "";
    let sequenceString = compressElementName(longSequenceString);
    const outString = `\\begin{aligned}\\mathbf\{${sequenceString}\} &&\\mathbf\{= ${currentName}\}\\end{aligned}`;

    const buttonSet = generators.map((generator, i) => {
        let curr = generator;
        let last;
        while (curr.index != 0) {
            last = curr;
            curr = m.multiply(curr, generator);
        }
        if (last.index == generator.index) {
            // the generator is its own inverse
            return (
                <div className='generator-column' key={`GroupInput_div[${i}]`}>
                    <button 
                    type={"button"}
                        className='generator-button'
                        key={`GroupInput__generator[${i}]`} 
                        onClick={function() {
                            append(generator);
                        }}
                        style={{ backgroundColor: edgeColors[i] }}
                        >
                        <MemoizedMathJax style={{textAlign: "left", fontSize: "30px"}} formula={`\\[${generator.name ?? generator.index}\\]`}/>
                    </button>
                </div>
            )
        } else {
            // anything else, 2 buttons for self/inverse
            last.name = `${generator.name}^{-1}`;
            return (
                <div  className='generator-column' key={`GroupInput_div[${i}]`}>
                    <button 
                        type={"button"}
                        className='generator-button'
                        key={`GroupInput__generator[${i}]`} 
                        onClick={function() {
                            append(generator);
                        }}
                        style={{ backgroundColor: edgeColors[i] }}
                        >
                        <MemoizedMathJax style={{textAlign: "left", fontSize: "30px"}} formula={`\\[${generator.name ?? generator.index}\\]`}/>
                    </button>
                    <button 
                        type={"button"}
                        className='generator-button'
                        key={`GroupInput__generator[${i}]_inv`}
                         
                        onClick={function() {
                            append(last);
                        }}
                        style={{ backgroundColor: edgeColors[i] }}
                        >
                        <MemoizedMathJax style={{textAlign: "left", fontSize: "30px"}} formula={`\\[${generator.name ?? generator.index}^{-1}\\]`}/>
                    </button>
                </div>
            )
        }
    })

    return (
        <div className='GroupInput'>
            <div className='MonoidInput-top lineBorder' style={{display: "flex"}}>
                <div className='GroupInput-sequence' style={{flexGrow: 1, flexBasis: "0px"}}>
                    <MemoizedMathJax  style={{ marginTop:"20px",   filter: "drop-shadow(0px 1px 4px #111)"}} formula={outString}/>
                </div>
            </div>
            <div className='GroupInput-bottom'>{
                (generators.length == 0) ? 
                   <div className='GroupInput'>
 
                </div>
                : <div className='GroupInput__buttons lineBorder'>
                <SectionTitle title={"Generators"} />
                <div  className='GroupInput__generators'>
                    {buttonSet}
                <button className="reset-button" key={`GroupInput__reset`} onClick={reset}>Reset</button>
                </div>
                </div>
            }         

            <div style={{marginLeft: "auto", height: "calc(100% - 50px)",  paddingTop: "6px"}}>
                <SectionTitle title={"Rotation Matrix"} />

                <DisplayQuaternion quaternion={monoidValue.value.rotation} mode={Controls.controlVals.quaternionDisplayMode}/> 
                </div>
            </div>
        </div>
    )
}