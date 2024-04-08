import { useEffect, useState } from "react";
import groupData, { FinExpMonoid } from "../data/groupData";
import { getElementOrder, monoidToOrderRecord, reindexCayleyData, simplifyCayleyData, } from "../logic/cayleyLogic";
import { FinitelyGeneratedMonoid, Indexed, IndexedFGM, indexMonoid } from "../monoid/IndexedMonoid";
import { makeEmbeddedSubmonoid, makeSubmonoid } from "../monoid/makeMonoid";
import { GeneratorSelector } from "./GeneratorSelector";
import { SelectorComponent } from "./Selector";
import { GraphEdge } from "./CayleyGraphEditor";
import { CayleyGraphVertex } from "../CayleyGraph";
import { set } from "firebase/database";
import subgroupsData_, { IsomorphismClass, SubgroupData, SubgroupsData } from "../data/subgroupData";
const subgroupsData: Record<GeometryName, Record<GroupName, IsomorphismClass>> = subgroupsData_;
import { GroupName } from "../DefaultMeshes";
import { GeometryName } from "../DefaultMeshes";
import { sub } from "three/examples/jsm/nodes/Nodes.js";
import useIndexState from "../hooks/useIndexedState";
import compareMonoids from "../monoid/compareMonoids";
import { makeHomomorphism } from "../monoid/homomorphism";
import { E3 } from "../Display";
import { Vector2 } from "three";
import { getPerformance } from "firebase/performance";

type GraphMatchingSelectorProps = {
  mainGroup: IndexedFGM<E3>;
  subgroupName: GroupName;
  shapeName: GeometryName;
  setChosenGroup: (groupName: string) => void;
  setGeneratedEdges: (generatedEdges: [number, number][]) => void;
  edgeOrders: number[];
  edges: GraphEdge[][];
  vertices: CayleyGraphVertex[];
};


export const GraphMatchingSelector = function ({ mainGroup, subgroupName, edgeOrders, edges, vertices }: GraphMatchingSelectorProps) {
  
  const subgroupIsomorphismClass = subgroupsData[mainGroup.name][subgroupName] ?? [];
  const subgroups = subgroupIsomorphismClass.conjugacyClasses.map((c) => c.members).flat();
  // by order, a list of indices of elements of the parent group, to be 
  // included as generators of the subgroup.

  let generatedElements; // The eleme
  let output;
  let stringToCopy;
  let generatedEdges;

  const [subgroupIndex, setSubgroupIndex] = useIndexState(subgroups);
  const localSubgroupData = subgroups[subgroupIndex];
  const subgroup = makeEmbeddedSubmonoid(mainGroup, localSubgroupData.generators.map(i => mainGroup.elements[i]));
  
  const orderRecord = monoidToOrderRecord(subgroup);
  const clone = indexMonoid(subgroup);

  const targetGeneratorIndicesDefault = edgeOrders.map(order => orderRecord[order]?.[0].index ?? -1);
  const [state, setState] = useState({
    targetGeneratorIndices: targetGeneratorIndicesDefault,
    cosetIndex: 0,
  });
  
  
  console.log("GRAPHMATCHINGSELECTOR", subgroup.elements)
  const indexedSubgroup = indexMonoid(subgroup);
  if (localSubgroupData === undefined) {
    throw new Error(`[ GraphMatchingSelector ] Subgroup is undefined`);
  }
  //const generatorEmbeddedIndicesLists = Object.values(subgroupsData["Cube"]).map(({ generators }) => generators);
  //const generatorEmbeddedIndices = generatorEmbeddedIndicesLists[state.cosetIndex];
  // const embeddedGenerators = generatorEmbeddedIndices.map(i => mainGroup.elements[i]);

  // const subgroup: IndexedFGM<number[]> = makeEmbeddedSubmonoid(mainGroup, embeddedGenerators);



  // if we don't have enough elements in the group then dont try
  /*
  useEffect(() => {
      // When the group name changes, we need to update the available generator choices.
      // We can make a list of all of the generators, and using the orders of the elements,
      // we can, for each edge group of order n, provide a selector for the generators of that order.
      const targetGenerators = state.targetGeneratorIndices.map(i => group.elements[i]);
      const record = monoidToOrderRecord(group);
     
      const choicesByEdgeIndex = edgeOrders.map(order => record[order]);
      console.log({group});
  }, [groupName])
  */

  // attempt to generate the group using the generators we map to. 

  // If we can't, our generators won't work.


  const copyToClipboard = () => {
    navigator.clipboard.writeText(stringToCopy);
/*
    if (graphMonoid === undefined) throw new Error(`[ GraphMatchingSelector ] graphMonoid is undefined`); 
    const orderedVertices = graphMonoid.elements.map((includedIndex, localIndex) => vertices[includedIndex]);
    const reindexVertex = (n: number) => graphMonoid.elements.indexOf(n);
    // const newVertices = orderedVertices.map((vertex, index) => ({vertex: { x: Math.round(vertex.x), y: Math.round(vertex.y)}, index}));
    const simplified = { [indexedSubgroup.name]: simplifyCayleyData({ vertices: orderedVertices, edges: newEdges }) };
    stringToCopy = JSON.stringify(simplified).replace(/"([^"]+)":/g, '$1:');
      // Regex to remove the first, last braces if there are any.
      // generatedEdges = foundEdges;
    stringToCopy = stringToCopy.replace(/^\{/, "").replace(/\}$/, "");
    */
  }

  const demoEdgeFinding = () => {
    // Given the edges stored in generatedEdges, we want to 
  }
  
   const setTargetIndex = (edgeIndex: number) => (targetIndex: number) => {
       
       const newTargetGeneratorIndices = state.targetGeneratorIndices.slice(0);
       newTargetGeneratorIndices[edgeIndex] = targetIndex;
       setState({
           ...state,
           targetGeneratorIndices: newTargetGeneratorIndices
       })
   }
  // We would like to use the targetGeneratorIndices, but since they are behind, we have to make sure for
  // each element that we set it to a proper order one instea, if it is not already.

  if (localSubgroupData.generators.length == 0) {
    // We can't generate anything with no generators.
    return (
      <div className="SelectorComponent__outer">
        <p>
          This group has order 1, so it can't be used to generate anything.
        </p>
      </div>
    );
  }

  const partialEdgeCayleyTable: number[][] = [];
  const newGenList = edges.map(list => list.find(([a, b]) => a == 0)![1])
  for (let i = 0; i < edges.length; i++) {
    const b = newGenList[i]; // the ith list is the generator at index i + 1
    const row = edges[i];
    for (let j = 0; j < row.length; j++) {
      partialEdgeCayleyTable[j] ??= [];
      partialEdgeCayleyTable[j][b] = row.find(([a, b]) => a == j)![1];
    }
  }

  const multiply = function (a: number, b: number) {
    if (b < 1) {
      throw new Error(`[ GraphMatchingSelector ] b is out of range: ${b} has to be a generator.`);
    }
    return partialEdgeCayleyTable[a][b];
  }
  let targetGeneratorIndices;
  if (state.targetGeneratorIndices.every(el => el > 0)) {
    targetGeneratorIndices = state.targetGeneratorIndices;
  } else {
    targetGeneratorIndices = targetGeneratorIndicesDefault;
  }
    // const newGenList = edges.map(list => list.find(([a, b]) => a == 0)![1])
    const graphMonoidData: FinitelyGeneratedMonoid<number> = {
      identity: 0,
      multiply,
      generators: newGenList,
      name: "Graph",
      compare: (a, b) => a - b,
    };
    const graphMonoid = makeSubmonoid(graphMonoidData, graphMonoidData.generators);// indexMonoid(graphMonoidData);
    // might be valid generators
    const generatorMap = new Map();
    let orderOf = (i: number) => getElementOrder(clone, clone.elements[i]);
    let unseen = new Set();
    clone.generators.forEach(({ index }) => unseen.add(index));
    const smallRecord = monoidToOrderRecord(clone);
    for (let i = 0; i < targetGeneratorIndices.length; i++) {
      const generatorIndex = clone.generators[i].index;
      const order = orderOf(generatorIndex);
      const target = smallRecord[order]?.find(({ index }) => unseen.has(index));
      if (target !== undefined) {
        unseen.delete(target.index);
        generatorMap.set(target.index, newGenList[i]);

      }
    } 
   
    // clone.generators = state.targetGeneratorIndices.map(i => mainGroup.elements[i]);
    const phi = makeHomomorphism(clone, graphMonoid, generatorMap);
    const phiInverse = new Map<number,number>();
    for (let i = 0; i < clone.elements.length; i++) phiInverse.set(phi.get(i) ?? 0, i);
    const newVertices: CayleyGraphVertex[] = [];
    for (let i = 0; i < phi.size; i++) {
      newVertices.push(vertices[phi.get(i) ?? 0]);
    }
    const newEdges = edges.map(row => row.map(([a, b]): [number, number] => [phiInverse.get(a) ?? 0, phiInverse.get(b) ?? 0]));

    // const simplified = { [indexedSubgroup.name]: simplifyCayleyData({ vertices: newVertices, edges }) };
    const embeddedIndexToVertex = (index: number): CayleyGraphVertex => {
      const image = phi.get(index);
      if(image === undefined) throw new Error(`[ GraphMatchingSelector ] image is undefined`);
      return newVertices[image];
    }
    console.log(phi);
    if (phi.size != subgroup.elements.length/*!areSame*/) {
      throw new Error(`[ GraphMatchingSelector ] subgroup and graphMonoid are not the same`);
    } else {
      console.log(`[ GraphMatchingSelector ] subgroup and graphMonoid are the same`);
    }

    if (graphMonoid.elements.length != vertices.length) {
      throw new Error(`[ GraphMatchingSelector ] graphMonoid.elements.length != vertices.length`);
    } 

    if (graphMonoid.elements.length == subgroup.elements.length) {
      output = (
        <p>
          Generated the whole group!
        </p>
      );
    } else {
      output = (
        <p>
          Generated {graphMonoid.elements.length} of {subgroup.elements.length}{" "}
          elements.
        </p>
      );
    }
 
    const simplified = { [subgroup.name]: simplifyCayleyData({ edges: newEdges, vertices: newVertices }) };
    stringToCopy = JSON.stringify(simplified).replace(/"([^"]+)":/g, '$1:');
    // Regex to remove the first, last braces if there are any.
    // generatedEdges = foundEdges;
    stringToCopy = stringToCopy.replace(/^\{/, "").replace(/\}$/, "");
  return (
    <div className="SelectorComponent__outer GraphMatchingSelector">

      {edgeOrders.map((order, i) => {


        return (
          <span key={`GraphMatchingSelector__span[${i}]`}>
            <h4 style={{ display: "inline-block" }}>{i + 1}</h4>
            <GeneratorSelector
              key={`GeneratorSelector_${i}`}
              monoid={subgroup}
              index={state.targetGeneratorIndices[i]}
              values={orderRecord[order]}
              setIndex={setTargetIndex(i)}
              order={order}
            />

          </span>
        );
      })}
      <div>
        {(subgroup !== undefined) && output}

      </div>
      <button onClick={copyToClipboard}>Copy</button>
      <button onClick={demoEdgeFinding}>Demo</button>
    </div>
  );
};
