import { init, reduce } from "./gameLogic";

describe("Our reducer", () => {
  test("Works when you're initializing a game", () => {
    const language = "PYTHON";
    const code = `def this_is_a_test(foo, bar):
    print("Hello, world!")
    print("Python is cool!")
    `;
    const res = reduce(init, {
      type: "INITIALIZE_GAME",
      payload: { language, code },
    });
    expect(res.language).toBe(language);
    expect(res.code).toBe(code);
  });
});
