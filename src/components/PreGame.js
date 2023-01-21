import { n } from "../utils/game";

const PreGame = ({ startGame }) => {
    return (
        <>
            <h1 className="mb-8 text-6xl font-bold">Speed Math</h1>
            <div className="flex flex-col p-8 bg-white shadow-lg w-min rounded-xl">
            <p className="w-[300px] text-lg">
                Solve the simple math problem on top and write your answer in the square below. Clear your answer with the "erase" button.
                <br /><br />
                <span className="font-bold">How fast can you complete {n} problems?</span>
            </p>
            <button 
                onClick={startGame}
                className="w-full py-2 mt-5 bg-gray-200 hover:bg-gray-300 rounded-xl"
            >
                Begin
                </button>
            </div>
        </>
    );
};

export default PreGame;