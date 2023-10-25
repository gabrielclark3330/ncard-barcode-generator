import { useEffect, useState, useRef } from "react";
import JsBarcode from "jsbarcode";
//import { DOMImplementation, XMLSerializer } from "xmldom";
import React from 'react';


async function GetStudentDetails(studentURL, setStudentJson) {
  if (studentURL.includes("department")) {
    return;
  }
  const response = await fetch(studentURL + encodeURIComponent(".json"));
  const studentJson = await response.json();
  setStudentJson(studentJson);
  //console.log(studentJson);
}

function Title(studentJson) {
  if (studentJson.unlSISMajor !== null) {
    if (studentJson.unlHRPrimaryDepartment !== null) {
      return (
        studentJson.unlSISMajor + " in " + studentJson.unlHRPrimaryDepartment
      );
    }
    return studentJson.unlSISMajor;
  } else if (studentJson.title !== null) {
    if (studentJson.unlHRPrimaryDepartment !== null) {
      return studentJson.title + " in " + studentJson.unlHRPrimaryDepartment;
    }
    return studentJson.title;
  } else {
    return "Unl Associate";
  }
}
function BarcodeGenerator({ value }) {
  const barcodeRef = useRef(null);

  useEffect(() => {
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, value, {
        format: "ean13", // Use the appropriate format if "mean13" is different
        displayValue: true, // displays the provided value below the barcode
        width: 3,
        height: 100,
      });
    }
  }, [value]);

  return <svg ref={barcodeRef}></svg>;
}

async function showOverlayIfStudentInformationLoaded(studentJson, setShowOverlay, studentURL, setStudentJson) {
  if (studentJson.unluncwid) {
    setShowOverlay(true);
    return;
  }else {
    await GetStudentDetails(studentURL, setStudentJson);
    setShowOverlay(true);
  }
}

function StudentCard(props) {
  const [studentJson, setStudentJson] = useState({});
  const [showOverlay, setShowOverlay] = useState(false);
  const [cardIteration, setCardIteration] = useState(1);
  useEffect(() => {
    if (props.listIndex<5) {
      GetStudentDetails(props.studentURL, setStudentJson);
    }
  }, [props.studentURL, props.listIndex]);

  return (
    <div className="rounded-lg my-6 mx-4 shadow-lg border border-gray">
      {showOverlay && (
        <div className="fixed inset-0 flex items-center justify-center z-10">
          <div className="bg-white p-8 rounded-lg shadow-lg border border-gray text-center">
            <h2 className="text-xl mb-4">🏮 {studentJson.displayName}'s NCard Issue {cardIteration} 🏮</h2>
            <h2 className="text-xl mb-4">{studentJson.unluncwid}</h2>
            <BarcodeGenerator value={studentJson.unluncwid + cardIteration.toString().padStart(4, 0)} />
            <div>
              <button
                onClick={() => {setShowOverlay(false); setCardIteration(1)}}
                className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 mx-2 rounded"
              >
                Close
              </button>
              <button
                onClick={() => setCardIteration(cardIteration+1)}
                className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 mx-2 rounded"
              >
                +1
              </button>
              <button
                onClick={() => {cardIteration>1? setCardIteration(cardIteration-1):setCardIteration(1)}}
                className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 mx-2 rounded"
              >
                -1
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="py-2 mx-2">
        {studentJson.displayName ? studentJson.displayName : props.studentName}
      </div>
      <div className="py-2 mx-2">
        {studentJson.title? Title(studentJson) : "Open NCard"}
      </div>
      <div className="py-2 mx-2">
        {studentJson.unluncwid ? "NUID: " + studentJson.unluncwid : "Open NCard"}
      </div>
      <button
        onClick={() => {
          showOverlayIfStudentInformationLoaded(studentJson, setShowOverlay, props.studentURL, setStudentJson);
        }}
        className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 my-2 mx-2 rounded shadow-lg"
      >
        NCard Barcode
      </button>
    </div>
  );
}
//, {format: "ean13"}
export default StudentCard;
