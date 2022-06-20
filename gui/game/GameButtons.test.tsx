import { render } from "../testUtils";
import GameContext from "./GameContext";
import GameButtons from "./GameButtons";

describe("Our game shell", () => {
  test("Renders without carashing", () => {
    render(
      <GameContext code="" language="RUBY">
        <GameButtons />
      </GameContext>
    );
  });
});
