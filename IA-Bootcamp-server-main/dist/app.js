import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import apiRoutes from "./routes/index.js";
import { createLogger } from "./utils/logger.js";
const logger = createLogger(import.meta.url);
export const createApp = () => {
    const app = express();
    app.use(helmet());
    app.use(cors());
    app.use(compression());
    app.use(morgan("combined", {
        stream: { write: (message) => logger.info(message.trim()) },
    }));
    app.use(express.json({ limit: "10mb" }));
    app.use(express.urlencoded({ extended: true }));
    app.get("/health", (req, res) => {
        res.json({
            status: "healthy",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        });
    });
    app.get("/status", (req, res) => {
        res.json({
            service: "llm-server",
            version: "1.0.0",
            environment: process.env.NODE_ENV || "development",
        });
    });
    app.use("/api", apiRoutes);
    app.use((error, req, res, next) => {
        logger.error("Unhandled error:", error);
        res.status(500).json({
            error: "Internal server error",
            message: process.env.NODE_ENV === "development"
                ? error.message
                : "Something went wrong",
        });
    });
    return app;
};
//# sourceMappingURL=app.js.map
