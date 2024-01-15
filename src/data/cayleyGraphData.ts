import { Vector2 } from "three";
import { GeometryName, GroupName } from "../DefaultMeshes";
import { CayleyGraphData, CayleyGraphProps } from "../CayleyGraph";

export const cayleyGraphData: Partial<Record<GroupName, CayleyGraphData>> = {
  Z_2: {"vertices":[new Vector2(30, 50),new Vector2(70, 50)],"edges":[[[1,0],[0,1]]]},
  S_4: {"vertices":[0, 1, 2, 3].map(turn => [
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
    ))  */  
    .flat(),"edges":[[[1,0],[0,1]]]},
    1: {"vertices":[new Vector2(100, 100)],"edges":[]},
};
