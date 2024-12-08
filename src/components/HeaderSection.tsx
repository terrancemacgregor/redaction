import React from "react";

const HeaderSection: React.FC = () => {
    return (
        <header style={{ textAlign: "center", margin: "0px 0" }}>
            <h1>Redaction App</h1>
            <p style={{ margin: "0 auto", padding: "10px 20px", maxWidth: "800px" }}>
                The application is a redaction engine designed to allow users to upload PDF files, extract, and redact.
            </p>
        </header>
    );
};

export default HeaderSection;
