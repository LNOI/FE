import React, { useState, useEffect, useRef,useCallback } from "react";
import "./App.css";
// import uuid from "react-uuid";
import DropFile from './components/drop-file-input/DropFile'
// import useWebSocket from 'react-use-websocket';
import { Button } from "@mui/material";
import { margin } from "@mui/system";

function App() {
  const [websckt, setWebsckt] = useState();
 
  return (
    <>
      <div className="box">
        <h2 className="header">KPMG DEMO SITE</h2>
        <h5 className="header">Tagline of the product</h5>
        <DropFile  websckt={websckt} ></DropFile>
      </div>
    </>
  );
}

export default App;