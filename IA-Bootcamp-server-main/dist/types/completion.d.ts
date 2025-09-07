import { z } from 'zod';
export declare const CompletionRequestSchema: z.ZodObject<{
    input: z.ZodString;
}, "strip", z.ZodTypeAny, {
    input: string;
}, {
    input: string;
}>;
export type CompletionRequest = z.infer<typeof CompletionRequestSchema>;
export declare const CompletionResponseSchema: z.ZodObject<{
    content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    content: string;
}, {
    content: string;
}>;
export type CompletionResponse = z.infer<typeof CompletionResponseSchema>;
export declare const ChatMessageSchema: z.ZodObject<{
    role: z.ZodEnum<["system", "user", "assistant"]>;
    content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    content: string;
    role: "system" | "user" | "assistant";
}, {
    content: string;
    role: "system" | "user" | "assistant";
}>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export declare const ParamsSchema: z.ZodEffects<z.ZodObject<{
    temperature: z.ZodOptional<z.ZodNumber>;
    top_p: z.ZodOptional<z.ZodNumber>;
    top_k: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    temperature?: number | undefined;
    top_p?: number | undefined;
    top_k?: number | undefined;
}, {
    temperature?: number | undefined;
    top_p?: number | undefined;
    top_k?: number | undefined;
}>, {
    temperature?: number | undefined;
    top_p?: number | undefined;
    top_k?: number | undefined;
}, {
    temperature?: number | undefined;
    top_p?: number | undefined;
    top_k?: number | undefined;
}>;
export type Params = z.infer<typeof ParamsSchema>;
export declare const LLMChatRequestSchema: z.ZodObject<{
    input: z.ZodString;
    params: z.ZodDefault<z.ZodEffects<z.ZodObject<{
        temperature: z.ZodOptional<z.ZodNumber>;
        top_p: z.ZodOptional<z.ZodNumber>;
        top_k: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        temperature?: number | undefined;
        top_p?: number | undefined;
        top_k?: number | undefined;
    }, {
        temperature?: number | undefined;
        top_p?: number | undefined;
        top_k?: number | undefined;
    }>, {
        temperature?: number | undefined;
        top_p?: number | undefined;
        top_k?: number | undefined;
    }, {
        temperature?: number | undefined;
        top_p?: number | undefined;
        top_k?: number | undefined;
    }>>;
    messages: z.ZodArray<z.ZodObject<{
        role: z.ZodEnum<["system", "user", "assistant"]>;
        content: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        content: string;
        role: "system" | "user" | "assistant";
    }, {
        content: string;
        role: "system" | "user" | "assistant";
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    input: string;
    params: {
        temperature?: number | undefined;
        top_p?: number | undefined;
        top_k?: number | undefined;
    };
    messages: {
        content: string;
        role: "system" | "user" | "assistant";
    }[];
}, {
    input: string;
    messages: {
        content: string;
        role: "system" | "user" | "assistant";
    }[];
    params?: {
        temperature?: number | undefined;
        top_p?: number | undefined;
        top_k?: number | undefined;
    } | undefined;
}>;
export type LLMChatRequest = z.infer<typeof LLMChatRequestSchema>;
//# sourceMappingURL=completion.d.ts.map