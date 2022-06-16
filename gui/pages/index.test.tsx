import Index from "./index.page";
import { render } from "./testUtils";

describe("Our Index page", () => {
  test("Does not crash if we try to render it", () => {
    expect(() => render(<Index />)).not.toThrow();
  });
  test("Failures fail", () => {
    expect(3).toBe(2);
  });
});
