import { useEffect, useState } from "react";
import groupData  from "../data/groupData";
import { getElementOrder, monoidToOrderRecord,  reindexCayleyData, simplifyCayleyData, } from "../logic/cayleyLogic";
import { Indexed, IndexedFGM } from "../monoid/IndexedMonoid";
import { makeSubmonoid } from "../monoid/makeMonoid";
import { GeneratorSelector } from "./GeneratorSelector";
import { SelectorComponent } from "./Selector";
import { GraphEdge } from "./CayleyGraphEditor";
import { CayleyGraphVertex } from "../CayleyGraph";
import { set } from "firebase/database";

type GraphMatchingSelectorProps = {
    groupName: string;
    setChosenGroup: (groupName: string) => void;
    setGeneratedEdges: (generatedEdges: [number, number][]) => void;
    edgeOrders: number[];
    edges: GraphEdge[][];
    vertices: CayleyGraphVertex[];
  };
  
  
  export const GraphMatchingSelector = function ({ groupName, setGeneratedEdges, edgeOrders, edges, vertices }: GraphMatchingSelectorProps) {
    let failed = false;
    const group: IndexedFGM<number[]> = groupData[groupName];
    const n = edgeOrders.length;
    const orderRecord = monoidToOrderRecord(group);

    let generatedElements; // The eleme
    let output;
    let stringToCopy;
    let generatedEdges;
    
    const [state, setState] = useState({
        targetGeneratorIndices: edgeOrders.map(o => orderRecord?.[o]?.[0]?.index ?? -1),
        } );
       
        
        
        let generators: Indexed<any>[] = [];
    let generatedSpace: IndexedFGM<any>;
    // if we don't have enough elements in the group then dont try
    useEffect(() => {
        // When the group name changes, we need to update the available generator choices.
        // We can make a list of all of the generators, and using the orders of the elements,
        // we can, for each edge group of order n, provide a selector for the generators of that order.
        const targetGenerators = state.targetGeneratorIndices.map(i => group.elements[i]);
        const record = monoidToOrderRecord(group);
       
        const choicesByEdgeIndex = edgeOrders.map(order => record[order]);
        console.log({group});
    }, [groupName])
    
    // attempt to generate the group using the generators we map to. 
    
    // If we can't, our generators won't work.
   
   
    const copyToClipboard = () => {
      if (stringToCopy == undefined) return;
      navigator.clipboard.writeText(stringToCopy);
    }
    
    const demoEdgeFinding = () => {
      // Given the edges stored in generatedEdges, we want to 
    }
    const setTargetIndex = (edgeIndex: number) => (targetIndex: number) => {
        
        const newTargetGeneratorIndices = state.targetGeneratorIndices.slice(0);
        newTargetGeneratorIndices[edgeIndex] = group.elements[targetIndex].index;
        setState({
            ...state,
            targetGeneratorIndices: newTargetGeneratorIndices
        })
    }
    // We would like to use the targetGeneratorIndices, but since they are behind, we have to make sure for
    // each element that we set it to a proper order one instea, if it is not already.
    useEffect(() => {
      const targetGenerators = state.targetGeneratorIndices.map(i => group.elements[i]);
      for (let edgeIndex = 0; edgeIndex < n; edgeIndex++) {
        if (targetGenerators[edgeIndex] == undefined) continue;
        const validElements = orderRecord[edgeOrders[edgeIndex]];
        if (validElements.length == 0) {
          failed = true;
          break;
        }
        let targetHasCorrectOrder = validElements.some(el => el.index == targetGenerators[edgeIndex].index);
        if (!targetHasCorrectOrder) {
          // We have a valid one to use
          failed = true;
          // set to a valid one
          const newTargetGeneratorIndices = state.targetGeneratorIndices.slice(0);
          let newIndex = validElements[0].index;
          if (newIndex != undefined) {
            newTargetGeneratorIndices[edgeIndex] = newIndex;
          }
          setState({
            ...state,
            targetGeneratorIndices: newTargetGeneratorIndices
          });
  
          
        }
          // We need to find a generator of the correct order.
    
         
          
        }
      }, [state.targetGeneratorIndices])
        useEffect(() => {
          setGeneratedEdges(generatedEdges);
        }, [stringToCopy]);
   
    if (group.elements.length == 1) {
      // We can't generate anything with a group of order 1.
      return (
        <div className="SelectorComponent__outer">
          <p>
            This group has order 1, so it can't be used to generate anything.
          </p>
        </div>
      );
    }

    let submonoid;
    try {
      submonoid = makeSubmonoid(group, state.targetGeneratorIndices.map(i => group.elements[i]));
    } catch (e) {
      console.warn(e);
    }

   
    const newGenerators = state.targetGeneratorIndices.map(i => group.elements[i]);
    if (edges !== undefined && submonoid !== undefined) {
      generatedElements = submonoid.elements;
      if (generatedElements.length == group.elements.length) {
        // Generated the whole group
        // Create a map from group vertices to Vector22.

        let vertexIndexByElement: number[] = [];
        let foundEdges: [number, number][] = [];
        vertexIndexByElement[0] = 0;
        // breatdh first search

        let vertexStartIndex = 0;
        let queue: { element: Indexed<any>, vertexIndex: number }[] = [];
        let visited = new Set<number>();
        queue.push({ element: group.identity, vertexIndex: vertexStartIndex });
        while (queue.length > 0) {
          let newQueue: { element: Indexed<any>, vertexIndex: number }[] = [];
          let current;
          while (current = queue.pop()) {

            if (current == undefined) throw new Error("current is undefined");
            visited.add(current.element.index);
            for (let i = 0; i < newGenerators.length; i++) {
              const generator = newGenerators[i];
              const outgoingEdge = edges[i].find(edge => edge[0] == current.vertexIndex);
              const nextVertexIndex = outgoingEdge?.[1];          
              if (nextVertexIndex == undefined) throw new Error("nextVertexIndex is undefined");
              
              const element = group.multiply(current.element, generator);
              if (!visited.has(element.index)) {
                // find next vertex index
                newQueue.push({
                  element,
                  vertexIndex: nextVertexIndex
                });
                vertexIndexByElement[element.index] = nextVertexIndex;
              }
            }
          }
          queue = newQueue;
        }
        console.log(`%c MAP: ${JSON.stringify(vertexIndexByElement)}`, "color: #f00");

        // const reindexedVertices = map.map((vertexIndex, elementIndex) => vertices);
        const compiledCayleyGraphData = reindexCayleyData({ edges, vertices }, vertexIndexByElement, group); 
        const simplified = {[groupName]:simplifyCayleyData(compiledCayleyGraphData)};
        stringToCopy = JSON.stringify(simplified).replace(/"([^"]+)":/g, '$1:');
        // Regex to remove the first, last braces if there are any.
        generatedEdges = foundEdges;
        stringToCopy = stringToCopy.replace(/^\{/, "").replace(/\}$/, "");
        
        
        output =(
          <p>
            Generated the whole group!
          </p>
        );
      } else {
        output = (
          <p>
            Generated {generatedElements.length} of {group.elements.length}{" "}
            elements.
          </p>
        );
      }
    }
    return (
    <div className="SelectorComponent__outer">
      
      {edgeOrders.map((order, i) => {
       
       
        return (
          <span key={`GraphMatchingSelector__span[${i}]`}>
            <h4 style={{ display: "inline-block" }}>{i + 1}</h4>
            <GeneratorSelector
              key={`GeneratorSelector_${i}`}
              monoid={group}
              index={state.targetGeneratorIndices[i]}
              values={orderRecord[order]}
              setIndex={setTargetIndex(i)}
              order={order}
            />
            
          </span>
        );
    })}
    <div>
    {(submonoid !== undefined && (!failed)) && output}

    </div>
    <button onClick={copyToClipboard}>Copy</button>
    <button onClick={demoEdgeFinding}>Demo</button>
    </div>
  );
};
