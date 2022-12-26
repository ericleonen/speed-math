import { useEffect, useRef } from "react";

const DrawingCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const context = canvasRef.getContext("2d");
    }, [])

    return (
        <div>
            <canvas ref={canvasRef} />
        </div>
    );
};

export default DrawingCanvas;