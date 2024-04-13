import { Dispatch, SetStateAction, useState } from 'react';
import { STRICT_INDICES } from '../cfg/consts';
import { Monoid } from '../monoid/Monoid';
type MonoidRunningState<T> = {
    currentElement: T;
    currentSequence: T[];
}
type MonoidHookTriplet<T> = [MonoidRunningState<T>, Dispatch<T>, Dispatch<void>];
const useIndexState = <T>(monoid: Monoid<T>): MonoidHookTriplet<T> => {


    const [state, setState] = useState({
        currentElement: monoid.identity,
        currentSequence: [monoid.identity]
    });

    const { currentElement, currentSequence } = state;
    const reset = function () {
        setState({
            currentElement: monoid.identity,
            currentSequence: [monoid.identity]
        });
    }

    const append = function (x: T) {
        setState({
            currentElement: monoid.multiply(currentElement, x),
            currentSequence: [...currentSequence, x]
        });
    }
    // Return the state and custom setter

    return [{ currentElement, currentSequence }, append, reset];
};

export default useIndexState;