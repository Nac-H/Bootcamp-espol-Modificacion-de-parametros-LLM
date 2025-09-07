declare const getAppConfig: () => {
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
};
export default getAppConfig;
//# sourceMappingURL=index.d.ts.map