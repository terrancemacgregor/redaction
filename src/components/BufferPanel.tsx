import React, { useState } from "react";

interface BufferPanelProps {
    onRedact: (bufferSize: number) => void;
}

const BufferPanel: React.FC<BufferPanelProps> = ({ onRedact }) => {
    const [bufferSize, setBufferSize] = useState<number>(1);

    const handleBufferChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setBufferSize(parseInt(e.target.value, 10));
    };

    const handleStartRedacting = () => {
        onRedact(bufferSize);
    };

    return (
        <div style={{ textAlign: "center", marginTop: "20px", padding: "10px", border: "1px solid #ccc" }}>
    <label htmlFor="bufferSize">
        Select the buffer size:
        <select
            id="bufferSize"
    value={bufferSize}
    onChange={handleBufferChange}
    style={{ marginLeft: "10px", padding: "5px" }}
>
    <option value={1}>1</option>
        <option value={10}>10</option>
        <option value={100}>100</option>
        <option value={1000}>1000</option>
        </select>
        </label>
        <div style={{ marginTop: "10px" }}>
    <button
        style={{ padding: "10px 20px", fontSize: "1rem", cursor: "pointer" }}
    onClick={handleStartRedacting}
        >
        Start Redacting
    </button>
    </div>
    </div>
);
};

export default BufferPanel;
