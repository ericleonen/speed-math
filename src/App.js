import "./App.css";
import Game from "./components/Game";

const App = () => {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-gray-100">
      <Game />
    </div>
  );
};

export default App;