import { render } from '../testUtils';
import Spinner from './Spinner';

describe("Our titlebar component", () => {
  test("Can render without crashing", () => {
    render(<Spinner />);
  });
});
