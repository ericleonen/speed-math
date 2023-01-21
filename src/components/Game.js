import { useState, useEffect } from "react";
import axios from "axios";
import Loader from "./Loader";
import PreGame from "./PreGame";
import PostGame from "./PostGame";
import GameCountDown from "./GameCountDown";
import GamePlay from "./GamePlay";
import { n } from "../utils/game";

const Game = () => {
    const [problems, setProblems] = useState([]);
    const [currentProblem, setCurrentProblem] = useState(0);
    const [currentGuess, setCurrentGuess] = useState(-1);
    const [time, setTime] = useState(0);
    const [gameStart, setGameStart] = useState(false);
    const [gameDone, setGameDone] = useState(false);
    const [gameCountdown, setGameCountDown] = useState(3);

    const resetGame = () => {
      setProblems([]);
      setCurrentProblem(0);
      setCurrentGuess(-1);
      setTime(0);
      setGameStart(false);
      setGameDone(false);
      setGameCountDown(3);
    };
    
    useEffect(() => {
      let interval;

      if (gameStart && gameCountdown > 0) {
        interval = setInterval(() => {
          setGameCountDown((cd) => cd - 1);
        }, 1000);
      }
      else {
        clearInterval(interval);
      }

      return () => clearInterval(interval);
    }, [gameStart, gameCountdown]);

    useEffect(() => {
      let interval;

      if (gameCountdown === 0 && !gameDone) {
        interval = setInterval(() => {
          setTime((time) => time + 10);
        }, 10);
      }
      else {
        clearInterval(interval);
      }

      return () => clearInterval(interval);
    }, [gameCountdown, gameDone]);

    useEffect(() => {
      if (problems.length === 0) {
        axios
          .get("http://localhost:5000/mathProblems/" + n)
          .then(res => {
          setProblems(res.data);
          });
      }
    }, [setProblems, problems]);

    useEffect(() => {
      if (problems.length && currentProblem >= problems.length) {
        setGameDone(true);
      }
    }, [problems, currentProblem]);

    if (!gameStart) {
      return <PreGame 
                startGame={() => setGameStart(true)} 
              />
    }
    else if (problems.length) {
        if (gameCountdown > 0) {
          return <GameCountDown 
                  gameCountdown={gameCountdown} 
                  />;
        }
        else if (!gameDone) {
          return <GamePlay 
                    problems={problems} 
                    currentGuess={currentGuess}
                    setCurrentGuess={setCurrentGuess}
                    currentProblem={currentProblem}
                    setCurrentProblem={setCurrentProblem}
                    time={time} 
                  />;
        }
        else {
          return <PostGame 
                    resetGame={resetGame} 
                    time={time}
                  />;
        }
      }
      return <Loader />;
};

export default Game;