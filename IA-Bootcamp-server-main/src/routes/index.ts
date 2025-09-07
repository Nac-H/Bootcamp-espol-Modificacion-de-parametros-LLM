import express from 'express';
import { CompletionController } from '@/controllers/CompletionController';

const router = express.Router();
const completionController = new CompletionController();


router.post("/api/completion", async (req, res) => {
  const { input, messages, params } = req.body || {}
  
  if (!input || typeof input !== "string" || !input.trim()) {
    return res.status(400).json({ error: "input vacío" })
  }


})