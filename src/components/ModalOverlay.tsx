import React from "react";

interface ModalOverlayProps {
    isVisible: boolean;
    onClose: () => void;
    children: React.ReactNode; // Allows rendering anything inside the modal
}

const ModalOverlay: React.FC<ModalOverlayProps> = ({ isVisible, onClose, children }) => {
    if (!isVisible) return null; // Render nothing if the modal is not visible

    return (
        <>
            {/* Modal Content */}
            <div
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "white",
                    padding: "20px",
                    border: "1px solid #ccc",
                    zIndex: 1000,
                    width: "300px",
                }}
            >
                {children}
            </div>

            {/* Modal Background */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 999,
                }}
                onClick={onClose} // Close modal when background is clicked
            ></div>
        </>
    );
};

export default ModalOverlay;
