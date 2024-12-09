import React from "react";

interface NavBarProps {
    activeTab: number;
    setActiveTab: React.Dispatch<React.SetStateAction<number>>;
}

const NavBar: React.FC<NavBarProps> = ({ activeTab, setActiveTab }) => {
    return (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
    <button
        onClick={() => setActiveTab(0)}
    style={{
        padding: "10px 20px",
            fontSize: "1rem",
            cursor: "pointer",
            backgroundColor: activeTab === 0 ? "#007bff" : "#f1f1f1",
            color: activeTab === 0 ? "white" : "black",
            border: "1px solid #ccc",
            marginRight: "10px",
    }}
>
    PDF Content
    </button>
    <button
    onClick={() => setActiveTab(1)}
    style={{
        padding: "10px 20px",
            fontSize: "1rem",
            cursor: "pointer",
            backgroundColor: activeTab === 1 ? "#007bff" : "#f1f1f1",
            color: activeTab === 1 ? "white" : "black",
            border: "1px solid #ccc",
            marginRight: "10px",
    }}
>
    Redacted Output
    </button>
    <button
    onClick={() => setActiveTab(2)}
    style={{
        padding: "10px 20px",
            fontSize: "1rem",
            cursor: "pointer",
            backgroundColor: activeTab === 2 ? "#007bff" : "#f1f1f1",
            color: activeTab === 2 ? "white" : "black",
            border: "1px solid #ccc",
    }}
>
    Redacted Table
    </button>
    </div>
);
};

export default NavBar;
