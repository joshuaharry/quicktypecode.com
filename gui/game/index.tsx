import React from "react";
import GameContext from "./GameContext";
import GameShell from "./GameShell";
import GameControls from "./GameControls";
import GameSubmit from "./GameSubmit";

const Game: React.FC = () => {
  return (
    <GameContext>
      <GameControls />
      <GameShell />
      <GameSubmit />
    </GameContext>
  );
};

export default Game;
