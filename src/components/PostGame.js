import { getMilliseconds, getSeconds } from "../utils/time";
import { n } from "../utils/game";

const PostGame = ({ resetGame, time }) => {
    return (
        <div className="flex flex-col p-8 bg-white shadow-lg w-min rounded-xl">
          <p className="w-[300px] text-lg">
            It took you {getSeconds(time)}:{getMilliseconds(time)}s to complete {n} math problems.
          </p>
          <button 
            onClick={resetGame}
            className="w-full py-2 mt-5 bg-gray-200 hover:bg-gray-300 rounded-xl"
          >
              Play again
            </button>
        </div>
    );
};

export default PostGame;