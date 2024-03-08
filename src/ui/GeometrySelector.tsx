import { Dispatch, SetStateAction } from "react";
import { GeometryName } from "../DefaultMeshes";

type GeometrySelectorProps = {
    setGeometry: Dispatch<SetStateAction<GeometryName>>;
}

export const GeometrySelector = function({ setGeometry }: GeometrySelectorProps) {
    const shapeNames = ["Tetrahedron", "Cube", "Octahedron", "Dodecahedron", "Icosahedron"];

    return (
        <div>
            {shapeNames.map(shapeName  => (
                <button key={`GeometrySelector__button[${shapeName}]`} onClick={() => setGeometry(shapeName)}>{shapeName}</button>
            ))}
        </div>
    )
}