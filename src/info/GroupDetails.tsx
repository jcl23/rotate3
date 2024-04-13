import react from 'react';
import { groupDetails } from '../data/groupDetails';
import { Indexed, IndexedFGM } from '../monoid/IndexedMonoid';
import { E3 } from '../Display';
import { DisplayQuaternion } from './DisplayQuaternion';
import { Controls } from '../App';

type GroupDetailsProps = {
    group: IndexedFGM<E3>;
    generators: Indexed<E3>[];
}
export const GroupDetails = function({ group, generators }: GroupDetailsProps) {
    // not verified a group atp
    const groupName = group.name;
    return (
        <>
     
        <div className="GroupDetails" style={{display: "flex", flexDirection: "column"}}>
            <div style={{flexDirection: "row", display: "flex"}}>
                <div style={{flexDirection: "column", display: "flex", marginTop: "10px"}}>
                    <h1 style={{height: "100%", fontSize: "50px"}}>{groupDetails[groupName].name}</h1>

                </div>
                <div style={{flexDirection: "column", display: "flex", marginTop: "20px"}}>
                    <h4 style={{/* reduce space between lines:*/ 
                    lineHeight: "1.2",
                    }}>{groupDetails[groupName].abstract}</h4>
                </div>
                
            </div>
            <div style={{flexDirection: "row", display: "flex"}}>

                <h4>{"Order: "  + groupDetails[groupName].order}</h4>
                <h4>{"Rank: "  + groupDetails[groupName].rank}</h4>
            </div>
            <div style={{flexDirection: "column", alignItems: "left", display: "flex"}}>
                <h4>Generators:</h4>   
                {generators.map((generator, i) => {
                    return (
                        <div style={{display: "flex", flexDirection: "row"}}>
                            <h2 key={`generator_${i}`} style={{marginLeft: "10px"}}>{generator.name}=</h2>
                            <DisplayQuaternion quaternion={generator.value.rotation} mode={"quaternion"}/>
                        </div>
                    )
                
                })}
            </div>
            
        </div>
        </>
    )
}