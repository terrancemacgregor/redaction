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
    const [redactedTableData, setRedactedTableData] = useState<
        { original_text: string; names: string[]; redacted_text: string }[]
    >([]);

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

        // Reset table data and redacted output before starting
        setRedactedTableData([]);
        setRedactedOutput(""); // Clear previous output

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

                // Debugging log to check API response
                console.log("API Response:", result);

                if (result.original_text && result.found_names && result.redacted_text) {
                    // Append the new row to the table
                    setRedactedTableData((prev) => [
                        ...prev,
                        {
                            original_text: result.original_text,
                            names: result.found_names, // Keep found_names as a string
                            redacted_text: result.redacted_text,
                        },
                    ]);

                    // Append redacted text to the redacted output
                    setRedactedOutput((prev) => `${prev}${result.redacted_text} `);
                } else {
                    console.error("API response does not have the expected structure.");
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

                    {redactedTableData.length > 0 && (
                        <div style={{ textAlign: "center", marginTop: "20px" }}>
                            <table
                                style={{
                                    width: "80%",
                                    margin: "0 auto",
                                    borderCollapse: "collapse",
                                    textAlign: "left",
                                }}
                            >
                                <thead>
                                <tr>
                                    <th style={{ width: "33%", borderBottom: "1px solid #ccc", padding: "10px" }}>Original Text</th>
                                    <th style={{ width: "33%", borderBottom: "1px solid #ccc", padding: "10px" }}>Names</th>
                                    <th style={{ width: "33%", borderBottom: "1px solid #ccc", padding: "10px" }}>Redacted Text</th>
                                </tr>
                                </thead>
                                <tbody>
                                {redactedTableData.map((row, index) => (
                                    <tr key={index}>
                                        <td style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>{row.original_text}</td>
                                        <td style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
                                            {row.names} {/* Display names directly as a string */}
                                        </td>
                                        <td style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>{row.redacted_text}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}

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
