import { init, reduce } from './gameLogic';

describe("Our reducer", () => {
  test("Works when you're initializing a game", () => {
    const language = 'ruby';
    const code = 'def hello; "Hello!" end'
    const res = reduce(init, { type: 'INITIALIZE_GAME', payload: { language, code }})
    expect(res.language).toBe(language);
    expect(res.code).toBe(code);
  });
});
