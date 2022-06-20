import { render } from "../testUtils";
import GameContext from "./GameContext";
import GameControls from "./GameControls";

describe("Our game shell", () => {
  test("Renders without carashing", () => {
    render(
      <GameContext>
        <GameControls />
      </GameContext>
    );
  });
});
