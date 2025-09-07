import { z } from 'zod';
export const CompletionRequestSchema = z.object({
    input: z.string().min(1, 'Input is required'),
});
export const CompletionResponseSchema = z.object({
    content: z.string(),
});
export const ChatMessageSchema = z.object({
    role: z.enum(['system', 'user', 'assistant']),
    content: z.string(),
});
export const ParamsSchema = z.object({
    temperature: z
        .number({ invalid_type_error: "temperature debe ser numérico" })
        .min(0, "temperature mínimo 0")
        .max(2, "temperature máximo 2")
        .optional(),
    top_p: z
        .number({ invalid_type_error: "top_p debe ser numérico" })
        .min(0, "top_p mínimo 0")
        .max(1, "top_p máximo 1")
        .optional(),
    top_k: z
        .number({ invalid_type_error: "top_k debe ser numérico" })
        .int("top_k debe ser entero")
        .min(0, "top_k mínimo 0")
        .max(20, "top_k máximo 20")
        .optional(),
})
    .refine((p) => !(p.top_p !== undefined && p.top_k !== undefined), {
    message: "Usa solo top_p o top_k, no ambos.",
    path: ["top_p"],
});
export const LLMChatRequestSchema = z.object({
    input: z.string().min(1, "Debes escribir un mensaje"),
    params: ParamsSchema.default({}),
    messages: z.array(ChatMessageSchema).min(1, "Debe haber al menos un mensaje"),
});
//# sourceMappingURL=completion.js.map