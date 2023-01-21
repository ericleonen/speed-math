import { getSeconds, getMilliseconds } from "../utils/time";
import DrawingCanvas from "./DrawingCanvas";

const GamePlay = ({ problems, currentProblem, currentGuess, setCurrentProblem, setCurrentGuess, time }) => {
    return currentProblem < problems.length && (
        <div className="flex flex-col items-center p-8 bg-gray-200 shadow-lg rounded-xl">
            <p className="mb-4 text-5xl font-semibold opacity-75">
                { problems[currentProblem].question }{currentGuess >= 0 ? currentGuess : ""}
            </p>
            <DrawingCanvas setCurrentProblem={setCurrentProblem} setCurrentGuess={setCurrentGuess} currentAnswer={problems[currentProblem].answer} />
            <div className="flex justify-between w-full px-4 mt-2 text-lg opacity-75">
                <p>Q: { currentProblem + 1 }/{ problems.length }</p>
                <p className="flex">
                <span>{ getSeconds(time) }</span>
                :
                <span className="w-5">{ getMilliseconds(time) }</span>
                s
                </p>
            </div>
        </div>
    );
};

export default GamePlay;