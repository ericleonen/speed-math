import { useRef, useState } from "react";

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

    const clearDraw = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        context.reset();
    }

    return (
        <div className="flex flex-col items-center p-2 bg-gray-300">
            <canvas 
                ref={canvasRef}
                width="300"
                height="300"
                className="border-4 border-gray-400 bg-white"
                onMouseDown={startDraw}
                onMouseUp={endDraw}
                onMouseMove={onDraw}
                onMouseLeave={endDraw}

                onTouchStart={startTouchDraw}
                onTouchEnd={endTouchDraw}
                onTouchMove={onTouchDraw}
            />
            <div className="mt-2 w-min rounded-sm overflow-hidden shadow-md border-[3px] border-gray-500">
                <button 
                    onClick={clearDraw}
                    className="bg-gray-400/80 text-white border-2 border-white px-10 py-1 text-4xl active:bg-gray-400"
                >
                    Erase
                </button>
            </div>
        </div>
    );
};

export default DrawingCanvas;