import { describe, it, expect, vi } from "vitest";
import { CompletionController } from "../controllers/CompletionController.js";
describe("CompletionController", () => {
    const controller = new CompletionController();
    describe("completion", () => {
        it("should handle valid completion request", async () => {
            const mockReq = {
                body: { input: "Hello, world!" }
            };
            const mockRes = {
                json: vi.fn(),
                status: vi.fn().mockReturnThis()
            };
            await controller.completion(mockReq, mockRes);
            expect(mockRes.json).toHaveBeenCalledWith({
                content: "Echo: Hello, world! (This is a mock response - LLM service not implemented yet)"
            });
        });
        it("should handle invalid request body", async () => {
            const mockReq = {
                body: {}
            };
            const mockRes = {
                json: vi.fn(),
                status: vi.fn().mockReturnThis()
            };
            await controller.completion(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                error: "Invalid request body"
            }));
        });
        it("should handle empty input", async () => {
            const mockReq = {
                body: { input: "" }
            };
            const mockRes = {
                json: vi.fn(),
                status: vi.fn().mockReturnThis()
            };
            await controller.completion(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(400);
        });
    });
});
//# sourceMappingURL=CompletionController.test.js.map
