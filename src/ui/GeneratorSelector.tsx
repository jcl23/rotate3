import { monoidToOrderRecord } from "../logic/cayleyLogic";
import { Indexed, IndexedFGM } from "../monoid/IndexedMonoid";

type GeneratorSelectorProps<T> = {
    monoid: IndexedFGM<T>,
    setIndex: (index: number) => void,
    index: number,
    values: Indexed<T>[],
    order?: number,
};

export const GeneratorSelector = function <T>({ monoid, setIndex, index, values, order = 0}: GeneratorSelectorProps<T>) {
    // A selector as a dropdown list, for the elements whos order is 'order'.
    const possibleElements = monoidToOrderRecord(monoid)[order];
    
    return (
        <select value={values.findIndex(({ index: _index}) => index == _index)?.index} onChange={(e) => setIndex(values[parseInt(e.target.value)].index)}>
            {values.map((element, i) => (
                <option key={`GeneratorSelector_option#${i}`} value={i}>{element.index}</option>
            ))}
        </select>
    )
}