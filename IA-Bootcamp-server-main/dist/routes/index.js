import express from "express";
import { CompletionController } from "../controllers/CompletionController.js";
const router = express.Router();
const completionController = new CompletionController();
router.post("/completion", (req, res) => {
    completionController.completion(req, res);
});
export default router;
//# sourceMappingURL=index.js.map
