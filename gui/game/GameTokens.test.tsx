import { render } from "../testUtils";
import GameContext from "./GameContext";
import GameTokens, { splitAtNum } from "./GameTokens";

describe("Splitting a token at a number", () => {
  test("Works with def", () => {});
  test("Works with printf", () => {});
});

describe("Our game shell", () => {
  test("Renders without carashing", () => {
    render(
      <GameContext code={'puts "hello"'} language="RUBY">
        <GameTokens />
      </GameContext>
    );
  });
});
