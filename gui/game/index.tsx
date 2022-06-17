import GameContext, { GameProps } from "./GameContext";
import GameShell from "./GameShell";

const Game: React.FC<GameProps> = (props) => {
  return (
    <GameContext {...props}>
      <GameShell />
    </GameContext>
  );
};

export default Game;
