import Game from "./index";
import { render } from "../testUtils";

describe("Our game", () => {
  test("Can render without crashing", () => {
    render(<Game language="RUBY" code='puts "Hello!"' />);
  });
});
