import { Vector2 } from "@react-three/fiber";
import { Indexed, IndexedFGM } from "../monoid/IndexedMonoid";
import { CayleyGraphData, CayleyGraphEdges, CayleyGraphVertex } from "../CayleyGraph";
const data: CayleyGraphData[] = [

]

// a function that takes graphdata,and a mapping from the generator indices to the new indices, and returns a new graphdata with the vertices and edges reindexed.
const reindexCayleyData = function(data: CayleyGraphData, indexMap: number[], group: IndexedFGM<number[]>): CayleyGraphData {
    const vertices = indexMap.map((index) => data.vertices[index]);
    const edges = data.edges.map((list) => list.map(([from, to]): [number,number] => [indexMap.indexOf(from), indexMap.indexOf(to)]));
    return { vertices, edges };
}
const validateCayleyGraph = function(vertices: CayleyGraphVertex[], edges: [number, number][][]): boolean {
        if (edges.length == 0) return (vertices.length == 1);
        // check that each generator-edge-list has as many elements as there are vertices total.
        const numVertices = vertices.length;
        const numEdges = edges.flat().length;
        const numEdgesPerGenerator = edges.map(list => list.length);
        if (numEdgesPerGenerator.some(num => num != numVertices)) {
            return false;
        }
        for (let i = 0; i < numVertices; i++) {
            // check that each vertex has an edge going in and out for each generator.
            const edgesIn = edges.map(list => list.filter(([from, to]) => to == i));
            const edgesOut = edges.map(list => list.filter(([from, to]) => from == i));
            if (
                edgesIn.some(list => list.length != 1) || edgesOut.some(list => list.length != 1)
            ) {
                return false;
            }
        }
        return true;
    }
const simplifyCayleyData = function({ vertices, edges }: CayleyGraphData): CayleyGraphData {
    vertices = vertices.slice(0);
    edges = edges.slice(0);
    
    for (let i = 0; i < vertices.length; i++) {
        let {x, y} = vertices[i];
        x = Math.round(x);
        y = Math.round(y);
        vertices[i] = { x, y };
    }
        
    let infoToReturn: CayleyGraphData = {
        vertices, edges
    };
    return infoToReturn;
}
const determineGeneratorOrder = function(edges: [number, number][]): number {
    // start at 0:0, and follow the edges until we get back to 0:0.
    const edgeFrom = (i: number) => edges.find((edge: [number, number]) => edge[0] == i);
    let i = 0;
    let currentVertex = 0;
    while (i <= edges.length && i < 20) {
        i++;
        const [_, to] = edgeFrom(currentVertex) ?? [0, 0];
        console.log(`$[i]: ${currentVertex} -> ${to}]`)
        currentVertex = to;
        if (currentVertex == 0) break;
    }
    return i;
}

const getElementOrder = function<T>(monoid: IndexedFGM<T>, element: Indexed<T>): number {
    
    if (monoid == undefined || element == undefined) {
        throw new Error("Undefined monoid or element");
    }
    if (element.index == monoid.identity.index) return 0;
    let current = element;
    let order = 1;
    while (current.index != monoid.identity.index) {
        current = monoid.multiply(current, element);
        order++;
        if (order > 1000) {
            throw new Error("Order too high")
            break;
        }
    }
    return order;
}

const monoidToOrderRecord = function<T>(m: IndexedFGM<T>): Record<number, Indexed<T>[]> {
    const orders = m.elements.map((el) => getElementOrder(m, el));
    const maxOrder = Math.max(...orders);
    const orderRecord: Record<number, Indexed<T>[]> = {};
    for (let i = 0; i <= maxOrder; i++) {
        orderRecord[i] = m.elements.filter((el) => getElementOrder(m, el) == i);
    }
    return orderRecord;
}





export { validateCayleyGraph, determineGeneratorOrder, getElementOrder,  monoidToOrderRecord, reindexCayleyData, simplifyCayleyData };