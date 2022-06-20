import React from "react";
import GameContext, { GameProps } from "./GameContext";
import GameShell from "./GameShell";
import GameControls from './GameControls';
import GameSubmit from './GameSubmit'

const Game: React.FC<GameProps> = (props) => {
  return (
    <GameContext {...props}>
      <GameControls />
      <GameShell />
      <GameSubmit />
    </GameContext>
  );
};

export default Game;
