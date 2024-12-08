import React from "react";

interface ProcessingPanelProps {
    fileName: string;
    onGetFileInfo: () => void;
}

const ProcessingPanel: React.FC<ProcessingPanelProps> = ({ fileName, onGetFileInfo }) => {
    return (
        <div style={{ textAlign: "center", marginTop: "20px", padding: "10px", border: "1px solid #ccc" }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
                <h3 style={{ margin: 0 }}>Processing: {fileName}</h3>
                <button
                    style={{
                        padding: "10px 20px",
                        fontSize: "1rem",
                        cursor: "pointer",
                    }}
                    onClick={onGetFileInfo}
                >
                    Get File Info
                </button>
            </div>
        </div>
    );
};

export default ProcessingPanel;
