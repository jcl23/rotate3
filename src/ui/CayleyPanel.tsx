import { useState } from "react";
import { CayleyGraphData } from "./cayleygraph/CayleyGraph"
import { IndexedFinExpMonoid } from "../monoid/IndexedMonoid"
import { makeEmbeddedSubmonoid, makeSubmonoid } from "../monoid/makeMonoid";

type CayleyPanelProps = {
    group: IndexedMonoid<any>;
}

export const CayleyPanel = function({group}: CayleyPanelProps) {
    const numElements = group.elements.length;
    const [isActiveArray, setIsActiveArray] = useState<boolean[]>(new Array(numElements).fill(false));
    
    
    const generatorIndices = isActiveArray.map((isActive, i) => isActive ? i : -1).filter(i => i != -1);
    const generators = generatorIndices.map(i => group.elements[i]);
    const subgroup = makeEmbeddedSubmonoid(group, generators);
    
    const isGeneratedArray = new Array(numElements).fill(false);
    // return a square grid of buttons, one for each element in the group
    const toggle = function(index: number) {
        setIsActiveArray(prev => {
            const next = [...prev];
            next[index] = !next[index];
            return next;
        });
    }

    const gridItems = Array.from({ length: group.elements.length }, (_, i) => (
        <div key={i} className="grid-item">
          {`Button ${i + 1}`}
        </div>
      ));
    const buttonClassNameByIndex = (index: number) => "CayleyPanel__button " + (isActiveArray[index] ? "active" : subgroup.elements.some(({index: _index}) => index == _index) ? "highlighted2" : "inactive");
    return (
        <div className="CayleyPanel__outer">
            <div className="CayleyPanel__grid">
                {group.elements.map((e, i) => <button key={`CayleyPanel__button[${i}]`} className={buttonClassNameByIndex(i)} onClick={() => {toggle(i)}}>{i}</button>)}
            </div>
            <div>
                <button>Generate Cayley Graph</button>
            </div>
        </div>
    )
}