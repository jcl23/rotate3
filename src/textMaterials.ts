import three from "@react-three/fiber";
import THREEx from "./threex/threex.dynamictexture";
import { BoxGeometry, BufferGeometry, CanvasTexture, Float32BufferAttribute, IcosahedronGeometry, Mesh, MeshBasicMaterial, Scene, Vector3 } from "three";


function nameToRgba(name) {
    let canvas = document.createElement('canvas');
    let ctx  = canvas.getContext('2d') as CanvasRenderingContext2D  ;
    ctx.fillStyle = name;
    ctx.fillRect(0,0,1,1);
    const { data } =  ctx.getImageData(0,0,1,1);
    return { r: data[0] / 256, g: data[1] / 256, b: data[2] / 256, a: data[3] / 256 };
}

function makeNumbers(canvas){

  
    let ctx: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#000";
    ctx.font = 'bold 60px Arial';
    let step = canvas.width / 20;
    let start = step * 0.5;
    
    for (let i = 0; i < 20; i++){
        let char = String.fromCharCode(65 + i);
        ctx.fillText(char, start + step * i, 128);
    }
    
    return new CanvasTexture(canvas);
}

const makeTextMesh = (geom: BufferGeometry, color = "#ffaaaa90") => {

    const canvas: HTMLCanvasElement  = document.createElement('canvas');
    canvas.width = 4096;
    canvas.height = 256;
    const {r, g, b} = nameToRgba(color);
    let colors = [];
    let c = new Vector3();
    let uv: number[] = [];
    for(let i = 0; i < 20;i++){
        c.random().multiplyScalar(0.5).addScalar(0.5);
        colors.push(r,g,b,r,g,b,r,g,b);
    uv.push(
        (0.067 + i) / 20, 0.25, 
        (0.933 + i) / 20, 0.25, 
        (0.5 + i) / 20, 1
    );
    }
    geom.setAttribute("color", new Float32BufferAttribute(colors, 3));
    geom.setAttribute("uv", new Float32BufferAttribute(uv, 2));

    let m = new MeshBasicMaterial({transparent: true, opacity: 0.5, vertexColors: true, map: makeNumbers(canvas)});
    let o = new Mesh(geom, m);
    
    return o;
}
export default makeTextMesh;