import { checkHealth, uploadFile } from './api';

global.fetch = jest.fn();

describe('API Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('checkHealth', () => {
    it('returns true when backend is healthy', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

      const result = await checkHealth();

      expect(result).toBe(true);
      expect(fetch).toHaveBeenCalledWith('http://localhost:8000/health');
    });

    it('returns false when backend is unhealthy', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

      const result = await checkHealth();

      expect(result).toBe(false);
    });

    it('returns false when fetch throws', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await checkHealth();

      expect(result).toBe(false);
    });
  });

  describe('uploadFile', () => {
    it('uploads file successfully', async () => {
      const mockResponse = {
        filename: 'test.jpg',
        size: 1024,
        content_type: 'image/jpeg',
        status: 'uploaded',
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const result = await uploadFile(file);

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/upload',
        expect.objectContaining({
          method: 'POST',
        })
      );
    });

    it('throws error on upload failure', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ detail: 'File too large' }),
      });

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      await expect(uploadFile(file)).rejects.toThrow('File too large');
    });
  });
});
