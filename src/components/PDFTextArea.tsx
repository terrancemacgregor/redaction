import React from "react";

interface PDFTextAreaProps {
    fileContent: string;
}

const PDFTextArea: React.FC<PDFTextAreaProps> = ({ fileContent }) => {
    return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
      <textarea
          style={{ width: "80%", height: "300px", padding: "10px", fontSize: "1rem" }}
          value={fileContent}
          readOnly
      ></textarea>
        </div>
    );
};

export default PDFTextArea;
