import { useEffect, useRef, useState } from "react";

import "./App.css";
import { ShapeDisplay } from "./ShapeDisplay";
import { FGIMonoidDisplay } from "./monoid/MonoidDisplay.tsx";
import { Transform } from "./Display";
import { Indexed, IndexedFGM, indexMonoid } from "./monoid/IndexedMonoid";
import { SolidMonoids, } from "./exampleData/platonicsolids.ts";
import { CameraControls } from "./CameraControls";
import { MainSelector } from "./ui/MainSelector.tsx";
import { CameraType } from "./types/camera.ts";
import diagramData from "./data/subgroupDiagramData.ts";
import { SubgroupDiagramComponent } from "./cfg/SubgroupDiagram.tsx";
import { CayleyGraph } from "./CayleyGraph.tsx";
import { DefaultVertices } from "./logic/cayleyTables.ts";
import { Quaternion, Vector3 } from "three";
import subgroupData from "./data/subgroupData";
import { MathComponent } from "mathjax-react";
import { SubgroupChoice } from "./ui/SubgroupChoice.tsx";

import { useControls } from "leva";
import { makeSubmonoid } from "./monoid/makeMonoid.ts";
function App() {

  
  
  const [cameraType, setCameraType] = useState<CameraType>("front-facing");
  const controlVals = useControls({
    geomName: {
      options:  [ "Cube", "Icosahedron", "Dodecahedron", "Tetrahedron", "Octahedron"] ,
    },
    useAllValues: false,
    showSubgroupIndices: false,
  });
  const geomName = controlVals.geomName;
  useState<keyof typeof SolidMonoids>("Cube"); 
  const [currentDiagramData, setCurrentDiagramData] = useState(diagramData["Cube"]);
  const [currentMonoid, setCurrentMonoid] = useState<IndexedFGM>(SolidMonoids[geomName]);
  const [subgroupClassIndex, setSubgroupClassIndex] = useState(0);
  const [subgroupChoiceIndex, setSubgroupChoiceIndex] = useState(0);

  
  useEffect(() => {
    setCurrentMonoid(SolidMonoids[geomName]);
    setCurrentDiagramData(diagramData[geomName]);
  }, [geomName])


  const generators = subgroupData[geomName][subgroupClassIndex][subgroupChoiceIndex].generators.map(ind => currentMonoid.values[ind]);

  const subgroupMonoid = makeSubmonoid(currentMonoid, generators);
  /* Main app navigation */


  useEffect(() => {
    console.log("Key change:", geomName);
  }, [geomName])
  /* Navigation */
  /*
        <CayleyGraph monoid={currentMonoid} graphVertices={DefaultVertices.box} graphEdges={makeEdges(currentMonoid)}/>     
  */
  const setClassAndResetChoice = function(classIndex: number) {
    setSubgroupClassIndex(classIndex);
    setSubgroupChoiceIndex(0);
  }
  return (
    
      <div 
        className="App"
        style={{
        display: "flex", 
        height: "100%",
        width: "100%",
      }}>
    <div style={{width: "60vw", height: "45vh", display:"flex", margin: "0 auto", marginTop: "200px"}} >
      <div style={{width:"50%"}}>
          <FGIMonoidDisplay<Indexed<Transform>> shape={geomName} monoid={currentMonoid} generators={controlVals.useAllValues ? currentMonoid.values : generators}/* determined by the point in the subgroup diagram*/ updateHash={""} subgroup={subgroupChoiceIndex + "," + subgroupClassIndex}>
            
            <ShapeDisplay shape={geomName} cameraType={cameraType} />
            <CameraControls setCameraType={setCameraType}/>
          
            <CayleyGraph monoid={currentMonoid} graphVertices={DefaultVertices.box} graphEdges={[]} transform={{
              index: 0,
              value: {
                rotation: new Quaternion,
                position: new Vector3
              }
            }} />
          </FGIMonoidDisplay>
        </div>
        <div style={{width:"50%"}}>

          <div className="SubgroupDiagram__holder" >
            <SubgroupDiagramComponent size={10} poset={currentDiagramData.poset} positions={currentDiagramData.positions} active={subgroupClassIndex} setActive={setClassAndResetChoice} labels={currentDiagramData.labels.map((val, index) => controlVals.showSubgroupIndices ? index : val)}/>
            <SubgroupChoice choiceIndex={subgroupChoiceIndex} setChoiceIndex={setSubgroupChoiceIndex} choices={subgroupData[geomName][subgroupClassIndex]}/>
          </div>

          <div className="GroupInfo__holder" style={{marginTop: "auto", height: "10vh "}}>
           <h1>{currentMonoid.name}</h1>
           <p style={{justifyContent: "space-around", display: "flex"}}>
            <span style={{flexGrow: 2}}>Order:</span>
            <span style={{flexGrow: 1}}>{currentMonoid.values.length}</span></p>
          </div>
        </div>
        
      </div>

  </div>

  )
  return (
    <div>
      <div className="App_header">
        <button>
          Menu
        </button>
      </div>
      
      <div>
      </div>
    </div> 
    
  );
  

}

export default App;
