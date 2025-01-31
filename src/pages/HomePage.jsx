// HomePage.js
import React, { useState } from 'react';
import SidePanel from '../components/SidePanel';
import PreviewComponent from '../components/PreviewComponent';
import * as XLSX from 'xlsx';

const HomePage = () => {
  // State for the inputs
  const [height, setHeight] = useState(81.8); // Default 100 cm
  const [width, setWidth] = useState(80); // Default 60 cm
  const [depth, setDepth] = useState(53); // Default 40 cm
  const [materialThickness, setMaterialThickness] = useState(1.8); // Default 1.8 cm
  const [toeKick, setToeKick] = useState(10); // Default 10 cm for floor cabinets
  const [numShelves, setNumShelves] = useState(0); // Default 2 shelves for wall cabinets
  const [isWallCabinet, setIsWallCabinet] = useState(false); // Whether it's a wall cabinet or not
  const [doors, setDoors] = useState(2); // Whether it's a wall cabinet or not
  const [supportHeight, setSupportHeight] = useState(7.5); // Default 7.5 for sinks 10



  const doorHeight = ((height - (isWallCabinet || toeKick === 0 ? 0 : toeKick) - 0.4)).toFixed(2);
  const doorWidth = ((width - 0.8) / doors).toFixed(2);
  const doorSize = ((doorHeight / 100) * (doorWidth / 100)).toFixed(2); // in m²

  const bottomPlateHeight = (depth).toFixed(2);
  const bottomPlateWidth = ((width - (materialThickness * 2))).toFixed(2);
  const bottomPlateSize = ((bottomPlateHeight / 100) * (bottomPlateWidth / 100)).toFixed(2); // in m²

  const sidePlateHeight = (height).toFixed(2);
  const sidePlateWidth = (depth).toFixed(2);
  const sidePlateSize = ((sidePlateHeight / 100) * (sidePlateWidth / 100)).toFixed(2); // in m²

  const toeKickHeight = (toeKick).toFixed(2);
  const toeKickWidth = (width - (materialThickness * 2)).toFixed(2)
  const toeKickSize = ((toeKickHeight / 100) * (toeKickWidth / 100)).toFixed(2); // in m²

  const supportWidth = ((width - (materialThickness * 2))).toFixed(2);
  const supportSize = ((supportWidth / 100) * (supportHeight / 100)).toFixed(2);

  // sirina - materijal sa obe strane debljina - jos 2 milimetra
  const shelfWidth = ((width - (materialThickness * 2)) - 0.2).toFixed(2)
  // dubina - 3 cm
  const shelfHeight = ((depth) - 3).toFixed(2);
  const shelfSize = ((shelfWidth / 100) * (shelfHeight / 100)).toFixed(2);


  // Function to generate Material List text
  const generateMaterialList = () => {
    return `
Material List:
--------------------------
1. Door (x${doors})
   - Height: ${doorHeight} cm
   - Width: ${doorWidth} cm
   - Size: ${doorSize} m2
   - Total Size: ${doorSize * doors} m2


2. Bottom Plate:
   - Height: ${bottomPlateHeight} cm
   - Width: ${bottomPlateWidth} cm
   - Size: ${bottomPlateSize} m2


3. Side Plates (x2):
   - Height: ${sidePlateHeight} cm
   - Width: ${sidePlateWidth} cm
   - Size: ${sidePlateSize} m2
   - Total Size: ${sidePlateSize * 2} m2

${toeKick ? `
4. Toe Kick:
   - Height: ${toeKickHeight} cm
   - Width: ${toeKickWidth} cm
   - Size: ${toeKickSize} m2
` : ''}


${!isWallCabinet ? `
5. Support (x2):
   - Height: ${supportHeight} cm
   - Width: ${supportWidth} cm
   - Size: ${supportSize} m2
   - Total Size: ${supportSize * 2} m2
` : ''}


${numShelves > 0 ? `
6. Shelf (x${numShelves}):
   - Height: ${shelfHeight} cm
   - Width: ${shelfWidth} cm
   - Size: ${shelfSize} m2
   - Total Size: ${shelfSize * numShelves} m2
` : ''}
    `;
  };

  // Function to handle the export of material list as a .txt file
  const handleExportMaterialList = () => {
    const materialList = generateMaterialList();
    const blob = new Blob([materialList], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'materials.txt';
    link.click();
  };

  // Function to handle export of Material List to Excel
  const handleExportExcel = () => {
    const data = [
      { Type: 'Door', Amount: doors, Height: parseFloat(doorHeight), Width: parseFloat(doorWidth), Size: parseFloat(doorSize), Total_Size: parseFloat(doorSize) * doors },
      { Type: 'Bottom Plate', Amount: 1, Height: parseFloat(bottomPlateHeight), Width: parseFloat(bottomPlateWidth), Size: parseFloat(bottomPlateSize), Total_Size: parseFloat(bottomPlateSize) },
      { Type: 'Side Plates', Amount: 2, Height: parseFloat(sidePlateHeight), Width: parseFloat(sidePlateWidth), Size: parseFloat(sidePlateSize), Total_Size: parseFloat(sidePlateSize) * 2 },
      ...(toeKick ? [{ Type: 'Toe Kick', Amount: 1, Height: parseFloat(toeKickHeight), Width: parseFloat(toeKickWidth), Size: parseFloat(toeKickSize), Total_Size: parseFloat(toeKickSize) }] : []),
      ...(!isWallCabinet ? [{ Type: 'Support', Amount: 2, Height: parseFloat(supportHeight), Width: parseFloat(supportWidth), Size: parseFloat(supportSize), Total_Size: parseFloat(supportSize) * 2 }] : []),
      ...(numShelves > 0 ? [{ Type: 'Shelf', Amount: numShelves, Height: parseFloat(shelfHeight), Width: parseFloat(shelfWidth), Size: parseFloat(shelfSize), Total_Size: parseFloat(shelfSize) * numShelves }] : [])
    ]
  ;

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Material List');
    XLSX.writeFile(wb, 'material_list.xlsx');
  };

  // State for handling the export options dropdown
  const [exporting, setExporting] = useState(false);

  return (
    <div className="home-page">
      <div className="top-menu">
        <button onClick={() => setExporting(!exporting)}>Export</button>
        {exporting && (
          <div className="export-options">
            <button onClick={handleExportMaterialList}>Material List (Text)</button>
            <button onClick={handleExportExcel}>Export as Excel</button>
          </div>
        )}
      </div>
      <div className="layout">
        <SidePanel
          height={height}
          setHeight={setHeight}
          width={width}
          setWidth={setWidth}
          depth={depth}
          setDepth={setDepth}
          materialThickness={materialThickness}
          setMaterialThickness={setMaterialThickness}
          toeKick={toeKick}
          setToeKick={setToeKick}
          numShelves={numShelves}
          setNumShelves={setNumShelves}
          isWallCabinet={isWallCabinet}
          setIsWallCabinet={setIsWallCabinet}
          doors={doors}
          setDoors={setDoors}
          supportHeight={supportHeight}
          setSupportHeight={setSupportHeight}
        />
        <div className="preview-container">
          <PreviewComponent
            height={height}
            width={width}
            depth={depth}
            materialThickness={materialThickness}
            toeKick={toeKick}
            numShelves={numShelves}
            isWallCabinet={isWallCabinet}
            amountOfDoors={doors}
          />
        </div>
      </div>
    </div>
  );
};



export default HomePage;
