import { useEffect, useRef, useState } from "react";
import { drawLine } from "../utils/drawing";

const DrawingCanvas = () => {
    const [draw, setDraw] = useState(false);
    const [prevLoc, setPrevLoc] = useState(null);

    const [touchDraw, setTouchDraw] = useState(false);
    const [prevTouch, setPrevTouch] = useState(null);

    const [context, setContext] = useState();
    const [origin, setOrigin] = useState([]);

    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const canvasRect = canvas.getBoundingClientRect();

        setOrigin([canvasRect.left, canvasRect.top]);
        setContext(canvas.getContext("2d"));
    }, [canvasRef, setOrigin, setContext]);

    const onTouchDraw = ({touches}) => {
        const { clientX, clientY } = touches[0];
        drawLine(context, prevTouch, [clientX, clientY], origin);
        setPrevTouch([clientX - origin[0], clientY - origin[1]]);
    };

    const startTouchDraw = () => {
        setTouchDraw(true);
    }

    const endTouchDraw = () => {
        if (touchDraw) {
            setTouchDraw(false);
            setPrevTouch(null);
    
            logImageData();
        }
    }

    const onDraw = ({clientX, clientY}) => {
        if (draw) {
            drawLine(context, prevLoc, [clientX, clientY], origin);
            setPrevLoc([clientX - origin[0], clientY - origin[1]]);
        }
    };

    const endDraw = () => {
        if (draw) {
            setDraw(false);
            setPrevLoc(null);
    
            logImageData();
        }
    };

    const logImageData = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        const allData = context.getImageData(0, 0, canvas.width, canvas.height).data;
        const alphaData = [];

        for (let i = 3; i <= allData.length; i += 4) {
            alphaData.push(allData[i] / 255);
        }
        
        console.log(alphaData);
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