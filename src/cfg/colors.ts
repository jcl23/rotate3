import { Color } from "three";


export const VERTEX_INACTIVE = "#444444";
export const VERTEX_ACTIVE = "#FFFFFF";

export const GRID_BACKGROUND = "#888888"
export const GEN_COLORS: string[] = ["#3BBED5","#E09891","#cb769e","#FFFFFF","#FFFFFF","#FFFFFF",];
// GEN_COLORS.forEach((color, index) => color.setHSL(color.lerp(Color.tr, index / GEN_COLORS.length).getHSL(color)));
export const PTR_COLOR = new Color(0xFFFFFF);

export const defaultColors = {
    Cube: "#ff0000",
    Icosahedron: "#d91ca6",
    Tetrahedron: "#66ff22", 
    Octahedron: "#1c3fd9",
    Dodecahedron: "#02b4f5"
}

export const secondaryColors = {
    Cube: "blue",
    Icosahedron: "#ff0022",
    Tetrahedron: "#ebd621", 
    Octahedron: "#30d9ff",
    Dodecahedron: "#02d9a0"
}