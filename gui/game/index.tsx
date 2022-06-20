import React from "react";
import GameContext, { GameProps } from "./GameContext";
import GameShell from "./GameShell";
import GameButtons from './GameButtons'

const Game: React.FC<GameProps> = (props) => {
  return (
    <GameContext {...props}>
      <GameShell />
      <GameButtons />
    </GameContext>
  );
};

export default Game;
