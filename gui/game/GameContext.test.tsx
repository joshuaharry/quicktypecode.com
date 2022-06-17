import { render } from "../testUtils";
import GameContext, { useGame, useDispatch } from "./GameContext";

describe("Our game context", () => {
  test("useGame throws if you use it outside of the game", () => {
    const originalErr = console.error;
    const silentErr = jest.fn();
    console.error = silentErr;
    try {
      const ShouldThrow = () => {
        useGame();
        return <h1>Hi!</h1>;
      };
      expect(() => render(<ShouldThrow />)).toThrow();
    } finally {
      console.error = originalErr;
    }
  });
  test("useDispatch throws if you use it outside of the game", () => {
    const originalErr = console.error;
    const silentErr = jest.fn();
    console.error = silentErr;
    try {
      const ShouldThrow = () => {
        useDispatch();
        return <h1>Hi!</h1>;
      };
      expect(() => render(<ShouldThrow />)).toThrow();
    } finally {
      console.error = originalErr;
    }
  });
  test("Both work if you're inside of the game", () => {
    const ShouldNotThrow = () => {
      useDispatch();
      useGame();
      return <h1>Hi!</h1>;
    };
    render(
      <GameContext language="" code="">
        <ShouldNotThrow />
      </GameContext>
    );
  });
});
