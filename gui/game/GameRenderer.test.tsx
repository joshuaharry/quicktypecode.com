import { render } from "../testUtils";
import GameContext from "./GameContext";
import GameRenderer from "./GameRenderer";

describe("Our game renderer", () => {
  test("Can be rendered without crashing", () => {
    render(
      <GameContext language="ruby" code="puts 'Hello!'">
        <GameRenderer />
      </GameContext>
    );
  });
});
