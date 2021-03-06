import { init, reduce, scoreGame, Game, isInProgress } from "./gameLogic";
import { tokenize } from "./tokenize";

const TEST_CODE = `def hello
  puts "Hello, world!"
end`;

const EXAMPLE: Game = {
  ...init,
  code: TEST_CODE,
  tokens: tokenize(TEST_CODE, "RUBY"),
};

const simulateTyping = (characters: string): Game => {
  return characters.split("").reduce(
    (acc, el) =>
      reduce(acc, {
        type: "USER_TYPED",
        payload: {
          character: el,
          time: Number.isNaN(acc.lastTyped) ? 1 : acc.lastTyped + 1,
        },
      }),
    EXAMPLE
  );
};

describe("Determining if the game is in progress", () => {
  test("Works on our initial state", () => {
    expect(isInProgress(init)).toBe(false);
  });
  test("Works on state in progress", () => {
    const res = simulateTyping("def");
    expect(isInProgress(res)).toBe(true);
  });
});

describe("Scoring the game", () => {
  test("Works on a simple example with no indents", () => {
    const game: Game = {
      ...init,
      gameFinished: true,
      code: "abcde",
      startedTyping: 0,
      lastTyped: 60_000,
    };
    expect(scoreGame(game)).toEqual(1);
  });
  test("Works when there are indents", () => {
    const game: Game = {
      ...init,
      gameFinished: true,
      code: "a\n  bcd",
      startedTyping: 0,
      lastTyped: 60_000,
    };
    expect(scoreGame(game)).toEqual(1);
  });
});

describe("Our reducer", () => {
  test("We can go into loading mode", () => {
    const first = reduce(init, { type: "FETCHING_NEW_GAME" });
    expect(first.loadingNewGame).toBe(true);
  });
  test("While we are in loading mode, we can't update the game", () => {
    const first = reduce(EXAMPLE, { type: "FETCHING_NEW_GAME" });
    const second = reduce(first, {
      payload: { character: "d", time: first.lastTyped + 1 },
      type: "USER_TYPED",
    });
    expect(second.currentCharacter).toBe(0);
  });
  test("We can cancel loading mode", () => {
    const first = reduce(init, { type: 'CANCEL_FETCH' });
    expect(first.loadingNewGame).toBe(false);
  });
  test("We can populate a new game after fetching one", () => {
    const first = reduce(EXAMPLE, { type: "FETCHING_NEW_GAME" });
    const second = reduce(first, {
      type: "INITIALIZE_NEW_GAME",
      payload: {
        code: 'puts "Hi!"',
        id: 2,
        language: "RUBY",
      },
    });
    expect(second.code).toEqual('puts "Hi!"');
    expect(second.id).toEqual(2);
    expect(second.language).toEqual("RUBY");
    expect(second.tokens).toEqual(tokenize('puts "Hi!"', "RUBY"));
    expect(second.loadingNewGame).toBe(false);
  });
  test("We reset all of the state once we fetch a new game", () => {
    const first = simulateTyping(TEST_CODE + "\n");
    const res = reduce(first, {
      type: "INITIALIZE_NEW_GAME",
      payload: {
        code: 'puts "Hi!"',
        id: 2,
        language: "RUBY",
      },
    });
    expect(res.currentCharacter).toBe(0);
    expect(res.currentLine).toBe(0);
    expect(res.currentToken).toBe(0);
    expect(Number.isNaN(res.lastTyped)).toBe(true);
    expect(Number.isNaN(res.startedTyping)).toBe(true);
    expect(res.gameFinished).toBe(false);
  });
  test("If the user hasn't typed yet, the cursor is lit", () => {
    const first = reduce(init, { type: "BLINK_REQUEST", payload: 0 });
    expect(first.cursorIsLit).toBe(true);
  });
  test("If the gap between when the user last typed and now is too small, we keep the cursor lit.", () => {
    const withTyped = { ...init, startedTyping: 30, lastTyped: 50 };
    const res = reduce(withTyped, { type: "BLINK_REQUEST", payload: 51 });
    expect(res.cursorIsLit).toBe(true);
  });
  test("If the gap between when the user last typed and now is big enough, we keep toggle.", () => {
    const withTyped = { ...EXAMPLE, lastTyped: 50, startedTyping: 0 };
    const first = reduce(withTyped, { type: "BLINK_REQUEST", payload: 100000 });
    expect(first.cursorIsLit).toBe(false);
    const second = reduce(first, { type: "BLINK_REQUEST", payload: 100000 });
    expect(second.cursorIsLit).toBe(true);
  });
  test("Typing causes the cursor to be lit", () => {
    const first = reduce(
      { ...EXAMPLE, cursorIsLit: false },
      { type: "USER_TYPED", payload: { character: "c", time: 1000 } }
    );
    expect(first.cursorIsLit).toBe(true);
  });
  test("Typing does nothing if we're loading a new game", () => {
    const first = reduce(
      { ...EXAMPLE, cursorIsLit: true, loadingNewGame: true },
      { type: "USER_TYPED", payload: { character: "c", time: 1000 } }
    );
    expect(first.cursorIsLit).toBe(true);
  });
  test("Typing updates lastTyped", () => {
    const res = reduce(EXAMPLE, {
      type: "USER_TYPED",
      payload: { character: "c", time: 0 },
    });
    expect(res.lastTyped).toBe(0);
  });
  test("Typing updates the started typing time if we haven't typed before", () => {
    const res = reduce(EXAMPLE, {
      type: "USER_TYPED",
      payload: { character: "c", time: 0 },
    });
    expect(res.startedTyping).toBe(0);
  });
  test("Typing does nothing if the character isn't correct", () => {
    const res = reduce(EXAMPLE, {
      type: "USER_TYPED",
      payload: { character: "q", time: 0 },
    });
    expect(res.currentLine).toEqual(0);
    expect(res.currentToken).toEqual(0);
    expect(res.currentCharacter).toEqual(0);
  });
  test("We advance the character by one if the character is correct", () => {
    const res = simulateTyping("d");
    expect(res.currentCharacter).toBe(1);
  });
  test("We advance the token after we get to the end of some words", () => {
    const res = simulateTyping("def");
    expect(res.currentCharacter).toBe(0);
    expect(res.currentToken).toBe(1);
    expect(res.currentLine).toBe(0);
  });
  test("We advance the line after we get to the end of the line", () => {
    const res = simulateTyping("def hello\n");
    expect(res.currentCharacter).toBe(0);
    expect(res.currentToken).toBe(1); // We skip the whitespace at the beginning of the line
    expect(res.currentLine).toBe(1);
  });
  test("We can get further along in the second line", () => {
    const res = simulateTyping("def hello\nput");
    expect(res.currentCharacter).toBe(3);
    expect(res.currentToken).toBe(1); // We skip the whitespace at the beginning of the line
    expect(res.currentLine).toBe(1);
  });
  test("When we get to the end and hit return, gameFinished becomes true", () => {
    const res = simulateTyping(TEST_CODE + "\n");
    expect(res.gameFinished).toBe(true);
  });
  test("Typing after the game finishes does nothing else", () => {
    const first = simulateTyping(TEST_CODE);
    const second = reduce(first, {
      payload: { character: "q", time: first.lastTyped + 1 },
      type: "USER_TYPED",
    });
    expect(second.currentCharacter).toEqual(first.currentCharacter);
    expect(second.currentLine).toEqual(first.currentLine);
    expect(second.currentToken).toEqual(second.currentToken);
  });
});
