import { render } from "../testUtils";
import GameContext from "./GameContext";
import GameTokens, { splitAtNum } from "./GameTokens";

describe("Splitting a token at a number", () => {
  test("Works with def", () => {
    expect(splitAtNum("def", 0)).toEqual(["", "d", "ef"]);
    expect(splitAtNum("def", 1)).toEqual(["d", "e", "f"]);
    expect(splitAtNum("def", 2)).toEqual(["de", "f", ""]);
  });
  test("Works with printf", () => {
    expect(splitAtNum("printf", 0)).toEqual(["", "p", "rintf"]);
    expect(splitAtNum("printf", 1)).toEqual(["p", "r", "intf"]);
    expect(splitAtNum("printf", 2)).toEqual(["pr", "i", "ntf"]);
    expect(splitAtNum("printf", 3)).toEqual(["pri", "n", "tf"]);
    expect(splitAtNum("printf", 4)).toEqual(["prin", "t", "f"]);
    expect(splitAtNum("printf", 5)).toEqual(["print", "f", ""]);
  });
  test("Works with a single character", () => {
    expect(splitAtNum("f", 0)).toEqual(["", "f", ""]);
  });
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
