import { render } from '../testUtils';
import TitleBar from './TitleBar';

describe("Our titlebar component", () => {
  test("Can render without crashing", () => {
    render(<TitleBar />);
  });
});
