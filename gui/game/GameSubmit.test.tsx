import { render } from "../testUtils";
import GameContext from "./GameContext";
import GameSubmit from "./GameSubmit";

describe("Our game shell", () => {
  test("Renders without carashing", () => {
    render(
      <GameContext>
        <GameSubmit />
      </GameContext>
    );
  });
});
