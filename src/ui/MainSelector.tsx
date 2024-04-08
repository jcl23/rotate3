import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { Monoid } from "../monoid/Monoid";
import { Indexed } from "../monoid/IndexedMonoid";
import { Transform } from "../Display";
import { defaultShapes, GeometryName, GroupName } from "../DefaultMeshes";
import { SelectorComponent, SelectorData } from "./Selector";
import { GeometrySelector } from "./GeometrySelector";
import { SolidMonoids } from "../data/platonicsolids";
import groupData from "../data/groupData";
import subgroupsData, { IsomorphismClass, OuterGroupName, SubgroupData, SubgroupName, SubgroupRecord } from "../data/subgroupData";
import useIndexState from "../hooks/useIndexedState";
import { Group } from "three/examples/jsm/libs/tween.module.js";
import defaultSubgroups from "../data/defaultSubgroups";
import { MathJax } from "better-react-mathjax";
import { MemoizedMathJax } from "./MemoizedMathJax";






type MainSelectorProps = {
  setGeometry: Dispatch<SetStateAction<GeometryName>>;
  geometryName: GeometryName,
  setIsoClass: Dispatch<SetStateAction<GroupName>>;
  subgroupName: GroupName;
  setConjugacyClassIndex: Dispatch<SetStateAction<number>>;
  conjugacyClassIndex: number;
  setIndexInClass: Dispatch<SetStateAction<number>>;
  indexInClass: number;
  resetMonoid: () => void;
}
export const MainSelector = function ({
  setGeometry,  geometryName, 
  setIsoClass, subgroupName,
  setConjugacyClassIndex, conjugacyClassIndex,
  setIndexInClass, indexInClass,
  resetMonoid,
  ...props
}: MainSelectorProps) {


  const allShapeNames = ["Cube",  "Icosahedron","Tetrahedron", "Octahedron",  "Dodecahedron"]
  // const [geometryName, setGeometryName] = useState<GeometryName>("Tetrahedron");
  const outerGroup = SolidMonoids[geometryName];

  const availableIsoClasses: Record<SubgroupName<OuterGroupName>, IsomorphismClass> = (subgroupsData as SubgroupRecord)[outerGroup.name];
  const subgroupKeyNames = Object.keys(availableIsoClasses) as SubgroupName<OuterGroupName>[];
  //const [selectedIsoClassIndex, setIsoClass] = useIndexState(availableIsoClassKeyList);
  const availableSubgroups: IsomorphismClass = availableIsoClasses[subgroupName];
  // const [selectedSubgroupIndex, setSubgroup] = useIndexState(availableSubgroups.conjugacyClasses);
  const conjugacyClasses = availableSubgroups.conjugacyClasses;

  type x = SubgroupData
  // setGeometry(allShapeNames.indexOf(geometryName));
  let className = "SelectorPanel";
  if (props.className) {
    className += " " + props.className;
  }
  return (
    <div className={className}>
      <div className="SelectorGroup">
        <GeometrySelector setGeometry={function(g) {
              resetMonoid();
              setConjugacyClassIndex(0);

            setIsoClass(defaultSubgroups[g]);
            setGeometry(g);
        }} geometry={geometryName}/>
      </div>
      <div className="SelectorGroup">
      <div className="SelectorComponent__outer">
        {subgroupKeyNames.map((keyName, i) => {
          const { displayName } = availableIsoClasses[keyName];
          return (
            <button className={keyName==subgroupName ? "selected" : null} onClick={() => {
  
              resetMonoid();
              setConjugacyClassIndex(0);
              setIndexInClass(0);
              setIsoClass(keyName)
            }} key={`SubgroupNameSelect#${i}`}>
                <MemoizedMathJax formula={String.raw`\[${displayName}\]`}></MemoizedMathJax>
                </button>
        )})}
      </div>
      <div className="SelectorComponent__outer">
        {
          conjugacyClasses.map((conjugacyClass, i) => conjugacyClass.members.map((subgroup, j) => (
              <button onClick={() => {

                resetMonoid();

                if (i !== conjugacyClassIndex) {
                  setConjugacyClassIndex(i);
                }
                setIndexInClass(j);
              }} key={`SubgroupSelect_option#${i}_${j}`}>
                <MathJax dynamic>
                  {subgroup.name.length ? subgroup.name : `(${i}, ${j})`}
                  </MathJax>
                </button>
            )
          ))
        }
      </div>
      {/**
       * 
        <SelectorComponent name={"Subgroups"} options={availableIsoClassKeyList} selected={[subgroupName]} mode={"Value"} set={([el]) => setIsoClass(el)}/>
        <SelectorComponent name={"Conjugacy Classes"} options={conjugacyClasses.map(c => c.name)} selected={[conjugacyClassIndex]} mode={"Index"}  set={([el]) => setConjugacyClassIndex(el)} />
       */}
      </div>
    </div>
  )
};
