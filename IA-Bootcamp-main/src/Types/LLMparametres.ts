import { z } from "zod";

export const LLMparametres = z.object({ 
    model: z.string().min(1, "El modelo es requerido"),
    messages: z.array(z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1, "El contenido es requerido"),
    })).min(1, "Se requiere al menos un mensaje"),
    max_tokens: z.number().min(1, "Los tokens máximos deben ser al menos 1").optional(),
    temperature: z.number().min(0.1, "La temperatura debe ser al menos 0.1").max(1, "La temperatura debe ser como máximo 1").optional(),
    top_p: z.number().min(0.1, "top_p debe ser al menos 0.1").max(1, "top_p debe ser como máximo 1").optional(),
    top_k: z.number().min(1, "top_k debe ser al menos 1").optional(),
});

export type LLMparametresType = z.infer<typeof LLMparametres>;
