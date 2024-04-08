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
import { enumerateOrbits, SolidMonoids } from "./data/platonicsolids.ts";
import { CameraControls } from "./CameraControls";
import { MainSelector } from "./ui/MainSelector.tsx";
import { CameraType } from "./types/camera.ts";
import subgroupDiagramData, {
  SubgroupDiagramData,
} from "./data/subgroupDiagramData.ts";
import { SubgroupDiagramComponent } from "./ui/SubgroupDiagram.tsx";
import { CayleyGraph } from "./CayleyGraph.tsx";
import subgroupsData, {
  ConjugacyClass,
  IsomorphismClass,
  OuterGroupName,
  SubgroupData,
  SubgroupName,
} from "./data/subgroupData";

import { SubgroupChoice } from "./ui/SubgroupChoice.tsx";

import { useControls } from "leva";
import { labelMonoid, makeEmbeddedSubmonoid } from "./monoid/makeMonoid.ts";
import { GeometryName, GroupName } from "./DefaultMeshes.tsx";
import { CayleyGraphEditor } from "./ui/CayleyGraphEditor.tsx";

import { cayleyGraphData, getCayleyGraphData } from "./data/cayleyGraphData.ts";

import { CayleyPanel } from "./ui/CayleyPanel.tsx";
import useIndexState from "./hooks/useIndexedState.ts";
import { Partial } from "@react-spring/web";
import { sub } from "three/examples/jsm/nodes/Nodes.js";
import { Header } from "./info/Header.tsx";
import { findInverse } from "./group/invert.ts";
import { MonoidInput } from "./ui/MonoidInput.tsx";
import useMonoidState from "./hooks/useMonoidState.ts";
import { MathJaxContext } from "better-react-mathjax";
import { DisplayQuaternion } from "./info/DisplayQuaternion.tsx";
export const Controls = {};
type QuaternionDisplayMode = "orthogonal" | "matrix" | "euler" | "axis-angle";
const mathJaxConfig = {
  fastPreview: true,
  CommonHTML: { linebreaks: { automatic: true } },
           showMathMenu: false,
           'HTML-CSS': {
               linebreaks: { automatic: true, width: 'container' },
               scale: 150
           }
};
// subgroupData = (subgroupData as SubgroupData);
function App() {
  const [showCGEditor, setShowCGEditor] = useState(false);
  // const [cameraType, setCameraType] = useState<CameraType>("front-facing");

  // The app controls
  const controlVals = useControls({
    useAllValues: false,
    showSubgroupIndices: false,
    reindexForSubgroup: false,
    showCayleyGraph: true,
    strictIndices: false,
    labelWithInverses: false,
    cameraType: {
      options: ["perspective", "orthographic" ],
    },
    quaternionDisplayMode: {
      options: [ "matrix", "orthogonal", "euler", "axis-angle", "quaternion"]
    }
  });
  Controls.controlVals = controlVals;
  // const { geomName }  = controlVals;
  // geomName: {
  //   options:  [ "Cube", "Icosahedron", "Dodecahedron", "Tetrahedron", "Octahedron"] ,
  // },

  // Cube | Icosahedron | Dodecahedron | Tetrahedron | Octahedron

  const geomNameList = Object.keys(SolidMonoids) as GeometryName[];
  const [geomName, setGeomName] = useState(geomNameList[0]);

  const currentMonoid = SolidMonoids[geomName];
  const groupName = currentMonoid.name as OuterGroupName;

  // Which isomorphism class of subgroups to show (now safely)
  const subgroupIsoClasses: IsomorphismClass[] = Object.values(
    subgroupsData[groupName]
  );
  const subgroupNames = Object.keys(
    subgroupsData[groupName]
  ) as SubgroupName<OuterGroupName>[];
  const [subgroupName, selectSubgroupName] = useState<GroupName>(
    subgroupNames[0]
  );
  const subgroupIsoClass: IsomorphismClass =
  subgroupsData[groupName][subgroupName];
  const allConjugacyClasses: ConjugacyClass[] = [];
  const subgroupDiagramOnClick: Function[] = [];

  Object.entries(
    subgroupsData[groupName]
  ).forEach(([groupName, data]) => {
      data.conjugacyClasses.forEach((cjClass, cjClassIndex) => {
         allConjugacyClasses.push(cjClass);
         subgroupDiagramOnClick.push(function() {
            selectSubgroupName(groupName);
            setConjugacyClassIndex(cjClass.flatIndex);
         });
      });
  });
  console.log({allConjugacyClasses});
  const availableConjugacyClasses: ConjugacyClass[] =
    subgroupIsoClass.conjugacyClasses;
  const [conjugacyClassIndex, setConjugacyClassIndex] = useIndexState(
   availableConjugacyClasses
  );

  const conjugacyClass = availableConjugacyClasses[
      conjugacyClassIndex
    ];
  const indexInSubgroupDiagram = conjugacyClass.flatIndex;
  console.log({flatIndex: conjugacyClass.flatIndex, conjugacyClassIndex})
  const [indexWithinConjugacyClass, setIndexWithinConjugacyClass] = useIndexState(conjugacyClass.members);
  const subgroupData = conjugacyClass.members[indexWithinConjugacyClass];

  const subgroup = makeEmbeddedSubmonoid(
    currentMonoid,
    subgroupData.generators.map((i) => currentMonoid.elements[i]),
    conjugacyClass.name
  );
  const elementNames = ["g", "h", "k", "l", "m"];
  const namedGenerators = subgroupData.generators.map((i, j) => ({name: elementNames[j], el: currentMonoid.elements[i]}));
  const inverses = namedGenerators.map(({name, el}) => ({name: name + "^{-1}", el: findInverse(currentMonoid, el)})); 
  let labeledSubgroup;
  console.log({currentMonoid})
  if (controlVals.labelWithInverses)
  {
      labeledSubgroup = labelMonoid(subgroup, [...namedGenerators, ...inverses]);
   } else {
      labeledSubgroup = labelMonoid(subgroup, namedGenerators);
   }
  const labels = Object.fromEntries(labeledSubgroup.elements.map((el) => [el.index, el.name]));
  const labelList = labeledSubgroup.elements.map((el) => el.name);
  console.log("Attempted submonoid labelling", {labels});

  labeledSubgroup.elements.forEach((el) => {
      console.log(el.name, el.index);
   });
   const [{currentElement: monoidValue, currentSequence}, appendMonoidValue, resetMonoid] = useMonoidState(labeledSubgroup);
  // bconst currentGroupName = subgroup.name;

  const currentSubgroupDiagramData: SubgroupDiagramData =
    subgroupDiagramData[currentMonoid.name];
  currentSubgroupDiagramData.labels = allConjugacyClasses.map((c) => c.name);
  if (monoidValue.index > currentMonoid.elements.length) {
    resetMonoid();
  }

  useLayoutEffect(() => {
    // When the geometry changes, reset the subgroup class and choice indices, and the monoid value
    setConjugacyClassIndex(0);
    resetMonoid();
    enumerateOrbits(currentMonoid);
  }, [geomName]);
  
  console.log("subgroupName: ", subgroupName);

  const data = getCayleyGraphData(subgroupName, labelList)
  const vertices = data ? data?.vertices : [];
  const edges = data ? data?.edges : [];

  const generators = labeledSubgroup.generators;

  // const projection = projectMonoid(currentMonoid, generators.map(i => currentMonoid.elements[i]), subgroup);
  //const submonoid = makeSubmonoid(currentMonoid, generators);
  //console.log({submonoid})
  //const projectionMap: Record<number, number> = { 0: 0 }; // of the group onto the subgroup
  // const subgroupOwnGeneratorIndices = subgroupClass.generators;

  //const projection = (i: number) => projectionMap[i] ?? 0;

  // const submonoid = makeSubmonoid(currentMonoid, subgroupGenerators);
  // console.log("Submonoid:", submonoid);
  /* Main app navigation */

  /* Navigation */
  /*
         <CayleyGraph monoid={currentMonoid} graphVertices={DefaultVertices.box} graphEdges={makeEdges(currentMonoid)}/>     
   */
  const setClassAndResetChoice = function (classIndex: number) {
    setConjugacyClassIndex(classIndex);
    setIndexWithinConjugacyClass(0);
    resetMonoid();
  };

  const transformations = labeledSubgroup.elements.filter(({ index }) => index != 0);
  const elementsToDisplay = controlVals.useAllValues
    ? transformations
    : generators;

  const elements = labeledSubgroup.elements;
  const project = function (obj: Indexed<any>) {
    // return obj.index;
    return elements.findIndex(({ index }) => index == obj.index);
  };
  return (
    <MathJaxContext config={mathJaxConfig}>

    <div
      className="App net1"
      style={{ overflow: showCGEditor ? "hidden" : "inherit" }}
      >
    

      <Header />
      <CayleyGraphEditor
              show={showCGEditor}
              hide={() => setShowCGEditor(false)}
              />
      
   
      <div style={{ width: "33%", display: "none" }}>
              
                  <div>
                  <CayleyPanel group={currentMonoid} />
                  </div>
               
            </div>

      <div className="MainContent">
        {!showCGEditor && (
          <MainSelector
          className="LeftPanel"
          resetMonoid={resetMonoid}
          setGeometry={setGeomName}
          geometryName={geomName}
          setIsoClass={selectSubgroupName}
          subgroupName={subgroupName}
          setConjugacyClassIndex={setConjugacyClassIndex}
          conjugacyClassIndex={conjugacyClassIndex}
          setIndexInClass={setIndexWithinConjugacyClass}
          indexInClass={indexWithinConjugacyClass}
          />
          )}
        <div className={"MiddlePanel"} style={{ display: "flex", flexDirection:"column"  }}> 
        <div >
            <ShapeDisplay
            shape={geomName}
            cameraType={controlVals.cameraType}
            transform={monoidValue}
            stepIndex={0}
            availableTransformations={elementsToDisplay}
            generators={generators}
            />
           
      
        
          {controlVals.showCayleyGraph && (
            <CayleyGraph
            vertices={vertices}
            edges={edges}
            currentIndex={(function () {
              let projectedIndex = project(monoidValue);
              return projectedIndex;
            })()}
            />
            )}
  

          </div>
          <button onClick={() => setShowCGEditor(true)}>
              Cayley Graph Editor
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("cayleygraph");
              }}
              >
              Reset Cayley
            </button>
            

            {/* <FGIMonoidDisplay<E3>
              shape={geomName}
              monoid={currentMonoid}
              availableTransformations={transformations}
              generators={generators}
              updateHash={""}
              monoidValue={monoidValue}
              setMonoidValue={setMonoidValue}
            /> 
            */}
            
            <MonoidInput 
            labels={labels}
            append={appendMonoidValue} reset={resetMonoid} monoidValue={monoidValue} currentSequence={currentSequence} generators={controlVals.useAllValues ? labeledSubgroup.elements : labeledSubgroup.generators}              
             
             />

        </div>
        <div className={"RightPanel"} style={{ display: "flex", justifyContent: "space-around", width: "40%" }}>
            <div style={{  }}>
              <div className="SubgroupDiagram__holder">
                <SubgroupDiagramComponent
                  size={10}
                  poset={currentSubgroupDiagramData.poset}
                  positions={currentSubgroupDiagramData.positions}
                  active={indexInSubgroupDiagram}
                  setActive={i => subgroupDiagramOnClick[i]()}
                  labels={currentSubgroupDiagramData.labels.map((_, index) =>
                    controlVals.showSubgroupIndices
                    ? "" + index
                    : allConjugacyClasses[index].displayName
                    )}
                    />
                <SubgroupChoice
                  choiceIndex={indexWithinConjugacyClass}
                  setChoiceIndex={setIndexWithinConjugacyClass}
                  choices={conjugacyClass.members}
                  />
              </div>

              <div
                className="GroupInfo__holder"
                style={{ marginTop: "auto", height: "10vh " }}
                >
                <h1>{subgroupName}</h1>
                <p style={{ justifyContent: "space-around", display: "flex" }}>
                  <span style={{ flexGrow: 2 }}>Order:</span>
                  <span style={{ flexGrow: 1 }}>
                    {currentMonoid.elements.length}
                  </span>
                </p>
              </div>
              <div>
                
              </div>
            </div>
            
          </div>
      </div>
        </div>

    </MathJaxContext>
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
