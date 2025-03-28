import React from "react";
import "./App.css";
import { GameProvider } from "./context/GameContext";
import GameDirectory from "./components/GameDirectory";

// App component that provides the context
function App() {
  return (
    <GameProvider>
      <GameDirectory />
    </GameProvider>
  );
}

export default App;
