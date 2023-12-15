import { useMemo } from "react";

type SelectorPropsPoly<T> = {
  optionsObject: {
    [key: string]: T;
  };
  setState: React.Dispatch<React.SetStateAction<T>>;
  mode: "SetWithKey" | "SetWithValue";
};


type SelectorProps = SelectorPropsPoly<any>;

export type MainSelectorProps = {};

export const MainSelector = function ({
  optionsObject,
  setState,
  mode = "SetWithKey"
}: SelectorProps) {

  const options = useMemo(() => {
    return Object.entries(optionsObject).map(([key, value]) => {
      return { key, value };
    });
  }, [optionsObject]);

  const shouldSetWithKey = mode === "SetWithKey";
  return (
    <div className="MainSelector_outer">
      <div className="MainSelector_inner">
        {options.map(({ key, value }, i) => (
          <button
            type="button"
            className="MainSelector_button"
            key={`MainSelector_button#${key}_${i}`}
            onClick={() => {
                setState(shouldSetWithKey ? key : value);
            }}
          >
            {key.toString()}
          </button>
        ))}
      </div>
    </div>
  );
};
