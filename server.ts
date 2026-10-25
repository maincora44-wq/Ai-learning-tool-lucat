import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '2mb' }));

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// AI Coach endpoint (PRD Section 7)
app.post('/api/coach', async (req: Request, res: Response) => {
  try {
    const { mode, message, lessonContext, history } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(503).json({
        success: false,
        fallback: true,
        error: 'Gemini API key is not configured on the server. Offline deterministic tutor fallback active.',
      });
      return;
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemInstruction = `You are the AI Learning OS Master Teacher & Implementation Coach.
You guide learners in mastering AI (ChatGPT, Microsoft 365 AI, Gemini) across diverse high-impact domains:
1. 📈 Investment & Equity Research (Financial statements, 10-K parsing, DCF valuation, earnings calls, moat analysis)
2. 🌐 Macro Economics & Market Intelligence (FOMC & Fed rate decisions, inflation CPI/PCE, currency exchange dynamics, economic scenarios)
3. 💬 Global Business English & High-Stakes Communication (C-level executive memos, cross-border investor pitch decks, international contract negotiation, native speaker nuance refinement)
4. ⚖️ Accounting & Internal Controls (ICFR, audit trail integrity, reconciliations)
5. 🚀 Universal AI Architecture (Tools → Workflows → Automation → Agents → Systems)

Your Pedagogical Framework:
- Teach with step-by-step clarity: [Problem] → [Mental Model / Architecture] → [Tool / Context Grounding] → [Practical Prompt / Script] → [Verification / Edge Cases] → [Next Level Action].
- Emphasize real tools over vague text: Explain when to use Python Code Interpreter for deterministic math, when to use RAG connectors, when to chain prompts, and when to deploy multi-agent debate.
- Distinguish:
  * Sourced Fact vs. Assumption vs. Interpretation vs. Actionable Suggestion.
- When coaching Business English, provide high-level professional vocabulary (Collocations, idiomatic executive English) and explain subtle tone differences (Formal vs. Assertive vs. Collaborative).
- Always include:
  1) Clear, pragmatic, high-quality answer.
  2) [한국어 핵심 요약] (Concise Korean executive summary).
  3) 3–4 Key Global Business English expressions with Korean meanings and real usage context.
- Safety & Integrity: Reject real credentials, confidential trade secrets, or unapproved uploads. Advise synthetic substitutes. Never make speculative financial guarantees without explicit caveats.

Current Coach Mode: ${mode || 'explain'}.
Current Lesson Context: ${lessonContext ? JSON.stringify(lessonContext) : 'None'}.`;

    // Construct conversation context if previous messages exist
    let promptText = message;
    if (Array.isArray(history) && history.length > 0) {
      const recentHistory = history.slice(-4).map((h: { role: string; content: string }) => `${h.role === 'user' ? 'Learner' : 'Coach'}: ${h.content}`).join('\n');
      promptText = `Conversation History:\n${recentHistory}\n\nLearner: ${message}`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || 'No response generated.';

    res.json({
      success: true,
      reply: replyText,
      source: 'gemini-3.8-flash',
      mode,
    });
  } catch (error: any) {
    console.error('Error in /api/coach:', error?.message || error);
    res.status(500).json({
      success: false,
      fallback: true,
      error: error?.message || 'Error communicating with Gemini service. Falling back to offline guide.',
    });
  }
});

// Mount Vite or static serving
async function setupServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Learning OS server running on http://0.0.0.0:${PORT} (${isProduction ? 'production' : 'development'})`);
  });
}

setupServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
