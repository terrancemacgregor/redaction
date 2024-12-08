import React from "react";
import ModalOverlay from "./ModalOverlay";


interface GetFileInfoProps {
    fileName: string;
    fileSize: number;
    characterCount: number;
    onClose: () => void;
}

const GetFileInfo: React.FC<GetFileInfoProps> = ({
                                                     fileName,
                                                     fileSize,
                                                     characterCount,
                                                     onClose,
                                                 }) => {
    return (
        <ModalOverlay isVisible={true} onClose={onClose}>
            <h2>File Information</h2>
            <ul>
                <li><strong>File Name:</strong> {fileName}</li>
                <li><strong>File Size:</strong> {(fileSize / 1024).toFixed(2)} KB</li>
                <li><strong>Character Count:</strong> {characterCount}</li>
            </ul>
            <button
                style={{
                    padding: "10px 20px",
                    fontSize: "1rem",
                    cursor: "pointer",
                    marginTop: "10px",
                }}
                onClick={onClose}
            >
                Close
            </button>
        </ModalOverlay>
    );

};

export default GetFileInfo;
