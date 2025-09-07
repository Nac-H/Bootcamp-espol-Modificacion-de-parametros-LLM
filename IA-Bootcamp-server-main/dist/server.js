import dotenv from "dotenv";
dotenv.config();
import { createApp } from "./app.js";
import getAppConfig from "./config/index.js";
import { createLogger } from "./utils/logger.js";
const logger = createLogger(import.meta.url);
logger.info("Starting LLM Server");
class LLMServer {
    app;
    constructor() {
        const appConfig = getAppConfig();
        logger.info(`Initializing LLM Server in ${appConfig.server.nodeEnv} mode`);
        this.app = createApp();
    }
    async start() {
        const appConfig = getAppConfig();
        const { port, host } = appConfig.server;
        try {
            this.app.listen(port, () => {
                logger.info(`🚀 LLM Server running on http://${host}:${port}`);
                logger.info(`📊 Health check available at http://${host}:${port}/health`);
                logger.info(`🔧 Status available at http://${host}:${port}/status`);
                logger.info(`⚡ Completion endpoint at http://${host}:${port}/api/completion`);
            });
        }
        catch (error) {
            logger.error("Error starting server:", error);
            throw error;
        }
    }
    async shutdown() {
        logger.info("Shutting down LLM Server...");
        logger.info("Server shut down completed");
    }
}
const server = new LLMServer();
process.on("SIGINT", async () => {
    logger.info("Received SIGINT signal");
    await server.shutdown();
    process.exit(0);
});
process.on("SIGTERM", async () => {
    logger.info("Received SIGTERM signal");
    await server.shutdown();
    process.exit(0);
});
server.start().catch((error) => {
    logger.error("Failed to start server:", error);
    process.exit(1);
});
//# sourceMappingURL=server.js.map
