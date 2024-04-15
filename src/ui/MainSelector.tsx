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
import { AppState } from "../App";
import { SectionTitle } from "../info/SectionTitle";






export type MainSelectorProps = {
  setAppState: Dispatch<SetStateAction<AppState>>;
  appState: AppState;
  resetMonoid: () => void;
}
export const MainSelector = function ({
  setAppState,
  appState,
  resetMonoid,
  ...props
}: MainSelectorProps) {

  const { geomName, subgroupName, conjugacyClassIndex, indexInClass } = appState;
  const allShapeNames = ["Cube", "Icosahedron", "Tetrahedron", "Octahedron", "Dodecahedron"]
  // const [geometryName, setGeometryName] = useState<GeometryName>("Tetrahedron");
  const outerGroup = SolidMonoids[geomName];

  const availableIsoClasses: Partial<Record<SubgroupName<OuterGroupName>, IsomorphismClass>> = (subgroupsData as SubgroupRecord)[geomName];
  const subgroupKeyNames = Object.keys(availableIsoClasses) as SubgroupName<OuterGroupName>[];
  //const [selectedIsoClassIndex, setIsoClass] = useIndexState(availableIsoClassKeyList);
  const availableSubgroups: IsomorphismClass = availableIsoClasses[subgroupName];
  // const [selectedSubgroupIndex, setSubgroup] = useIndexState(availableSubgroups.conjugacyClasses);
  const conjugacyClasses = availableSubgroups.conjugacyClasses;

  type x = SubgroupData
  // setGeometry(allShapeNames.indexOf(geometryName));
  let className = "SelectorPanel LeftPanel";
  if ("className" in props) {
    className += " " + props.className;
  }
  const defaultSubgroupName = defaultSubgroups[geomName];
  const defaultSubgroup = subgroupsData[geomName][defaultSubgroupName];
  return (
    <div className={className}>
      <SectionTitle title="Geometry" />
      <div className="SelectorGroup">
        <GeometrySelector setGeometry={function (givenGeomName) {
          resetMonoid();
          setAppState({
            ...appState,
            geomName: givenGeomName,
            subgroupName: "1",
            conjugacyClassIndex: 0,
            indexInClass: 0,
          });
        }} geometry={geomName} />
      </div>
      <SectionTitle title="Subgroup Class" />

      <div className="SelectorGroup">
        <div className="SelectorComponent__outer">
          {subgroupKeyNames.map(function (keyName, i) {
            const { displayName } = availableIsoClasses[keyName];
            return (
              <button className={keyName == subgroupName ? "selected" : undefined} onClick={() => {
                resetMonoid();
                setAppState({
                  ...appState,
                  subgroupName: keyName,
                  conjugacyClassIndex: 0,
                  indexInClass: 0,
                })
              }} key={`SubgroupNameSelect#${i}_${displayName}`}>
                <MemoizedMathJax formula={String.raw`\[${displayName}\]`}></MemoizedMathJax>
              </button>
            )
          })}
        </div>
        <SectionTitle title="Subgroup Instance" />

        <div className="SelectorComponent__outer">
          {
            conjugacyClasses.map((conjugacyClass, i, arr) => conjugacyClass.members.map((subgroup, j) => {
              const name = arr.length <= 1 ? j + 1 : j + 1 + "ABC"[i];
              const isSelected = i == conjugacyClassIndex && j == indexInClass;
              return (
                <button className={isSelected ? "selected" : undefined}
                  onClick={() => {
                    resetMonoid();
                    setAppState({
                      ...appState,
                      conjugacyClassIndex: i,
                      indexInClass: j,
                    })
                  }} key={`SubgroupSelect_option#${i}_${j}`}>
                  <MathJax dynamic>
                    {subgroup.name.length ? subgroup.name : name}
                  </MathJax>
                </button>
              )
            }))
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
