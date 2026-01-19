import { render, screen } from '@testing-library/react';
import App from './App';

test('renders metal weight calculator heading', () => {
  render(<App />);
  const heading = screen.getByText(/metal weight calculator/i);
  expect(heading).toBeInTheDocument();
});
