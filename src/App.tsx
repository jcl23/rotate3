import {
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import "./App.css";
import { ShapeDisplay } from "./ShapeDisplay";

import { Indexed } from "./monoid/IndexedMonoid";
import { enumeratePairs, SolidMonoids } from "./data/platonicsolids.ts";

import { MainSelector } from "./ui/MainSelector.tsx";
import subgroupDiagramData, {
  SubgroupDiagramData,
} from "./data/subgroupDiagramData.ts";
import { SubgroupDiagramComponent } from "./ui/SubgroupDiagram.tsx";
import { CayleyGraph } from "./ui/cayleygraph/CayleyGraph.tsx";
import subgroupsData, {
  ConjugacyClass,
  IsomorphismClass,
} from "./data/subgroupData";

import { SubgroupChoice } from "./ui/SubgroupChoice.tsx";

import { useControls } from "leva";
import { labelMonoid, makeEmbeddedSubmonoid } from "./monoid/makeMonoid.ts";
import { GeometryName, GroupName } from "./DefaultMeshes.tsx";
import { CayleyGraphEditor } from "./ui/cayleygraph/CayleyGraphEditor.tsx";

import { cayleyGraphData, getCayleyGraphData } from "./data/cayleyGraphData.ts";

import { CayleyPanel } from "./ui/CayleyPanel.tsx";

import { Header } from "./info/Header.tsx";
import { findInverse } from "./group/invert.ts";

import useMonoidState from "./hooks/useMonoidState.ts";
import { MathJaxContext } from "better-react-mathjax";

import { MemoizedMathJax } from "./ui/MemoizedMathJax.tsx";
import { set } from "firebase/database";
import { Bound } from "./error/Bound.tsx";
import { SectionTitle } from "./info/SectionTitle.tsx";
import { GroupDetails } from "./info/GroupDetails.tsx";
import { GroupInput } from "./ui/GroupInput.tsx";
export const Controls = {};
type QuaternionDisplayMode = "orthogonal" | "matrix" | "euler" | "axis-angle";
const mathJaxConfig = {
  fastPreview: false,
  CommonHTML: { linebreaks: { automatic: true } },
           showMathMenu: true,
           'HTML-CSS': {
               linebreaks: { width: 'container' },
               scale: 150
           }
};

export type AppState = {
  geomName: GeometryName;
  subgroupName: GroupName;
  conjugacyClassIndex: number;
  indexInClass: number;
}
// subgroupData = (subgroupData as SubgroupData);
function App() {
  const [showCGEditor, setShowCGEditor] = useState(false);
  // const [cameraType, setCameraType] = useState<CameraType>("front-facing");

  // The app controls
  const controlVals = {
    showCGInput: false,
    useAllValues: false,
    showSubgroupIndices: false,
    reindexForSubgroup: false,
    showCayleyGraph: true,
    strictIndices: false,
    labelWithInverses: false,
    cameraType: "perspective",
    quaternionDisplayMode: "matrix",
    vertexNames: "all",
  };
  //cameraType: {
  //  options: ["perspective" ],
  // quaternionDisplayMode: {
  // },
  //   options: [ "matrix", "orthogonal", "euler", "axis-angle", "quaternion"]
  // },
  // vertexNames: {
  //   options: [ "all", "selected", "none"]
  // }
  Controls.controlVals = controlVals;
  const geomNameList = Object.keys(SolidMonoids) as GeometryName[];
  const defaultGeomName = geomNameList[3]; // Octahedron
  const defaultGroupName= SolidMonoids[defaultGeomName].name as GroupName ;
  const defaultSubgroupName = "A_4";
  const defaultConjugacyClassIndex = 0;
  const defaultIndexInClass = 0;
  // Convert the below code into a form that uses a single object for the groupName, subgroupName, etc.
  const [state, setState] = useState<AppState>({
    geomName: defaultGeomName,
    subgroupName: defaultSubgroupName,
    conjugacyClassIndex: defaultConjugacyClassIndex,
    indexInClass: defaultIndexInClass,
  });
  
 const {geomName, subgroupName, conjugacyClassIndex, indexInClass} = state;
  const groupName = SolidMonoids[geomName].name as GroupName;
  const currentMonoid = SolidMonoids[geomName];
  const result = enumeratePairs(currentMonoid);
  console.log("EnumeratePairs", {result});
  // Which isomorphism class of subgroups to show (now safely)

  
  const subgroupIsoClass: IsomorphismClass =
  subgroupsData[geomName][subgroupName];
  const allConjugacyClasses: ConjugacyClass[] = [];
  const subgroupDiagramOnClick: Function[] = [];

  Object.entries(
    subgroupsData[geomName]
  ).forEach(([groupName, data]) => {
      data.conjugacyClasses.forEach((cjClass, cjClassIndex) => {
         allConjugacyClasses.push(cjClass);
         subgroupDiagramOnClick.push(function() {
            setState({...state, subgroupName: groupName, conjugacyClassIndex: cjClassIndex, indexInClass: 0});
         });
      });
  });
  console.log({allConjugacyClasses});
  const availableConjugacyClasses: ConjugacyClass[] =
    subgroupIsoClass.conjugacyClasses;

  const conjugacyClass = availableConjugacyClasses[
      conjugacyClassIndex
    ];
  const indexInSubgroupDiagram = conjugacyClass.flatIndex;
  // console.log({flatIndex: conjugacyClass.flatIndex, conjugacyClassIndex})
  const subgroupData = conjugacyClass.members[indexInClass];

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
  /*
  const setGeometry = function (geomName: GeometryName) {
    // set the geomName, and reset the other properties
    // set them to the defaults
    setState({...state, geomName, indexInClass: 0, conjugacyClassIndex: 0, subgroupName: SolidMonoids[geomName].name as GroupName});
  };*/
  useLayoutEffect(() => {
    // When the geometry changes, reset the subgroup class and choice indices, and the monoid value
    // resetMonoid();
    // enumerateOrbits(currentMonoid);
  }, [geomName]);
  
  console.log("subgroupName: ", subgroupName);


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
    setState({...state, conjugacyClassIndex: classIndex, indexInClass: 0});
    resetMonoid();
  };

  const data = controlVals.showCayleyGraph ? getCayleyGraphData(subgroupName, labelList) : null;
  const vertices = data ? data?.vertices : [];
  const edges = data ? data?.edges : [];

  const transformations = labeledSubgroup.elements.filter(({ index }) => index != 0);
  const elementsToDisplay = controlVals.useAllValues
    ? transformations
    : generators;

  const elements = labeledSubgroup.elements;
  const project = function (obj: Indexed<any>) {
    // return obj.index;
    return elements.findIndex(({ index }) => index == obj.index);
  };

  const secondaryShape = subgroupIsoClass.shape;
  return (
    <MathJaxContext config={mathJaxConfig}>
<Bound>

    <div
      className="App net1"
      style={{ overflow: showCGEditor ? "hidden" : "inherit" }}
      >
    

      <Header />
      <CayleyGraphEditor
              show={showCGEditor}
              hide={() => setShowCGEditor(false)}
              />
      
   
      <div style={{ width: "33%"}}>
              
                  {(controlVals.showCGInput) && (<div>
                  <CayleyPanel group={currentMonoid} />
                  </div>
                  )}
            </div>

      <div className="MainContent">
        {!showCGEditor && (
          <MainSelector setAppState={setState} appState={state} resetMonoid={resetMonoid}       
        
          />
          )}
        <div className={"MiddlePanel lineBorder"} style={{ display: "flex", flexDirection:"column"  }}> 
        <div >
      
          <div style={{ display: "flex", flexDirection:"column"  }}>
            <h2 className="shapeName section-title" style={{width: "100%", fontFamily: "Helvetica", fontWeight: 400}}>{`${geomName}`}</h2>
            <ShapeDisplay
            secondaryShape={secondaryShape}
            shape={geomName}
            cameraType={controlVals.cameraType}
            transform={monoidValue}
            stepIndex={0}
            availableTransformations={elementsToDisplay}
            generators={generators}
            />
            </div>
           
      
        
          {controlVals.showCayleyGraph && (
            <div  style={{ display: "flex", flexDirection:"column"  }}>
            <h4 className="shapeName section-title" style={{width: "86%", paddingTop: "10px", paddingLeft: "7%", paddingBottom: "5px", fontSize: "25px"}}><MemoizedMathJax formula={`\\[${subgroupIsoClass.displayName}\\]`}/></h4>

              <CayleyGraph
              
              {...data}
              currentIndex={(function () {
                let projectedIndex = project(monoidValue);
                return projectedIndex;
              })()}
              vertexNames={controlVals.vertexNames}
              />
            </div>

            )}
  

          </div>
              {/* 
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
            

            <FGIMonoidDisplay<E3>
              shape={geomName}
              monoid={currentMonoid}
              availableTransformations={transformations}
              generators={generators}
              updateHash={""}
              monoidValue={monoidValue}
              setMonoidValue={setMonoidValue}
            /> 
            */}
            
            <GroupInput 
            m={labeledSubgroup}
            labels={labels}
            append={appendMonoidValue} reset={resetMonoid} monoidValue={monoidValue} currentSequence={currentSequence} generators={controlVals.useAllValues ? labeledSubgroup.elements : labeledSubgroup.generators}              
             
             />

        </div>
        <div className={"RightPanel"} style={{ display: "flex", flexDirection: "row", justifyContent: "space-around", width: "40%" }}>
            <div style={{  }}>
              <div className="SubgroupDiagram__holder">
        <SectionTitle title="Subgroup Lattice" />

                <SubgroupDiagramComponent
                  size={10}
                  poset={currentSubgroupDiagramData.poset}
                  positions={currentSubgroupDiagramData.positions}
                  active={indexInSubgroupDiagram}
                  reset={() => setClassAndResetChoice(0)}
                  setActive={i => subgroupDiagramOnClick[i]()}
                  labels={currentSubgroupDiagramData.labels.map((_, index) =>
                    controlVals.showSubgroupIndices
                    ? "" + index
                    : allConjugacyClasses[index].displayName
                    )}
                    />
                    
                <SubgroupChoice
                  choiceIndex={indexInClass}
                  setChoiceIndex={(i) => { setState({...state, indexInClass: i}); resetMonoid(); }}
                  choices={conjugacyClass.members}
                  />
              </div>

              <div
                className="GroupInfo__holder"
                style={{ marginTop: "auto", height: "10vh " }}
                >
                <GroupDetails generators={generators} group={labeledSubgroup} />
              </div>
              <div>
                
              </div>
            </div>
            
          </div>
      </div>
        </div>
        </Bound>

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
