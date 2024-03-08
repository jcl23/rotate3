import { SetStateAction, useMemo, useState } from "react";
import { Monoid } from "../monoid/Monoid";
import { Indexed } from "../monoid/IndexedMonoid";
import { Transform } from "../Display";
import { defaultShapes, GeometryName } from "../DefaultMeshes";
import { SelectorComponent, SelectorData } from "./Selector";
import { GeometrySelector } from "./GeometrySelector";
import { SolidMonoids } from "../data/platonicsolids";
import groupData from "../data/groupData";
import subgroupsData from "../data/subgroupData";
import useIndexState from "../hooks/useIndexedState";




type MainSelectorProps = {
    geometryData: SelectorData<GeometryName>,
    setGeometry: (n: number) => void,
    setMonoid: (monoid: Monoid<any>) => void,

}
export const MainSelector = function ({
  setGeometry,   setMonoid
}: MainSelectorProps) {
  const allShapeNames = ["Cube",  "Icosahedron","Tetrahedron", "Octahedron",  "Dodecahedron"]
  const [geometryName, setGeometryName] = useState<GeometryName>("Tetrahedron");
  const outerGroup = SolidMonoids[geometryName];
  const availableIsoClass = subgroupsData[outerGroup.name];
  const availableIsoClassKeyList = Object.keys(availableIsoClass);
  const [selectedIsoClassIndex, setIsoClass] = useIndexState(availableIsoClassKeyList);
  const availableSubgroups = availableIsoClass[availableIsoClassKeyList[selectedIsoClassIndex]];
  const [selectedSubgroupIndex, setSubgroup] = useIndexState(availableSubgroups.conjugacyClasses);
  const conjugacyClasses = availableSubgroups.conjugacyClasses[selectedSubgroupIndex].members;
  setGeometry(allShapeNames.indexOf(geometryName));
  return (
    <div className="SelectorPanel">
      <div className="SelectorGroup">
        <GeometrySelector setGeometry={setGeometryName} />
        <SelectorComponent name={"Subgroups"} options={availableIsoClassKeyList} selected={[selectedIsoClassIndex]} mode={"Index"} set={([el]) => setIsoClass(el)}/>
        <SelectorComponent name={"Conjugacy Classes"} options={conjugacyClasses.map(c => c.name)} selected={[selectedSubgroupIndex]} mode={"Index"}  set={([el]) => setSubgroup(el)} />
      </div>
    </div>
  )
};
