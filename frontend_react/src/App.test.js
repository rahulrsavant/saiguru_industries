import { render, screen } from '@testing-library/react';
import App from './App';

test('renders metal weight calculator heading', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { name: /metal weight calculator/i });
  expect(heading).toBeInTheDocument();
});
