import { describe, it, expect, vi } from 'vitest';
import { CompletionController } from '@/controllers/CompletionController';

describe('CompletionController', () => {
  const controller = new CompletionController();

  describe('completion', () => {
    it('should handle valid completion request', async () => {
      // Mock request and response
      const mockReq = {
        body: { input: 'Hello, world!' }
      } as any;

      const mockRes = {
        json: vi.fn(),
        status: vi.fn().mockReturnThis()
      } as any;

      await controller.completion(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        content: 'Echo: Hello, world! (This is a mock response - LLM service not implemented yet)'
      });
    });

    it('should handle invalid request body', async () => {
      const mockReq = {
        body: {} // Missing required 'input' field
      } as any;

      const mockRes = {
        json: vi.fn(),
        status: vi.fn().mockReturnThis()
      } as any;

      await controller.completion(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Invalid request body'
        })
      );
    });

    it('should handle empty input', async () => {
      const mockReq = {
        body: { input: '' }
      } as any;

      const mockRes = {
        json: vi.fn(),
        status: vi.fn().mockReturnThis()
      } as any;

      await controller.completion(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });
});
