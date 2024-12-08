import React, { useRef, useState } from "react";
import "./App.css";
import * as pdfjsLib from "pdfjs-dist";
import GetFileInfo from "./components/GetFileInfo";
import UploadFileButton from "./components/UploadFileButton";
import PDFTextArea from "./components/PDFTextArea";
import HeaderSection from "./components/HeaderSection";
import ProcessingPanel from "./components/ProcessingPanel";
import BufferPanel from "./components/BufferPanel";


pdfjsLib.GlobalWorkerOptions.workerSrc = "/node_modules/pdfjs-dist/build/pdf.worker.min.mjs";

const App: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileContent, setFileContent] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [redactedOutput, setRedactedOutput] = useState<string>("");


    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const extractPdfText = async (file: File) => {
        const fileReader = new FileReader();
        fileReader.onload = async () => {
            const typedArray = new Uint8Array(fileReader.result as ArrayBuffer);
            const pdf = await pdfjsLib.getDocument(typedArray).promise;

            let text = "";
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                text += content.items.map((item: any) => item.str).join(" ") + "\n";
            }
            setFileContent(text);
        };
        fileReader.readAsArrayBuffer(file);
    };

    const handleRedact = async (bufferSize: number) => {
        let remainingText = fileContent;

        // Reset redacted output before starting
        setRedactedOutput("");

        while (remainingText.length > 0) {
            // Determine the substring to send
            let substring = remainingText.slice(0, bufferSize);
            const lastSpaceIndex = substring.lastIndexOf(" ");
            if (lastSpaceIndex !== -1 && lastSpaceIndex < bufferSize) {
                substring = substring.slice(0, lastSpaceIndex);
            }

            // Make API request
            try {
                const response = await fetch("http://127.0.0.1:8002/redact_names", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify({ string_to_redact: substring }),
                });
                const result = await response.json();

                if (result.redacted_text) {
                    // Append the new redacted text to the state
                    setRedactedOutput((prev) => `${prev}${result.redacted_text} `);

                }
            } catch (error) {
                console.error("Error redacting text:", error);
            }

            // Remove processed text from remaining
            remainingText = remainingText.slice(substring.length).trim();
        }
    };


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            extractPdfText(file);
        }
    };

    const handleGetFileInfo = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            {/* Header Section */}
            <HeaderSection />

            {/* Upload Button */}
            <UploadFileButton onFileChange={handleFileChange} />


            {selectedFile && (
                <ProcessingPanel fileName={selectedFile.name} onGetFileInfo={handleGetFileInfo} />
            )}

            {/* Textarea to Display PDF Content */}
            {fileContent && <PDFTextArea fileContent={fileContent} />}

            {fileContent && (
                <>
                    <BufferPanel onRedact={handleRedact} />
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                        <textarea
                            style={{ width: "80%", height: "300px", padding: "10px", fontSize: "1rem" }}
                            value={redactedOutput}
                             readOnly
                        ></textarea>
                    </div>
                </>
            )}


            {/* Modal for File Info */}
            {isModalOpen && selectedFile && (
                <GetFileInfo
                    fileName={selectedFile.name}
                    fileSize={selectedFile.size}
                    characterCount={fileContent.length}
                    onClose={closeModal}
                />
            )}



        </div>
    );
};

export default App;
