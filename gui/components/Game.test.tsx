import { render } from '../testUtils';
import Game from './Game';

describe("Our game", () => {
  test("Renders without carashing", () => {
    render(<Game />);
  });
});
