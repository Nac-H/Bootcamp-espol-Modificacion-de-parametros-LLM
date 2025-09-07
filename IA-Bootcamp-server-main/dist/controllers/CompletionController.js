import { LLMChatRequestSchema } from "../types/completion.js";
import { createLogger } from "../utils/logger.js";
import { createChatPrediction } from "../Models/chat.js";
const logger = createLogger(import.meta.url);
export class CompletionController {
    async completion(req, res) {
        try {
            logger.info("Received completion request");
            const validationResult = LLMChatRequestSchema.safeParse(req.body);
            if (!validationResult.success) {
                logger.warn("Invalid request body", validationResult.error.errors);
                res.status(400).json({
                    error: "Invalid request body",
                    details: validationResult.error.errors,
                });
                return;
            }
            const { input, params, messages } = validationResult.data;
            logger.info(`Processing input: ${input.substring(0, 100)}...`);
            const content = await createChatPrediction({ input, params, messages });
            logger.info("Completion request processed successfully");
            res.json({ content });
        }
        catch (error) {
            logger.error("Error in completion endpoint:", error);
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
            res.status(500).json({
                error: "Internal server error",
                message: errorMessage,
            });
        }
    }
}
//# sourceMappingURL=CompletionController.js.map
