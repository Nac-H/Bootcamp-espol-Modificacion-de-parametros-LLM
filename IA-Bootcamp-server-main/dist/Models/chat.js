import { Chat } from "@lmstudio/sdk";
import model from "../Models/Client.js";
export async function createChatPrediction({ input, params, messages }) {
    const chat = Chat.empty();
    chat.append("system", "You are a resident AI philosopher.");
    for (const m of messages) {
        chat.append(m.role, m.content);
    }
    chat.append("user", input);
    const { temperature, top_p, top_k } = params;
    const opts = {
        ...(temperature !== undefined && { temperature }),
        ...(top_p !== undefined && { topP: top_p }),
        ...(top_k !== undefined && { topK: top_k }),
    };
    const prediction = model.respond(chat);
    let fullText = "";
    for await (const { content } of prediction) {
        process.stdout.write(content);
        fullText += content;
    }
    return fullText;
}
//# sourceMappingURL=chat.js.map
