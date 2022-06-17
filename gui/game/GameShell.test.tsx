import { render } from '../testUtils';
import GameShell from './GameShell';

describe("Our game", () => {
  test("Renders without carashing", () => {
    render(<GameShell />);
  });
});
