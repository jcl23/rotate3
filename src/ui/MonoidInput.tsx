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

// takes a monoid with its generators, and creates an interactive UI with buttons for the generators, that then display a string of the current multiplication sequence, the result, and then an option to reset.
// A type definition for types that have tostring.
type HasName = {
    name: string;
}

type MonoidInputProps<T> = {
    append: Dispatch<T>;
    reset: Dispatch<void>;
    monoidValue: Indexed<T>;
    currentSequence: Indexed<T>[];
    generators: Indexed<T>[];
    labels?: Record<number, string>[];
    m: IndexedFGM<T>
}

export const MonoidInput = function<T extends HasName & E3>({generators, monoidValue, labels, currentSequence, append, reset}: MonoidInputProps<T>) {
    
    let sequenceString = currentSequence.map(el => el.name).join('');
    if (sequenceString.length == 0) sequenceString += "e";
    console.log({monoidValue});
    let currentName = monoidValue.name ?? labels?.[monoidValue.index] ?? monoidValue.index ?? "";
    const outString = `\\begin{aligned}\\textbf\{${sequenceString}\} &&\\mathbf\{= ${currentName}\}\\end{aligned}`;
    return (
        <div className='MonoidInput'>
            <div className='MonoidInput-top' style={{display: "flex"}}>
                <div className='MonoidInput-sequence' style={{flexGrow: 1, flexBasis: "0px"}}>
                    <MemoizedMathJax  style={{ marginTop:"20px",   filter: "drop-shadow(0px 2px 1px #0004) drop-shadow(0px 2px 4px #EFE)"}} formula={outString}/>
                </div>
            </div>
            <div className='MonoidInput-bottom'>
                <div className='MonoidInput__buttons lineBorder'>
                    <div  className='MonoidInput__generators'>

                    {generators.map((generator, i) => (
                        <button 
                        className='generator-button'
                            key={`MonoidInput__generator[${i}]`} 
                            onClick={function() {
                                append(generator);
                            }}
                            style={{
                                backdropFilter: "brightness(0.8)",
                                backgroundColor: edgeColors[i],
                            }}
                        >
                            <MemoizedMathJax style={{textAlign: "left", fontSize: "30px"}} formula={`\\[${generator.name ?? generator.index}\\]`}/>
                            </button>
                    ))}
                            </div>
                    <button className="reset-button" key={`MonoidInput__reset`} onClick={reset}>Reset</button>

                </div>
          
         
            {/* 
            */}
            <div style={{marginLeft: "auto", height: "100%"}}>
            <DisplayQuaternion quaternion={monoidValue.value.rotation} mode={Controls.controlVals.quaternionDisplayMode}/> 
                </div>
            </div>
        </div>
    )
}