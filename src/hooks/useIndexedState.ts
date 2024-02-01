import { useState } from 'react';
import { STRICT_INDICES } from '../cfg/consts';
type IndexHookPair = [number, (index: number) => void];
const useIndexState = <T>(reference: T[]): IndexHookPair => {
    //  This is because im frusterated by how it keeps not loading cause i forget subgroup data
    if (reference === undefined){
        debugger;
        throw new Error('Reference array is undefined');
    }
    
  const [index, setIndex] = useState(0);

  const setIndexStateSafely = (index) => {
    try {
        if (typeof index !== 'number') throw new Error(`Index ${index} is not a number`);
        if (index < 0) throw new Error(`Index ${index} is negative`);
        if (index >= reference.length) throw new Error(`Index ${index} is out of bounds for reference array of length ${reference.length}`);
    } catch (e) {
        if (STRICT_INDICES) {
            throw e;
        } else {
            // warn and set to a default
            console.warn(e);
            index = 0;
        }
    }
    setIndex(index);
  };

  // Return the state and custom setter
  return [index, setIndexStateSafely];
};

export default useIndexState;