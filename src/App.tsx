import React, { useRef, useState } from "react";

import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom"; // Add Link import

import "./App.css";
import UploadFileButton from "./components/UploadFileButton";
import PDFTextArea from "./components/PDFTextArea";
import HeaderSection from "./components/HeaderSection";
import ProcessingPanel from "./components/ProcessingPanel";
import BufferPanel from "./components/BufferPanel";
import TestPage from "./components/TestPage"; // Import TestPage component
import HomePage from "./components/HomePage"; // Import HomePage component

import * as pdfjsLib from "pdfjs-dist"; // Import pdfjs-lib correctly
pdfjsLib.GlobalWorkerOptions.workerSrc = "/node_modules/pdfjs-dist/build/pdf.worker.min.mjs";

// NavBar Component
const NavBar: React.FC = () => {
    return (
        <nav style={{ backgroundColor: "#007bff", padding: "10px", position: "sticky", top: 0, zIndex: 100 }}>
            <ul style={{ listStyle: "none", display: "flex", justifyContent: "center" }}>
                <li style={{ margin: "0 15px" }}>
                    <Link to="/" style={{ color: "white", textDecoration: "none", fontSize: "18px" }}>Home</Link>
                </li>
                <li style={{ margin: "0 15px" }}>
                    <Link to="/test" style={{ color: "white", textDecoration: "none", fontSize: "18px" }}>Test Page</Link>
                </li>
            </ul>
        </nav>
    );
};

// Main App Component
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

    // Redaction process
    const handleRedact = async (bufferSize: number) => {
        let remainingText = fileContent;

        setRedactedTableData([]);
        setRedactedOutput(""); // Clear previous output

        while (remainingText.length > 0) {
            let substring = remainingText.slice(0, bufferSize);
            const lastSpaceIndex = substring.lastIndexOf(" ");
            if (lastSpaceIndex !== -1 && lastSpaceIndex < bufferSize) {
                substring = substring.slice(0, lastSpaceIndex);
            }

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

                if (result.original_text && result.found_names && result.redacted_text) {
                    setRedactedTableData((prev) => [
                        ...prev,
                        {
                            original_text: result.original_text,
                            names: result.found_names,
                            redacted_text: result.redacted_text,
                        },
                    ]);
                    setRedactedOutput((prev) => `${prev}${result.redacted_text} `);
                } else {
                    console.error("API response does not have the expected structure.");
                }
            } catch (error) {
                console.error("Error redacting text:", error);
            }

            remainingText = remainingText.slice(substring.length).trim();
        }
    };

    // Handle file change
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
        <Router>
            <div>
                {/* NavBar */}
                <NavBar />

                {/* Routes */}
                <Routes>
                    <Route path="/test" element={<TestPage />} />
                    <Route path="/" element={
                        <>
                            <HeaderSection />
                            <UploadFileButton onFileChange={handleFileChange} />
                            {selectedFile && (
                                <ProcessingPanel fileName={selectedFile.name} onGetFileInfo={handleGetFileInfo} />
                            )}
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
                                                    <th style={{ width: "33%", borderBottom: "1px solid #ccc", padding: "10px" }}>
                                                        Original Text
                                                    </th>
                                                    <th style={{ width: "33%", borderBottom: "1px solid #ccc", padding: "10px" }}>
                                                        Names
                                                    </th>
                                                    <th style={{ width: "33%", borderBottom: "1px solid #ccc", padding: "10px" }}>
                                                        Redacted Text
                                                    </th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {redactedTableData.map((row, index) => (
                                                    <tr key={index}>
                                                        <td style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
                                                            {row.original_text}
                                                        </td>
                                                        <td style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
                                                            {row.names}
                                                        </td>
                                                        <td style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
                                                            {row.redacted_text}
                                                        </td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    } />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
