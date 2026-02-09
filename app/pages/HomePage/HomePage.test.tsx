import { render, screen, fireEvent, act } from '@testing-library/react';
import { HomePage } from './HomePage';

// Mock the API module
jest.mock('@/app/services/api', () => ({
  checkHealth: jest.fn().mockResolvedValue(true),
  uploadFile: jest.fn().mockResolvedValue({
    filename: 'test.jpg',
    size: 1024,
    content_type: 'image/jpeg',
    status: 'uploaded',
  }),
}));

describe('HomePage', () => {
  it('renders the upload area', async () => {
    await act(async () => {
      render(<HomePage />);
    });
    expect(screen.getByText('Drop file here or click to upload')).toBeInTheDocument();
  });

  it('renders the output area', async () => {
    await act(async () => {
      render(<HomePage />);
    });
    expect(screen.getByText('Processed file will appear here')).toBeInTheDocument();
  });

  it('shows file size limit info', async () => {
    await act(async () => {
      render(<HomePage />);
    });
    expect(screen.getByText('JPG only, max 25MB')).toBeInTheDocument();
  });

  it('shows error for non-JPG files', async () => {
    await act(async () => {
      render(<HomePage />);
    });

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;

    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    expect(screen.getByText('Only JPG files are allowed')).toBeInTheDocument();
  });

  it('shows error for files exceeding size limit', async () => {
    await act(async () => {
      render(<HomePage />);
    });

    const largeContent = new Array(26 * 1024 * 1024).fill('a').join('');
    const file = new File([largeContent], 'large.jpg', { type: 'image/jpeg' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;

    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    expect(screen.getByText('File size exceeds 25MB limit')).toBeInTheDocument();
  });

  it('displays selected file info', async () => {
    await act(async () => {
      render(<HomePage />);
    });

    const file = new File(['test content'], 'photo.jpg', { type: 'image/jpeg' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;

    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    expect(screen.getByText('photo.jpg')).toBeInTheDocument();
  });

  it('removes file when remove button is clicked', async () => {
    await act(async () => {
      render(<HomePage />);
    });

    const file = new File(['test content'], 'photo.jpg', { type: 'image/jpeg' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;

    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    expect(screen.getByText('photo.jpg')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText('Remove'));
    });

    expect(screen.getByText('Drop file here or click to upload')).toBeInTheDocument();
  });
});
