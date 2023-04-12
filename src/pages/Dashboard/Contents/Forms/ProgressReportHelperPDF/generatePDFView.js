import React, { createRef } from "react";
import PDFButton from "./PDFButton";
import "./styles.css";

export default function App(props) {
  const pdfRef = createRef(); // create a single ref to pass to button
  return (
    <div ref={pdfRef} className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <p>This is a demo how to create a save to PDF button</p>
      <PDFButton
        fileName="awesomePDFButtonDemo.pdf"
        targetRef={pdfRef}
      >
        Save to PDF!
      </PDFButton>
    </div>
  );
}