import { render, screen } from '@testing-library/react';
import { Header } from './Header';

describe('Header', () => {
  it('renders the title', () => {
    render(<Header />);
    expect(screen.getByText('Media Transform')).toBeInTheDocument();
  });
});
