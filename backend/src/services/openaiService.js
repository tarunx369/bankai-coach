import OpenAI from 'openai';
import 'dotenv/config';

// Groq exposes an OpenAI-compatible API with a free tier (no card required to
// start), so the same 'openai' SDK works — just pointed at Groq's base URL.
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});
const MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

async function chatText(system, user) {
  const res = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    temperature: 0.6,
  });
  return res.choices[0].message.content;
}

async function chatJSON(system, user) {
  const res = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: system + '\n\nRespond with raw JSON only — no markdown code fences, no commentary before or after.' },
      { role: 'user', content: user },
    ],
    temperature: 0.5,
    response_format: { type: 'json_object' },
  });
  const raw = res.choices[0].message.content.trim().replace(/^```(json)?/i, '').replace(/```$/, '').trim();
  return JSON.parse(raw);
}

// Module 3 — AI Lesson Generator
export async function generateLesson({ title, topics, track }) {
  const system = `You are an expert SBI PO / IBPS PO exam tutor. Write a complete, beginner-friendly lesson that gradually reaches SBI/IBPS Mains difficulty. Respond in clean Markdown with headings for: Introduction, Explanation, Examples, Real-life Examples, Important Facts, Exam Notes, Memory Tricks, Tables/Comparison Charts (use a Markdown table where useful), Common Mistakes, Frequently Asked Questions, Expected Questions, Previous Year Concepts, Quick Revision Notes, Summary, and Key Takeaways.`;
  const user = `Topic area: ${track === 'banking' ? 'Banking Awareness' : 'Computer Awareness'}\nLesson title: ${title}\nSub-topics to cover: ${topics.join(', ')}`;
  const markdown = await chatText(system, user);
  return { markdown };
}

// Module 4 — Mock Test Generator
export async function generateMockTest({ title, topics, track, count = 20 }) {
  const system = `You are an SBI PO / IBPS PO question setter. Generate exactly ${count} exam-quality multiple choice questions mixing difficulty (easy, medium, hard) and question types (MCQ, Statement Based, Assertion, Match the Following, Case Based, Current Affairs where relevant). Return strict JSON: {"questions":[{"question":"...","type":"MCQ","difficulty":"Easy|Medium|Hard","topic":"...","options":["A","B","C","D"],"correctIndex":0,"explanation":"short markdown explanation of the correct answer"}]}. Do not repeat questions. Randomize the position of the correct option.`;
  const user = `Topic area: ${track === 'banking' ? 'Banking Awareness' : 'Computer Awareness'}\nLesson: ${title}\nSub-topics: ${topics.join(', ')}`;
  const data = await chatJSON(system, user);
  return { questions: data.questions };
}

// Module 7 — Revision quiz (shorter, 10 questions)
export async function generateRevisionQuiz({ topics, count = 10 }) {
  const system = `You are an SBI PO / IBPS PO tutor creating a quick spaced-repetition revision quiz. Return strict JSON: {"questions":[{"question":"...","options":["A","B","C","D"],"correctIndex":0,"difficulty":"Medium","topic":"..."}]}. Generate exactly ${count} questions.`;
  const user = `Topics to revise: ${topics.join(', ')}`;
  const data = await chatJSON(system, user);
  return { questions: data.questions };
}

// Module 8 — Flashcards
export async function generateFlashcards({ title, topics }) {
  const system = `You generate exam flashcards for SBI PO / IBPS PO prep. Return strict JSON: {"cards":[{"question":"term or definition prompt","answer":"concise answer"}]}. Generate 12-16 cards covering definitions, important facts, and banking/computer terms.`;
  const user = `Lesson: ${title}\nSub-topics: ${topics.join(', ')}`;
  const data = await chatJSON(system, user);
  return { cards: data.cards };
}

// Module 9 — AI Doubt Solver
export async function answerDoubt({ question }) {
  const system = `You are an SBI PO / IBPS PO doubt-solving tutor. For the user's question, respond in Markdown with these sections: **Definition**, **Explanation**, **Example**, **Shortcut**, **Memory Trick**, **Exam Tip**. Keep it concise and exam-focused.`;
  const markdown = await chatText(system, question);
  return { markdown };
}

// Module 10 — Current Affairs
export async function generateCurrentAffairs({ date }) {
  const categories = ['Banking News', 'Economy News', 'Government Schemes', 'Appointments', 'Awards', 'Sports', 'International News', 'RBI Updates', 'Financial News'];
  const system = `You generate SBI/IBPS PO exam-relevant current affairs summaries. Return strict JSON: {"sections": {"Banking News": "markdown bullet list", ... one key per requested category}}. Keep each section to 3-6 concise bullet points relevant for banking exam preparation. If you do not have verified information for the exact date, provide generally relevant, clearly-labeled illustrative points and note that the user should cross-check with a live news source for the exact date.`;
  const user = `Date: ${date}\nCategories: ${categories.join(', ')}`;
  const data = await chatJSON(system, user);
  return { date, sections: data.sections };
}
