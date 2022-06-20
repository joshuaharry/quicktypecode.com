import { useGame } from "./GameContext";
import { scoreGame } from "./gameLogic";

const Score = () => {
  const game = useGame();
  const { gameFinished } = game;
  if (!gameFinished) return null;
  return (
    <h1>
      You typed{" "}
      <span className="font-extrabold">{Math.floor(scoreGame(game))}</span>{" "}
      tokens per minute. Good job!
    </h1>
  );
};

const GameSubmit = () => {
  return (
    <div className="flex flex-col items-center w-96 py-2">
      <Score />
    </div>
  );
};

export default GameSubmit;
