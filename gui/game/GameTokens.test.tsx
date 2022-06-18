import { render } from "../testUtils";
import GameContext from "./GameContext";
import GameTokens from "./GameTokens";

describe("Our game shell", () => {
  test("Renders without carashing", () => {
    render(
      <GameContext code="puts 'hello'" language="RUBY">
        <GameTokens />
      </GameContext>
    );
  });
});
