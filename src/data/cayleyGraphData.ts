import { Vector2 } from "three";
import { GeometryName, GroupName } from "../DefaultMeshes";
import { CayleyGraphData, CayleyGraphProps } from "../CayleyGraph";

export const cayleyGraphData: Partial<Record<GroupName, CayleyGraphData>> = {
  1: {"vertices":[new Vector2(100, 100)],"edges":[]},
  Z_2: {"vertices":[new Vector2(60, 100),new Vector2(140, 100)],"edges":[[[1,0],[0,1]]]},
  Z_3: {"vertices":[new Vector2(100, 40),new Vector2(52, 130),new Vector2(148, 130)],"edges":[[[0,1],[1,2],[2,0]]]},
  //K_4: {"vertices":[new Vector2(60, 60),new Vector2(140, 60),new Vector2(60, 140),new Vector2(140, 140)],"edges":[[[0, 1],[2, 3]],[[1,3],[2,0]]]},
  "K_4":{"vertices":[{"x":70,"y":70},{"x":70,"y":130},{"x":130,"y":70},{"x":130,"y":130}],"edges":[[[0,1],[1,0],[3,2],[2,3]],[[0,2],[2,0],[1,3],[3,1]]]},  Z_4: {"vertices":[new Vector2(60, 60),new Vector2(140, 60),new Vector2(140, 140),new Vector2(60, 140)],"edges":[[[0, 1],[1,2],[2,3],[3,0]]]},
  //S_3:{vertices:[{x:100,y:20},{x:100,y:60},{x:31,y:140},{x:100,y:20},{x:135,y:120},{x:65,y:120}],edges:[[[0,1],[1,0],[5,3],[3,5],[0,4],[4,0]],[[0,3],[3,4],[4,0],[1,0],[0,5],[5,1]]]},
  //S_3:{vertices:[{x:100,y:20},{x:31,y:140},{x:100,y:50},{x:169,y:140},{x:57,y:125},{x:143,y:125}],edges:[]},
  //S_3:{vertices:[{x:100,y:20},{x:31,y:140},{x:100,y:50},{x:57,y:125},{x:169,y:140},{x:143,y:125}],edges:[[[0,1],[1,4],[4,0],[2,5],[5,3],[3,2]],[[0,2],[2,0],[3,1],[1,3],[5,4],[4,5]]]},
  //S_3:{vertices:[{x:100,y:20},{x:31,y:140},{x:100,y:50},{x:57,y:125},{x:169,y:140},{x:143,y:125}],edges:[]},
  //"S_3":{vertices:[{x:100,y:20},{x:100,y:50},{x:169,y:140},{x:143,y:125},{x:31,y:140},{x:57,y:125}],edges:[[[0,1],[1,4],[4,0],[2,5],[5,3],[3,2]],[[0,2],[2,0],[3,1],[1,3],[5,4],[4,5]]]},
  //"S_3":{vertices:[{x:65,y:120},{x:31,y:140},{x:135,y:120},{x:169,y:140},{x:100,y:60},{x:100,y:20},],edges:[[[0,1],[1,0],[4,2],[2,4],[5,3],[3,5]],[[0,2],[2,3],[3,0],[1,5],[5,4],[4,1]]]},
  //"S_3":{vertices:[{x:100,y:20},{x:31,y:140},{x:100,y:50},{x:57,y:125},{x:169,y:140},{x:143,y:125}],edges:[[[0,1],[1,4],[4,0],[2,5],[5,3],[3,2]],[[0,2],[2,0],[3,1],[1,3],[5,4],[4,5]]]},
  //S_3:{vertices:[{x:100,y:70},{x:39,y:135},{x:100,y:30},{x:74,y:115},{x:126,y:115},{x:161,y:135}],edges:[[[0,2],[2,0],[3,1],[1,3],[4,5],[5,4]],[[0,3],[3,4],[4,0],[2,5],[5,1],[1,2]]]},
  //"S_3":{"vertices":[{"x":100,"y":20},{"x":100,"y":60},{"x":30,"y":140},{"x":134,"y":120},{"x":66,"y":120},{"x":170,"y":140},{"x":170,"y":140},{"x":66,"y":120},{"x":100,"y":60},{"x":134,"y":120},{"x":100,"y":20},{"x":30,"y":140},{"x":100,"y":20},{"x":134,"y":120},{"x":66,"y":120},{"x":100,"y":60},{"x":30,"y":140},{"x":170,"y":140},{"x":170,"y":140},{"x":30,"y":140},{"x":66,"y":120},{"x":134,"y":120},{"x":100,"y":20},{"x":100,"y":60}],"edges":[[[1,0],[0,1],[2,4],[4,2],[5,3],[3,5]],[[2,1],[1,5],[5,2],[4,3],[3,0],[0,4]]]},
 // D_4: {vertices:[{x:10,y:10},{x:30,y:30},{x:90,y:10},{x:30,y:70},{x:70,y:30},{x:90,y:90},{x:10,y:90},{x:70,y:70}],edges:[[[0,1],[1,0],[3,2],[2,3],[4,7],[7,4],[5,6],[6,5]],[[0,2],[2,7],[7,5],[5,0],[1,6],[6,4],[4,3],[3,1]]]},
//  D_4:{vertices:[{x:40,y:40},{x:80,y:80},{x:160,y:40},{x:80,y:120},{x:120,y:80},{x:160,y:160},{x:40,y:160},{x:120,y:120}],edges:[[[0,1],[1,0],[2,7],[7,2],[3,4],[4,3],[6,5],[5,6]],[[0,2],[2,3],[3,6],[6,0],[1,5],[5,4],[4,7],[7,1]]]},

D_4:{vertices:[{x:40,y:40},{x:160,y:40},{x:70,y:70},{x:160,y:160},{x:130,y:70},{x:70,y:130},{x:40,y:160},{x:130,y:130}],edges:[[[0,2],[2,0],[1,4],[4,1],[3,7],[7,3],[6,5],[5,6]],[[0,1],[1,3],[3,6],[6,0],[2,5],[5,7],[7,4],[4,2]]]},
S_3:{vertices:[{x:100,y:20},{x:31,y:140},{x:100,y:60},{x:169,y:140},{x:65,y:120},{x:135,y:120}],edges:[[[0,1],[1,3],[3,0],[2,5],[5,4],[4,2]],[[0,2],[2,0],[5,3],[3,5],[4,1],[1,4]]]},
A_4:{vertices:[{x:100,y:70},{x:74,y:115},{x:100,y:40},{x:126,y:115},{x:48,y:130},{x:130,y:10},{x:152,y:130},{x:7,y:119},{x:70,y:10},{x:193,y:119},{x:163,y:171},{x:37,y:171}],edges:[[[8,2],[2,5],[5,8],[9,6],[6,10],[10,9],[11,4],[4,7],[7,11],[0,1],[1,3],[3,0]],[[0,2],[2,0],[3,6],[6,3],[1,4],[4,1],[8,7],[7,8],[5,9],[9,5],[11,10],[10,11]]]},
S_4:{vertices:[{x:80,y:80},{x:70,y:50},{x:80,y:120},{x:50,y:70},{x:130,y:50},{x:50,y:130},{x:120,y:120},{x:30,y:50},{x:120,y:80},{x:150,y:30},{x:70,y:150},{x:130,y:150},{x:50,y:30},{x:30,y:150},{x:150,y:70},{x:170,y:50},{x:50,y:170},{x:150,y:130},{x:10,y:10},{x:10,y:190},{x:190,y:10},{x:150,y:170},{x:170,y:150},{x:190,y:190}],edges:[[[0,1],[12,18],[8,14],[15,20],[6,11],[21,23],[2,5],[13,19],[18,7],[7,12],[20,9],[9,15],[14,4],[4,8],[1,3],[3,0],[5,10],[10,2],[11,17],[17,6],[23,22],[22,21],[19,16],[16,13]],[[9,12],[12,1],[1,4],[4,9],[22,15],[15,14],[14,17],[17,22],[16,21],[21,11],[11,10],[10,16],[7,13],[13,5],[5,3],[3,7],[18,20],[20,23],[23,19],[19,18],[0,2],[2,6],[6,8],[8,0]]]},

//S_4:{vertices:[{x:80,y:80},{x:70,y:50},{x:80,y:120},{x:50,y:70},{x:130,y:50},{x:50,y:130},{x:120,y:120},{x:20,y:60},{x:120,y:80},{x:140,y:20},{x:70,y:150},{x:50,y:70},{x:130,y:150},{x:120,y:80},{x:60,y:20},{x:20,y:140},{x:150,y:70},{x:80,y:80},{x:80,y:80},{x:20,y:60},{x:150,y:130},{x:70,y:150},{x:70,y:50},{x:80,y:120}],edges:[[[14,0],[0,19],[19,14],[18,22],[22,11],[11,18],[16,4],[4,13],[13,16],[12,20],[20,6],[6,12],[5,21],[21,23],[23,5],[9,0],[0,0],[0,9],[0,0],[0,0],[0,0],[0,0],[0,15],[15,0]],[[0,0],[0,0],[0,0],[0,0],[19,15],[0,0],[0,0],[9,14],[14,22],[22,4],[4,9],[13,18],[18,23],[23,6],[6,13],[16,20],[12,21],[5,11],[11,19],[15,5],[21,0],[0,12],[20,0],[0,16]]]},
//S_3:{vertices:[{x:100,y:20},{x:31,y:140},{x:100,y:60},{x:169,y:140},{x:65,y:120},{x:135,y:120}],edges:[[[0,4],[4,2],[2,0],[1,3],[3,5],[5,1]],[[0,1],[1,0],[3,2],[2,3],[5,4],[4,5]]]},
/*S_4: {"vertices":[0, 1, 2, 3].map(turn => [
    new Vector2(0, 0),              
    
                                    
                            new Vector2(60, 20),


                                new Vector2(70, 50),

                                    
            new Vector2(20, 60),
                        new Vector2(50, 70),
                                        new Vector2(80, 80)
    ].map((v) => v.clone().rotateAround(new Vector2(100, 100), turn * Math.PI / 2)))/*.map(
        (v, j) => ({
            index: turn * 6 + j,
            position: v,
        })
    ))  *
    .flat(),"edges":[[[1,0],[0,1]]]},
*/
};
