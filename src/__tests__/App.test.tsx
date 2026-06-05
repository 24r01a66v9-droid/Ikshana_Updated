import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  test('renders navbar with IKSHANA text', () => {
    render(<App />);
    const name = screen.getByText(/IKSHANA/i);
    expect(name).toBeInTheDocument();
  });
});
