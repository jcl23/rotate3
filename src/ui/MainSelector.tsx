import { SetStateAction, useMemo } from "react";
import { Monoid } from "../monoid/Monoid";
import { Indexed } from "../monoid/IndexedMonoid";
import { Transform } from "../Display";
import { defaultShapes, GeometryName } from "../DefaultMeshes";
import { SelectorComponent, SelectorData } from "./Selector";




type MainSelectorProps = {
    geometryData: SelectorData<GeometryName>,
    subgroupClassData: SelectorData<string>,
    subgroupChoiceData: SelectorData<string>,
}
export const MainSelector = function ({
  geometryData, subgroupClassData, subgroupChoiceData
}: MainSelectorProps) {
  return (
    <div className="MainSelector__outer">
      <SelectorComponent {...geometryData} />
      <SelectorComponent {...subgroupClassData} />
      <SelectorComponent {...subgroupChoiceData} />
    </div>
  )
};
