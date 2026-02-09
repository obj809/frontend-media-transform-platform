import { render } from '@testing-library/react';
import { Header } from './Header';

describe('Header', () => {
  it('renders the header', () => {
    const { container } = render(<Header />);
    expect(container.querySelector('.header')).toBeInTheDocument();
  });
});
