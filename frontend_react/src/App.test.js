import { render, screen } from '@testing-library/react';
import App from './App';
import './i18n';

test('renders metal weight calculator heading', () => {
  window.history.pushState({}, 'Test', '/saiguru_industries/estimate');
  render(<App />);
  const heading = screen.getByRole('heading', { name: /metal weight calculator/i });
  expect(heading).toBeInTheDocument();
});
