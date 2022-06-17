import React from "react";
import { useGame } from "./GameContext";

const GameTokens = () => {
  const game = useGame();
  return <div>{game.code}</div>;
};

export default GameTokens;
