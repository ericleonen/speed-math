import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { drawLine } from "../utils/drawing";
import EraseButton from "./EraseButton";

const DrawingCanvas = ({ setCurrentProblem, setCurrentGuess, currentAnswer }) => {
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

    // handle touch draw
    const startTouchDraw = () => {
        setTouchDraw(true);
    }
    const onTouchDraw = ({touches}) => {
        if (touchDraw) {
            const { clientX, clientY } = touches[0];
            drawLine(context, prevTouch, [clientX, clientY], origin);
            setPrevTouch([clientX - origin[0], clientY - origin[1]]);
        }
    };
    const endTouchDraw = () => {
        if (touchDraw) {
            setTouchDraw(false);
            setPrevTouch(null);
    
            predict();
        }
    }

    // handle mouse draw
    const startDraw = () => {
        setDraw(true);
    };
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
    
            predict();
        }
    };

    const predict = async () => {
        const canvas = canvasRef.current;
        const dataURL = canvas.toDataURL();

        axios
            .post("http://localhost:5000/predict", {
                dataURL
            })
            .then(res => {
                setCurrentGuess(res.data.pred);

                if (currentAnswer === res.data.pred) {
                    clearDraw();
                    setCurrentProblem(prev => prev + 1);
                }
            });
    };

    const clearDraw = () => {
        context.reset();
        setCurrentGuess(-1);
    };

    return (
        <div className="flex flex-col">
            <canvas 
                ref={canvasRef}
                width="300"
                height="300"
                className="bg-white border-8 border-gray-300 touch-none rounded-xl"
                onMouseDown={startDraw}
                onMouseUp={endDraw}
                onMouseMove={onDraw}
                onMouseLeave={endDraw}

                onTouchStart={startTouchDraw}
                onTouchEnd={endTouchDraw}
                onTouchMove={onTouchDraw}
            />
            <EraseButton clearDraw={clearDraw} />
        </div>
    );
};

export default DrawingCanvas;