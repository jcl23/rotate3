import {
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import "./App.css";
import { ShapeDisplay } from "./ShapeDisplay";
import { FGIMonoidDisplay } from "./monoid/MonoidDisplay.tsx";
import { E3 } from "./Display";
import { Indexed, IndexedFGM, indexMonoid } from "./monoid/IndexedMonoid";
import { SolidMonoids } from "./exampleData/platonicsolids.ts";
import { CameraControls } from "./CameraControls";
import { MainSelector } from "./ui/MainSelector.tsx";
import { CameraType } from "./types/camera.ts";
import subgroupDiagramData from "./data/subgroupDiagramData.ts";
import { SubgroupDiagramComponent } from "./cfg/SubgroupDiagram.tsx";
import { CayleyGraph } from "./CayleyGraph.tsx";

import subgroupData, { Subgroup } from "./data/subgroupData";
import { MathComponent } from "mathjax-react";
import { SubgroupChoice } from "./ui/SubgroupChoice.tsx";

import { useControls } from "leva";
import { makeSubmonoid } from "./monoid/makeMonoid.ts";
import { GeometryName } from "./DefaultMeshes.tsx";
import { CayleyGraphEditor } from "./ui/CayleyGraphEditor.tsx";
import { makeEdges } from "./Edges.ts";
import { cayleyGraphData } from "./data/cayleyGraphData.ts";

function App() {
  const [showCGEditor, setShowCGEditor] = useState(false);
  const [cameraType, setCameraType] = useState<CameraType>("front-facing");

  // The app controls
  const controlVals = useControls({
    useAllValues: false,
    showSubgroupIndices: false,
    reindexForSubgroup: false,
  });
  // const { geomName }  = controlVals;
  // geomName: {
  //   options:  [ "Cube", "Icosahedron", "Dodecahedron", "Tetrahedron", "Octahedron"] ,
  // },

  // Cube | Icosahedron | Dodecahedron | Tetrahedron | Octahedron
  const [geomName, setGeomName] = useState<GeometryName>("Cube");

  // Which isomorphism class of subgroups to show
  const [subgroupClassIndex, setSubgroupClassIndex] = useState(0);
  // which conjugacy class of subgroups to show
  const [subgroupChoiceIndex, setSubgroupChoiceIndex] = useState(0);

  
  const currentMonoid = SolidMonoids[geomName];
  const [monoidValue, setMonoidValue] = useState(currentMonoid.identity);
  const currentSubgroupDiagramData = subgroupDiagramData[geomName];



  useLayoutEffect(() => {
    console.log("[App - useLayoutEffect] geomName: ", geomName);
    // setCurrentMonoid(SolidMonoids[geomName]);
    setSubgroupClassIndex(0);
    setSubgroupChoiceIndex(0);
    setMonoidValue(currentMonoid.identity);
  }, [geomName]);

  useLayoutEffect(() => {
  // reset the monoid if the current value isn't in the new monoid
    if (!currentMonoid.values.includes(monoidValue)) {
      setMonoidValue(currentMonoid.identity);
    }
  }, [subgroupClassIndex, subgroupChoiceIndex]);

  const subgroupClass = subgroupData[geomName]?.[subgroupClassIndex];
  if (subgroupClass == undefined)
    throw new Error(
      `subgroupClass = subgroupData[${geomName}]?.[${subgroupClassIndex}] is undefined for ${geomName} at index ${subgroupClassIndex}`
    );
    if (subgroupClass?.members?.[subgroupChoiceIndex] == undefined) {
      throw new Error(
        `subgroupData[${geomName}][${subgroupClassIndex}].members[${subgroupChoiceIndex}] is undefined`
      );
    }
  if (subgroupClass.members[subgroupChoiceIndex]?.generators == undefined)
    throw new Error(
      `subgroupClass[${subgroupChoiceIndex}].generators is undefined for ${geomName} at index ${subgroupClassIndex}`
    );

  if (subgroupClass.generators == undefined)
    throw new Error(
      `subgroupClass.generators is undefined for ${geomName} at index ${subgroupClassIndex}`
    );

  const subgroupName = subgroupClass.name;
  console.log("subgroupName: ", subgroupName)
  const { vertices, edges } = cayleyGraphData[subgroupName];
  const generators = subgroupClass.members[subgroupChoiceIndex].generators.map(
    (ind) => currentMonoid.values[ind]
  );

  const subgroupMonoid = makeSubmonoid(currentMonoid, generators);
  /* Main app navigation */

  /* Navigation */
  /*
        <CayleyGraph monoid={currentMonoid} graphVertices={DefaultVertices.box} graphEdges={makeEdges(currentMonoid)}/>     
  */
  const setClassAndResetChoice = function (classIndex: number) {
    setSubgroupClassIndex(classIndex);
    setSubgroupChoiceIndex(0);
  };
  return (
    <div
      className="App"
      style={{ overflow: showCGEditor ? "hidden" : "inherit" }}
    >
      <div
        style={{
          width: "calc(max(50vw, 600px))",
          height: "45vh",
          display: "flex",
          margin: "0 auto",
          marginTop: "50px",
        }}
      >
        <div style={{ width: "50%" }}>
          <button onClick={() => setShowCGEditor(true)}>
            Cayley Graph Editor
          </button>
          <CayleyGraphEditor
            show={showCGEditor}
            hide={() => setShowCGEditor(false)}
          />
          <MainSelector
            geometryData={{
              name: "Geometry",
              options: [
                "Cube",
                "Icosahedron",
                "Dodecahedron",
                "Tetrahedron",
                "Octahedron",
              ],
              selected: [geomName],
              set: (vals) => setGeomName(vals[0]),
              mode: "PickOne",
            }}
            subgroupClassData={{
              name: "Subgroup",
              options: subgroupClass.members.map((val: Subgroup) => val.name),
              selected: [],
              set: function (value: SetStateAction<string[]>): void {
                throw new Error("Function not implemented.");
              },
              mode: "PickOne",
            }}
            subgroupChoiceData={{
              name: "Conjgacy Class",
              options: [],
              selected: [],
              set: function (value: SetStateAction<string[]>): void {
                throw new Error("Function not implemented.");
              },
              mode: "PickOne",
            }}
          />
          <FGIMonoidDisplay<E3>
            shape={geomName}
            monoid={currentMonoid}
            generators={
              controlVals.useAllValues ? currentMonoid.values : generators
            } /* determined by the point in the subgroup diagram*/
            updateHash={""}
            subgroup={subgroupChoiceIndex + "," + subgroupClassIndex}
            monoidValue={monoidValue}
            setMonoidValue={setMonoidValue}
          />

          <ShapeDisplay
            shape={geomName}
            cameraType={cameraType}
            transform={monoidValue}
            stepIndex={0}
          />
          <CameraControls setCameraType={setCameraType} />

          
        </div>
        <div style={{ width: "50%" }}>
          <div className="SubgroupDiagram__holder">
            <SubgroupDiagramComponent
              size={10}
              poset={currentSubgroupDiagramData.poset}
              positions={currentSubgroupDiagramData.positions}
              active={subgroupClassIndex}
              setActive={setClassAndResetChoice}
              labels={currentSubgroupDiagramData.labels.map((val, index) =>
                controlVals.showSubgroupIndices ? ("" + index) : val
              )}
            />
            <SubgroupChoice
              choiceIndex={subgroupChoiceIndex}
              setChoiceIndex={setSubgroupChoiceIndex}
              choices={subgroupData[geomName][subgroupClassIndex].members}
            />
          </div>

          <div
            className="GroupInfo__holder"
            style={{ marginTop: "auto", height: "10vh " }}
          >
            <h1>{currentMonoid.name}</h1>
            <p style={{ justifyContent: "space-around", display: "flex" }}>
              <span style={{ flexGrow: 2 }}>Order:</span>
              <span style={{ flexGrow: 1 }}>{currentMonoid.values.length}</span>
            </p>
          </div>
        <CayleyGraph
            vertices={vertices}
            edges={edges}
            transform={monoidValue}
          />
        </div>
      </div>
    </div>
  );
  return (
    <div>
      <div className="App_header">
        <button>Menu</button>
      </div>

      <div></div>
    </div>
  );
}

export default App;
