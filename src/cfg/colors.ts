import { Color } from "three";


export const VERTEX_INACTIVE = "#444444";
export const VERTEX_ACTIVE = "#FFFFFF";

export const GRID_BACKGROUND = "#888888"
// export const edgeColors: string[] = ["#3BBED5","#E09891","#cb769e","#FFFFFF","#FFFFFF","#FFFFFF",];
// edgeColors.forEach((color, index) => color.setHSL(color.lerp(Color.tr, index / edgeColors.length).getHSL(color)));
export const PTR_COLOR = new Color(0xFFFFFF);
const color1 = new Color("0x3BBED5");
export const defaultColors = {
    Cube: "#ff4400",
    Icosahedron: "#d91ca6",
    Tetrahedron: "#66ff22", 
    Octahedron: "#5238ce",
    Dodecahedron: "#02b4f5"
}

export const defaultColorsDark = {
    Cube: "#833a20",
    Icosahedron: "#80386d",
    Tetrahedron: "#456b34", 
    Octahedron: "#2e2880",
    Dodecahedron: "#396f82"
}

export const secondaryColors = {
    Cube: "#ff0000",
    Icosahedron: "#d91ca6",
    Tetrahedron: "#66ff22", 
    Octahedron: "#1c3fd9",
    Dodecahedron: "#02b4f5"
}

export const edgeColors = [
    "#FF4040",
    // royal blue,
    "#4169E1",
    "#66ff22",
    "#1c3fd9",
    "#02b4f5"
]

export const edgeHues = [
    0,
    240,
    120,
    210,
    180
]
/*
export const secondaryColors = {
    Cube: "blue",
    Icosahedron: "#ff0022",
    Tetrahedron: "#ebd621", 
    Octahedron: "#30d9ff",
    Dodecahedron: "#02d9a0"
}*/