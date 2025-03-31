import { BrowserRouter as Router } from "react-router-dom";
import React from "react";
import "./App.css";
import { GameProvider } from "./context/GameContext";
// import GameDirectory from "./components/GameDirectory";
import GameList from "./components/GameList";
import Sidebar from "./components/Sidebar";

// App component that provides the context
function App() {
  return (
    <Router>
      <GameProvider>
        <div className="flex min-h-screen bg-gray-900 text-white">
          <Sidebar />
          <main className="flex-1 p-6">
            {/* <h1 className="text-3xl font-bold mb-6">Game Directory</h1> */}
            <GameList />
          </main>
        </div>
      </GameProvider>
    </Router>
  );
}

export default App;
