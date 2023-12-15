import { cameraPositionKeys } from "./cfg/camera-positions";

export type CameraControlsProps = {
    setCameraType: React.Dispatch<React.SetStateAction<any>>;
}

export const CameraControls = function ({ setCameraType }: CameraControlsProps) {
    return (
        <div>
                {cameraPositionKeys.map((_cameraType, i) => {
                    if (setCameraType === undefined) {
                        return  <span key={`ControlBlock_cameraspan#${i}`}>
                        <button disabled={true}>
                        {_cameraType}
                        </button>
                    </span>
                    } else {

                        return (
                            <span key={`ControlBlock_cameraspan#${i}`}>
                        <button
                        onClick={() => {
                            setCameraType(_cameraType);
                            console.log("call!", _cameraType);
                        }}
                        >
                        {_cameraType}
                        </button>
                    </span>
                    );
                }
                })}
            </div>
    );
            }