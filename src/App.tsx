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
import { SolidMonoids } from "./data/platonicsolids.ts";
import { CameraControls } from "./CameraControls";
import { MainSelector } from "./ui/MainSelector.tsx";
import { CameraType } from "./types/camera.ts";
import subgroupDiagramData, { SubgroupDiagramData } from "./data/subgroupDiagramData.ts";
import { SubgroupDiagramComponent } from "./ui/SubgroupDiagram.tsx";
import { CayleyGraph } from "./CayleyGraph.tsx";
type SubgroupsData = Record<GeometryName, Partial<Record<GroupName, number[]>>>;
import subgroupsData, { ConjugacyClass, SubgroupData, SubgroupsData} from "./data/subgroupData";

import { MathComponent } from "mathjax-react";
import { SubgroupChoice } from "./ui/SubgroupChoice.tsx";

import { useControls } from "leva";
import { makeEmbeddedSubmonoid, makeSubmonoid } from "./monoid/makeMonoid.ts";
import { GeometryName, GroupName } from "./DefaultMeshes.tsx";
import { CayleyGraphEditor } from "./ui/CayleyGraphEditor.tsx";
import { makeEdges } from "./Edges.ts";
import { cayleyGraphData } from "./data/cayleyGraphData.ts";
import projectMonoid from "./monoid/projectMonoid.ts";
import { CayleyPanel } from "./ui/CayleyPanel.tsx";
import useIndexState from "./hooks/useIndexedState.ts";
import { Partial } from "@react-spring/web";
import { sub } from "three/examples/jsm/nodes/Nodes.js";


// subgroupData = (subgroupData as SubgroupData);
function App() {
   const [showCGEditor, setShowCGEditor] = useState(false);
   const [cameraType, setCameraType] = useState<CameraType>("front-facing");

   // The app controls
   const controlVals = useControls({
      useAllValues: false,
      showSubgroupIndices: false,
      reindexForSubgroup: false,
      showCayleyGraph: true,
      strictIndices: false,
   });
   // const { geomName }  = controlVals;
   // geomName: {
   //   options:  [ "Cube", "Icosahedron", "Dodecahedron", "Tetrahedron", "Octahedron"] ,
   // },

   // Cube | Icosahedron | Dodecahedron | Tetrahedron | Octahedron

   const geomNameList = Object.keys(SolidMonoids) as GeometryName[] ;
   const [geomNameIndex, setGeomNameIndex] = useIndexState(geomNameList);
   
   const geomName = geomNameList[geomNameIndex];
   const currentMonoid = SolidMonoids[geomName];
   const groupName = currentMonoid.name;


   // Which isomorphism class of subgroups to show (now safely)
   const availableConjugacyClasses: ConjugacyClass[] = Object.values(subgroupsData[groupName]).map((x) => x.conjugacyClasses).flat();
   const [conjugacyClassIndex, setConjugacyClassIndex] = useIndexState(availableConjugacyClasses);
   const conjugacyClass = availableConjugacyClasses[Math.min(availableConjugacyClasses.length - 1, conjugacyClassIndex)];
  // const availableSubgroups = conjugacyClass.members;
   // which conjugacy class of subgroups to show
   const [subgroupIndex, setSubgroupIndex] = useIndexState(conjugacyClass.members);
   const subgroupData = conjugacyClass.members[subgroupIndex];
   const subgroup = makeEmbeddedSubmonoid(currentMonoid, subgroupData.generators.map(i => currentMonoid.elements[i]), conjugacyClass.name);
   const reindexedSubgroup = indexMonoid(subgroup);
   const [monoidValue, setMonoidValue] = useState(currentMonoid.identity);
   const currentGroupName = currentMonoid.name;

   const currentSubgroupDiagramData: SubgroupDiagramData = subgroupDiagramData[currentGroupName];
   currentSubgroupDiagramData.labels = availableConjugacyClasses.map(c => c.name);
   if (monoidValue.index > currentMonoid.elements.length) {
      setMonoidValue(currentMonoid.identity);
   }

   useLayoutEffect(() => {
      // When the geometry changes, reset the subgroup class and choice indices, and the monoid value
      setConjugacyClassIndex(0);
      setSubgroupIndex(0);
      setMonoidValue(currentMonoid.identity);
   }, [geomName]);

   console.log("subgroupName: ", subgroup.name);

   const data = cayleyGraphData[subgroup.name];
   const vertices = data ? data?.vertices : [];
   const edges = data ? data?.edges : [];

   const generators = subgroup.generators;
   
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
      setSubgroupIndex(0);
      setMonoidValue(currentMonoid.identity);
   };

   const transformations = subgroup.elements.filter(({index}) => index != 0);
   const elementsToDisplay = controlVals.useAllValues
      ? transformations
      : generators;

   const elements = subgroup.elements;
   const project = function(obj: Indexed<any>) {
      // return obj.index;
      return elements.findIndex(({index}) => index == obj.index);
   } 
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
            <div style={{ width: "33%" }}>
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
               <CayleyGraphEditor
                  show={showCGEditor}
                  hide={() => setShowCGEditor(false)}
               />
               {!showCGEditor && (
                  <MainSelector
                     geometryData={{
                        name: "Geometry",
                        options: geomNameList,
                        selected: [geomName],
                        set: setGeomNameIndex,
                        mode: "Index",
                     }}
                     subgroupClassData={{
                        name: "Conjgacy Class",
                        options: conjugacyClass.members.map((val: SubgroupData) => val.name),
                        selected: [],
                        set: setConjugacyClassIndex,
                        mode: "Index",
                     }}
                     subgroupChoiceData={{
                        name: "Subgroup",
                        options: [],
                        selected: [],
                        set: setSubgroupIndex,
                        mode: "Index",
                     }}
                  />
               )}
               <FGIMonoidDisplay<E3>
                  shape={geomName}
                  monoid={currentMonoid}
                  availableTransformations={transformations} 
                  generators={generators} 
                  /* determined by the point in the subgroup diagram*/
                  updateHash={""}
                 
                  monoidValue={monoidValue}
                  setMonoidValue={setMonoidValue}
               />

               <ShapeDisplay
                  
                  shape={geomName}
                  cameraType={"orthographic"}
                  transform={monoidValue}
                  stepIndex={0}
                  availableTransformations={elementsToDisplay}
                  generators={generators}
               />
               <CameraControls setCameraType={setCameraType} />
            </div>
            <div style={{ width: "33%" }}>
               <div className="SubgroupDiagram__holder">
                  <SubgroupDiagramComponent
                     size={10}
                     poset={currentSubgroupDiagramData.poset}
                     positions={currentSubgroupDiagramData.positions}
                     active={conjugacyClassIndex}
                     setActive={setClassAndResetChoice}
                     labels={currentSubgroupDiagramData.labels.map((_, index) =>
                        controlVals.showSubgroupIndices ? "" + index : availableConjugacyClasses[index].displayName
                     )}
                  />
                  <SubgroupChoice
                     choiceIndex={subgroupIndex}
                     setChoiceIndex={setSubgroupIndex}
                     choices={conjugacyClass.members}
                  />
               </div>

               <div
                  className="GroupInfo__holder"
                  style={{ marginTop: "auto", height: "10vh " }}
               >
                  <h1>{currentMonoid.name}</h1>
                  <p style={{ justifyContent: "space-around", display: "flex" }}>
                     <span style={{ flexGrow: 2 }}>Order:</span>
                     <span style={{ flexGrow: 1 }}>
                        {currentMonoid.elements.length}
                     </span>
                  </p>
               </div>
            </div>
            <div style={{ width: "33%" }}>
               <div>
                  {controlVals.showCayleyGraph && (
                     <CayleyGraph
                        vertices={vertices}
                        edges={edges}
                        currentIndex={(function() {
                           let projectedIndex =  project(monoidValue)
                           return projectedIndex;
                        })()}
                     />
                  )}
               </div>
               <div>
                  <CayleyPanel group={currentMonoid} />
               </div>
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
