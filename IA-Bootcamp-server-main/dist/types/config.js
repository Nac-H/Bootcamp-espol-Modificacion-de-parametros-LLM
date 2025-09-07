import { z } from 'zod';
export const EnvironmentSchema = z.object({
    PORT: z
        .string()
        .transform((val) => parseInt(val, 10))
        .pipe(z.number().int().min(1).max(65535))
        .default('3000'),
    NODE_ENV: z
        .enum(['development', 'production', 'test'])
        .default('development'),
    LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
    SERVER_OPENAI_API_KEY: z.string().min(1, 'SERVER_OPENAI_API_KEY required').optional(),
    SERVER_OPENAI_PROJECT_ID: z.string().min(1, 'SERVER_OPENAI_PROJECT_ID required').optional(),
    SERVER_OPENAI_MODEL: z.string().default('gpt-3.5-turbo').optional(),
    SERVER_OPENAI_BASE_URL: z.string().url().default('https://api.openai.com/v1').optional(),
    SERVER_OPENAI_TIMEOUT: z
        .string()
        .transform((val) => parseInt(val, 10))
        .pipe(z.number().int().min(1000))
        .default('60000')
        .optional(),
});
export const ServerConfigSchema = z.object({
    port: z.number().int().min(1).max(65535).default(3000),
    host: z.string().default('localhost'),
    nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
    logLevel: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
    maxRequestSize: z.string().default('10mb'),
    corsOrigins: z.array(z.string()).or(z.literal('*')).default('*'),
    healthCheckEnabled: z.boolean().default(true),
});
export const OpenAIConfigSchema = z.object({
    apiKey: z.string().min(1, 'API key is required'),
    model: z.string().default('gpt-3.5-turbo'),
    baseURL: z.string().url().default('https://api.openai.com/v1'),
    timeout: z.number().int().min(1000).default(60000),
    projectId: z.string().min(1, 'Project ID is required'),
});
export const AppConfigSchema = z.object({
    server: ServerConfigSchema,
    openAI: OpenAIConfigSchema.optional(),
});
export const createConfigFromEnv = () => {
    const env = EnvironmentSchema.parse(process.env);
    const config = {
        server: {
            port: env.PORT,
            nodeEnv: env.NODE_ENV,
            logLevel: env.LOG_LEVEL,
            host: 'localhost',
            maxRequestSize: '10mb',
            corsOrigins: '*',
            healthCheckEnabled: true,
        },
    };
    return AppConfigSchema.parse(config);
};
//# sourceMappingURL=config.js.map