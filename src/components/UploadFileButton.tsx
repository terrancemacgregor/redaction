import React from "react";

interface UploadFileButtonProps {
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadFileButton: React.FC<UploadFileButtonProps> = ({ onFileChange }) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleButtonClick = () => {
        fileInputRef.current?.click(); // Trigger hidden file input click
    };

    return (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
            <button
                style={{ padding: "10px 20px", fontSize: "1rem", cursor: "pointer" }}
                onClick={handleButtonClick}
            >
                Upload File
            </button>
            <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                style={{ display: "none" }}
                onChange={onFileChange} // Pass the file change event to parent
            />
        </div>
    );
};

export default UploadFileButton;
