import { render } from "../testUtils";
import GameContext from "./GameContext";
import GameShell from "./GameShell";

describe("Our game shell", () => {
  test("Renders without carashing", () => {
    render(
      <GameContext code="" language="RUBY">
        <GameShell />
      </GameContext>
    );
  });
});
