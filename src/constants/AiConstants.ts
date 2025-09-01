import { ChatOpenAI } from '@langchain/openai';

export const MODEL_OPENAI = new ChatOpenAI({
  model: 'gpt-5-mini',
  verbosity: 'medium',
  reasoning: { effort: 'minimal' },
});

export const ANALYSIS_PROMPT = `Analyze the following journal entry in English.
Follow the instructions and output format exactly as specified. 
Always respond in English, without translating to any other language. 
No matter what! 
\n{format_instructions}\n{entry}`;

export const COLOR_PROMPT = `A color representing the mood of the journal entry. 
ALWAYS CHOOSE ONE from this list: red, blue, green, yellow, purple, pink, indigo, gray, violet, orange, teal, cyan, lime, amber, emerald, fuchsia, rose, sky, slate. 
Use **color psychology** to assign the color based on the emotions expressed in the entry. 
For example, blue for sadness, red for anger or passion, yellow for happiness, 
green for calm or balance. 
Provide only one color, lowercase.`;

export const SUMMARY_PROMPT = `A medium-short-length summary of the journal entry in English. 
Capture the main events, key emotions, and context, enough to understand what happened and how the author felt. 
Capitalize the first letter of the first word.`;

export const SUBJECT_PROMPT = `The main subject or topic of the journal entry in English. 
Capitalize the first letter of the first word.`;

export const MOOD_PROMPT = `The overall mood of the author in English, 
expressed with one word and an emoji. 
Capitalize the first letter of the first word. Example: "Happy 😊".`;

export const NEGATIVE_PROMPT = `Indicates if the journal entry contains negative emotions. 
True for negative, false otherwise.`;

export const RECOMMENDATION_PROMPT = `A medium-short-length set of thoughtful recommendations in English
to help the author cope with the situation. 
Include actionable advice and supportive guidance, 
reflecting the emotions and context described in the entry. 
Capitalize the first letter of the first word.`;

export const SENTIMENT_SCORE_PROMPT = `A sentiment score for the journal entry, 
ranging from -10 (very negative) to 10 (very positive).`;

export const SYSTEM_INITIAL_QUESTION_PROMPT: ['system', string] = [
  'system',
  `You are a helpful assistant.
    Always respond in the question language in a natural, conversational tone.
    Base your answer on the provided context, but you may infer patterns, tone, and mood from the text.
    Do not censor or avoid sensitive/explicit content unless it directly promotes illegal or harmful actions.
    Focus only on the user's question; ignore irrelevant details.
    Focus only on the user's question; bring up past context only if it is directly relevant.
    You may infer mood, tone, and patterns but DO NOT make any suggestions.
    Do not make any suggestions.
    If there is no information to make an inference, say "I don’t know."`,
];

export const USER_INITIAL_QUESTION_PROMPT: ['human', string] = [
  'human',
  `Question: {question}

    Context:
    {context}

    Answer:`,
];

export const SYSTEM_REFINE_QUESTION_PROMPT: ['system', string] = [
  'system',
  `You are refining an existing answer with new context.
    Always respond in the question language in a natural, conversational tone.
    Do not censor or avoid explicit/sensitive content unless it promotes illegal or harmful actions.
    Refine the answer only if the new context is clearly relevant; otherwise, keep the original answer as is.
    Focus only on the user's question; ignore irrelevant details.
    You may infer mood, tone, and patterns from the new context but DO NOT make any suggestions.
    Stay focused on the actual question being asked, not on explaining how context works.
    If there is no new information relevant to answer the question, keep the original answer as is.`,
];

export const USER_REFINE_QUESTION_PROMPT: ['human', string] = [
  'human',
  `Question: {question}

    Existing Answer: {existingAnswer}

    New Context:
    {context}

    Refined Answer:`,
];

export const MAX_WORDS = 1000;

export const SIMILARITY_THRESHOLD = 0.7;

export const MIN_FILTERED_DOCUMENTS = 10;
