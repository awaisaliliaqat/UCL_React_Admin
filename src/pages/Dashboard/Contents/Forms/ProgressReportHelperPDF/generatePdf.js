import React from "react";
import PropTypes from "prop-types";
import Pdf from "react-to-pdf";
const options = {
  orientation: 'landscape'

};
// expose a targetRef prop and filename
const PDFButton = ({ children, filename, targetRef }) => (
  <Pdf targetRef={targetRef} filename={filename} options={options}  x={5} y={10}  scale={0.7}>
    {({ toPdf }) => <button onClick={toPdf}>{children}</button>}
  </Pdf>
);

PDFButton.propTypes = {
  filename: PropTypes.string,
  targetRef: PropTypes.any
};

PDFButton.defaultProps = {
  filename: "code-example.pdf"
};

export default PDFButton;
