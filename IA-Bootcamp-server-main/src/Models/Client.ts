import { LMStudioClient } from "@lmstudio/sdk";


const client = new LMStudioClient({
  baseUrl: "ws://127.0.0.1:4000",
});

const model = await client.llm.model("qwen2.5-7b-instruct");

export default model;



