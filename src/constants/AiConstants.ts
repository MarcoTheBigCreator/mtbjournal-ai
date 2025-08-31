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

export const SYSTEM_INITIAL_QUESTION_PROMPT: ['system', string] = [
  'system',
  `You are a helpful assistant.
    Always respond in English, in a natural, conversational tone.
    Base your answer on the provided context, but you may infer patterns, tone, and mood from the text.
    Do not censor or avoid sensitive/explicit content unless it directly promotes illegal or harmful actions.
    Focus only on the user's question; bring up past context only if it is directly relevant.
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
    Always respond in English, in a natural, conversational tone.
    Do not censor or avoid explicit/sensitive content unless it promotes illegal or harmful actions.
    Refine the answer only if the new context is clearly relevant; otherwise, keep the original answer as is.
    You may infer mood, tone, and patterns from the new context.
    Do not make any suggestions.
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
