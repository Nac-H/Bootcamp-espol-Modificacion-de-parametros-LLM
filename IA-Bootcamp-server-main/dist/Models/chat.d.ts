export declare function createChatPrediction({ input, params, messages }: {
    input: string;
    params: {
        temperature?: number;
        top_p?: number;
        top_k?: number;
    };
    messages: {
        role: 'system' | 'user' | 'assistant';
        content: string;
    }[];
}): Promise<string>;
//# sourceMappingURL=chat.d.ts.map