import "./App.css";
import DrawingCanvas from "./components/DrawingCanvas";

const App = () => {
  return (
    <div className="flex w-screen h-screen items-center justify-center">
      <DrawingCanvas />
    </div>
  );
};

export default App;