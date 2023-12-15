import { PosetDiagramComponentProps } from "../cfg/SubgroupDiagram";
import { IndexedFGM } from "../monoid/IndexedMonoid";

export type OverallData = {
    posetDiagramProps: PosetDiagramComponentProps,
    monoid: IndexedFGM,
}