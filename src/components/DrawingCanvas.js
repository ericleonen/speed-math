import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { drawLine, loadCanvasImage } from "../utils/drawing";

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
    }, [canvasRef, setOrigin, setContext, draw, touchDraw]);

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

    const logImageData = async () => {
        const canvas = canvasRef.current;
        const dataURL = canvas.toDataURL("image/png", 0.1);

        axios.post("http://localhost:5000/predict", {
            dataURL
        });

        // axios.post("http://localhost:5000/predict", );

        // const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        
        // let image = tf.browser.fromPixels(imageData);
        // image = tf.image.resizeBilinear(image, [28, 28])
        //     .sum(2)
        //     .expandDims(0)
        //     .expandDims(-1);

        // const pred = model.predict(image);

        // console.log(pred.argMax(1).dataSync());
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
                width="28"
                height="28"
                className="h-[300px] w-[300px] bg-white border-4 border-gray-400"
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
                    className="px-10 py-1 text-4xl text-white border-2 border-white bg-gray-400/80 active:bg-gray-400"
                >
                    Erase
                </button>
            </div>
        </div>
    );
};

export default DrawingCanvas;