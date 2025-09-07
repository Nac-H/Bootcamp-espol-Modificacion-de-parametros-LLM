import { z } from 'zod';
export declare const EnvironmentSchema: z.ZodObject<{
    PORT: z.ZodDefault<z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>>;
    NODE_ENV: z.ZodDefault<z.ZodEnum<["development", "production", "test"]>>;
    LOG_LEVEL: z.ZodDefault<z.ZodEnum<["error", "warn", "info", "debug"]>>;
    SERVER_OPENAI_API_KEY: z.ZodOptional<z.ZodString>;
    SERVER_OPENAI_PROJECT_ID: z.ZodOptional<z.ZodString>;
    SERVER_OPENAI_MODEL: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    SERVER_OPENAI_BASE_URL: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    SERVER_OPENAI_TIMEOUT: z.ZodOptional<z.ZodDefault<z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>>>;
}, "strip", z.ZodTypeAny, {
    LOG_LEVEL: "info" | "error" | "warn" | "debug";
    NODE_ENV: "development" | "production" | "test";
    PORT: number;
    SERVER_OPENAI_API_KEY?: string | undefined;
    SERVER_OPENAI_PROJECT_ID?: string | undefined;
    SERVER_OPENAI_MODEL?: string | undefined;
    SERVER_OPENAI_BASE_URL?: string | undefined;
    SERVER_OPENAI_TIMEOUT?: number | undefined;
}, {
    LOG_LEVEL?: "info" | "error" | "warn" | "debug" | undefined;
    NODE_ENV?: "development" | "production" | "test" | undefined;
    PORT?: string | undefined;
    SERVER_OPENAI_API_KEY?: string | undefined;
    SERVER_OPENAI_PROJECT_ID?: string | undefined;
    SERVER_OPENAI_MODEL?: string | undefined;
    SERVER_OPENAI_BASE_URL?: string | undefined;
    SERVER_OPENAI_TIMEOUT?: string | undefined;
}>;
export type Environment = z.infer<typeof EnvironmentSchema>;
export declare const ServerConfigSchema: z.ZodObject<{
    port: z.ZodDefault<z.ZodNumber>;
    host: z.ZodDefault<z.ZodString>;
    nodeEnv: z.ZodDefault<z.ZodEnum<["development", "production", "test"]>>;
    logLevel: z.ZodDefault<z.ZodEnum<["error", "warn", "info", "debug"]>>;
    maxRequestSize: z.ZodDefault<z.ZodString>;
    corsOrigins: z.ZodDefault<z.ZodUnion<[z.ZodArray<z.ZodString, "many">, z.ZodLiteral<"*">]>>;
    healthCheckEnabled: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    port: number;
    host: string;
    nodeEnv: "development" | "production" | "test";
    logLevel: "info" | "error" | "warn" | "debug";
    maxRequestSize: string;
    corsOrigins: string[] | "*";
    healthCheckEnabled: boolean;
}, {
    port?: number | undefined;
    host?: string | undefined;
    nodeEnv?: "development" | "production" | "test" | undefined;
    logLevel?: "info" | "error" | "warn" | "debug" | undefined;
    maxRequestSize?: string | undefined;
    corsOrigins?: string[] | "*" | undefined;
    healthCheckEnabled?: boolean | undefined;
}>;
export type ServerConfig = z.infer<typeof ServerConfigSchema>;
export declare const OpenAIConfigSchema: z.ZodObject<{
    apiKey: z.ZodString;
    model: z.ZodDefault<z.ZodString>;
    baseURL: z.ZodDefault<z.ZodString>;
    timeout: z.ZodDefault<z.ZodNumber>;
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    apiKey: string;
    model: string;
    baseURL: string;
    timeout: number;
    projectId: string;
}, {
    apiKey: string;
    projectId: string;
    model?: string | undefined;
    baseURL?: string | undefined;
    timeout?: number | undefined;
}>;
export type OpenAIConfig = z.infer<typeof OpenAIConfigSchema>;
export declare const AppConfigSchema: z.ZodObject<{
    server: z.ZodObject<{
        port: z.ZodDefault<z.ZodNumber>;
        host: z.ZodDefault<z.ZodString>;
        nodeEnv: z.ZodDefault<z.ZodEnum<["development", "production", "test"]>>;
        logLevel: z.ZodDefault<z.ZodEnum<["error", "warn", "info", "debug"]>>;
        maxRequestSize: z.ZodDefault<z.ZodString>;
        corsOrigins: z.ZodDefault<z.ZodUnion<[z.ZodArray<z.ZodString, "many">, z.ZodLiteral<"*">]>>;
        healthCheckEnabled: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        port: number;
        host: string;
        nodeEnv: "development" | "production" | "test";
        logLevel: "info" | "error" | "warn" | "debug";
        maxRequestSize: string;
        corsOrigins: string[] | "*";
        healthCheckEnabled: boolean;
    }, {
        port?: number | undefined;
        host?: string | undefined;
        nodeEnv?: "development" | "production" | "test" | undefined;
        logLevel?: "info" | "error" | "warn" | "debug" | undefined;
        maxRequestSize?: string | undefined;
        corsOrigins?: string[] | "*" | undefined;
        healthCheckEnabled?: boolean | undefined;
    }>;
    openAI: z.ZodOptional<z.ZodObject<{
        apiKey: z.ZodString;
        model: z.ZodDefault<z.ZodString>;
        baseURL: z.ZodDefault<z.ZodString>;
        timeout: z.ZodDefault<z.ZodNumber>;
        projectId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        apiKey: string;
        model: string;
        baseURL: string;
        timeout: number;
        projectId: string;
    }, {
        apiKey: string;
        projectId: string;
        model?: string | undefined;
        baseURL?: string | undefined;
        timeout?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    server: {
        port: number;
        host: string;
        nodeEnv: "development" | "production" | "test";
        logLevel: "info" | "error" | "warn" | "debug";
        maxRequestSize: string;
        corsOrigins: string[] | "*";
        healthCheckEnabled: boolean;
    };
    openAI?: {
        apiKey: string;
        model: string;
        baseURL: string;
        timeout: number;
        projectId: string;
    } | undefined;
}, {
    server: {
        port?: number | undefined;
        host?: string | undefined;
        nodeEnv?: "development" | "production" | "test" | undefined;
        logLevel?: "info" | "error" | "warn" | "debug" | undefined;
        maxRequestSize?: string | undefined;
        corsOrigins?: string[] | "*" | undefined;
        healthCheckEnabled?: boolean | undefined;
    };
    openAI?: {
        apiKey: string;
        projectId: string;
        model?: string | undefined;
        baseURL?: string | undefined;
        timeout?: number | undefined;
    } | undefined;
}>;
export type AppConfig = z.infer<typeof AppConfigSchema>;
export declare const createConfigFromEnv: () => AppConfig;
//# sourceMappingURL=config.d.ts.map