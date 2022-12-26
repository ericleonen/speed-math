import { useEffect, useRef, useState } from "react";

const DrawingCanvas = () => {
    const [draw, setDraw] = useState(false);
    const [prevLoc, setPrevLoc] = useState(null);

    const [touchDraw, setTouchDraw] = useState(false);
    const [prevTouch, setPrevTouch] = useState(null);

    const canvasRef = useRef(null);

    const onTouchDraw = ({touches}) => {
        if (touchDraw) {
            const canvas = canvasRef.current;
            const canvasRect = canvas.getBoundingClientRect();
            const origin = [canvasRect.left, canvasRect.top];

            const { clientX, clientY } = touches[0];

            if (prevTouch) {
                const context = canvas.getContext("2d");
                
                context.moveTo(prevTouch[0], prevTouch[1]);
                context.lineTo(clientX - origin[0], clientY - origin[1]);
                context.lineWidth = 5;
                context.stroke();
                context.closePath();
            }

            setPrevTouch([clientX - origin[0], clientY - origin[1]]);
        }
    };

    const startTouchDraw = () => {
        setTouchDraw(true);
    }

    const endTouchDraw = () => {
        setTouchDraw(false);
        setPrevTouch(null);
    }

    const onDraw = ({clientX, clientY}) => {
        if (draw) {
            const canvas = canvasRef.current;
            const canvasRect = canvas.getBoundingClientRect();
            const origin = [canvasRect.left, canvasRect.top];

            if (prevLoc) {
                const context = canvas.getContext("2d");
        
                context.moveTo(prevLoc[0], prevLoc[1]);
                context.lineTo(clientX - origin[0], clientY - origin[1]);
                context.lineWidth = 5;
                context.stroke();
                context.closePath();
            }
    
            setPrevLoc([clientX - origin[0], clientY - origin[1]]);
        }
    };

    const endDraw = () => {
        setDraw(false);
        setPrevLoc(null);
    };

    const startDraw = () => {
        setDraw(true);
    };

    return (
        <div>
            <canvas 
                ref={canvasRef}
                width="300"
                height="300"
                className="border-2 border-black"
                onMouseDown={startDraw}
                onMouseUp={endDraw}
                onMouseMove={onDraw}
                onMouseLeave={endDraw}

                onTouchStart={startTouchDraw}
                onTouchEnd={endTouchDraw}
                onTouchMove={onTouchDraw}
            />
        </div>
    );
};

export default DrawingCanvas;