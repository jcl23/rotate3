import { PosetDiagramComponentProps } from "../ui/SubgroupDiagram";
import { IndexedFGM } from "../monoid/IndexedMonoid";

export type OverallData = {
    posetDiagramProps: PosetDiagramComponentProps,
    monoid: IndexedFGM,
}