import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders the platform name', () => {
    render(<Footer status="connected" />);
    expect(screen.getByText('Media Transform Platform')).toBeInTheDocument();
  });

  it('shows connected status', () => {
    render(<Footer status="connected" />);
    expect(screen.getByText('Connected')).toBeInTheDocument();
  });

  it('shows offline status', () => {
    render(<Footer status="offline" />);
    expect(screen.getByText('Offline')).toBeInTheDocument();
  });

  it('shows checking status', () => {
    render(<Footer status="checking" />);
    expect(screen.getByText('Checking...')).toBeInTheDocument();
  });
});
