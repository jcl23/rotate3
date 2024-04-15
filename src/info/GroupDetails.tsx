import { groupDetails } from '../data/groupDetails';
import { Indexed, IndexedFGM } from '../monoid/IndexedMonoid';
import { E3 } from '../Display';
import { DisplayQuaternion } from './DisplayQuaternion';
import { MemoizedMathJax } from '../ui/MemoizedMathJax';
import { SectionTitle } from './SectionTitle';

type GroupDetailsProps = {
    group: IndexedFGM<E3>;
    generators: Indexed<E3>[];
}
export const GroupDetails = function ({ group, generators }: GroupDetailsProps) {
    // not verified a group atp
    const groupName = group.name;
    return (
        <>
            <div style={{height: "50px"}} />
            <SectionTitle title="Group Info" />
            <div className="GroupDetails" style={{ display: "flex", flexDirection: "column", width: "350px" }}>
                <div style={{ flexDirection: "row", display: "flex" }}>
                    <div style={{ flexDirection: "column", display: "flex", marginTop: "10px" }}>
                        <h1 style={{ height: "100%", fontSize: "50px", marginTop: "20px" }}>
                            <MemoizedMathJax formula={`${groupDetails[groupName].name}`} />
                        </h1>

                    </div>
                    <div style={{ flexDirection: "column", display: "flex", marginTop: "20px" }}>
                        <h4 style={{/* reduce space between lines:*/
                            lineHeight: "1.2",
                            textAlign: "left",
                        }}>{groupDetails[groupName].abstract}</h4>
                        <div style={{ flexDirection: "row", display: "flex" }}>
                            <h4>{"Order: " + groupDetails[groupName].order}</h4>
                            <h4>{"Rank: " + groupDetails[groupName].rank}</h4>
                        </div>
                    </div>

                </div>

                <div style={{ flexDirection: "column", alignItems: "left", display: "flex", marginTop: "30px" }}>
                    <h4>Generators:</h4>
                    {generators.map((generator, i) => {
                        return (
                            <div key={`GroupDetails_div[${i}]`} style={{ display: "flex", textAlign: "left", marginBottom: "20px" }}>
                                <DisplayQuaternion style={{ fontSize: "18px" }} quaternion={generator.value.rotation} mode={"quaternion"} name={generator.name} />
                            </div>
                        )
                    })}
                </div>

            </div>
        </>
    )
}