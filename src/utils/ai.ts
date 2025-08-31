import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import {
  StringOutputParser,
  StructuredOutputParser,
} from '@langchain/core/output_parsers';
import { PromptTemplate, ChatPromptTemplate } from '@langchain/core/prompts';
import { aiOutputSchema } from '@/schemas';
import { Document } from '@langchain/core/documents';
import { RunnableSequence } from '@langchain/core/runnables';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';

const parser = StructuredOutputParser.fromZodSchema(aiOutputSchema);

const modelOpenAI = new ChatOpenAI({
  model: 'gpt-5-mini',
  verbosity: 'medium',
  reasoning: { effort: 'minimal' },
});

const getPrompt = async (content: string): Promise<string> => {
  const format_instructions = parser.getFormatInstructions();

  const prompt = new PromptTemplate({
    template:
      'Analyze the following journal entry in English.Follow the instructions and output format exactly as specified.Always respond in English, without translating to any other language. No matter what! \n{format_instructions}\n{entry}',
    inputVariables: ['entry'],
    partialVariables: { format_instructions },
  });

  const input = await prompt.format({ entry: content });

  return input;
};

export const analyze = async (
  content: string
): Promise<EntryAnalysis | undefined> => {
  const input = await getPrompt(content);

  const result = await modelOpenAI.invoke(input);

  const resultToParse = result.content as string;

  try {
    return parser.parse(resultToParse);
  } catch (error) {
    console.log(error);
  }
};

const initialPrompt = ChatPromptTemplate.fromMessages([
  [
    'system',
    `You are a helpful assistant.
Always respond in English, in a natural, conversational tone.
Base your answer on the provided context, but you may infer patterns, tone, and mood from the text.
Do not censor or avoid sensitive/explicit content unless it directly promotes illegal or harmful actions.
Focus only on the user's question; bring up past context only if it is directly relevant.
Do not make any suggestions.
If there is no information to make an inference, say "I don’t know."`,
  ],
  [
    'human',
    `Question: {question}

Context:
{context}

Answer:`,
  ],
]);

const refinePrompt = ChatPromptTemplate.fromMessages([
  [
    'system',
    `You are refining an existing answer with new context.
Always respond in English, in a natural, conversational tone.
Do not censor or avoid explicit/sensitive content unless it promotes illegal or harmful actions.
Refine the answer only if the new context is clearly relevant; otherwise, keep the original answer as is.
You may infer mood, tone, and patterns from the new context.
Do not make any suggestions.
Stay focused on the actual question being asked, not on explaining how context works.
If there is no new information relevant to answer the question, keep the original answer as is.`,
  ],
  [
    'human',
    `Question: {question}

Existing Answer: {existingAnswer}

New Context:
{context}

Refined Answer:`,
  ],
]);
const initialChain = RunnableSequence.from([
  initialPrompt,
  modelOpenAI,
  new StringOutputParser(),
]);

const refineChain = RunnableSequence.from([
  refinePrompt,
  modelOpenAI,
  new StringOutputParser(),
]);

const truncate = (text: string, maxWords = 500) =>
  text.split(' ').slice(0, maxWords).join(' ');

const createDocuments = (entries: EntrySource[]): Document[] => {
  const documents = entries.map((entry) => {
    return new Document({
      pageContent: truncate(entry.content),
      metadata: { id: entry.id, updatedAt: entry.updatedAt },
    });
  });

  return documents;
};

export const questionAndAnswer = async (
  question: string,
  entries: EntrySource[]
): Promise<AiAnswer | null> => {
  const docs = createDocuments(entries);

  const embeddings = new OpenAIEmbeddings();
  const store = await MemoryVectorStore.fromDocuments(docs, embeddings);

  const relevantDocs = await store.similaritySearchWithScore(question);

  const filteredDocs = relevantDocs
    .filter(([doc, score]) => score >= 0.7)
    .map(([doc, score]) => doc);

  if (filteredDocs.length === 0) {
    return null;
  }

  console.log(filteredDocs);

  let answer = await initialChain.invoke({
    question,
    context: filteredDocs
      .slice(0, 10)
      .map(
        (document) =>
          `Note (updated: ${document.metadata.updatedAt}):\n${document.pageContent}`
      )
      .join('\n\n'),
  });

  for (let i = 10; i < filteredDocs.length; i += 10) {
    const batch = filteredDocs.slice(i, i + 10);
    answer = await refineChain.invoke({
      question,
      existingAnswer: answer,
      context: batch
        .map(
          (document) =>
            `Note (updated: ${document.metadata.updatedAt}):\n${document.pageContent}`
        )
        .join('\n\n'),
    });
  }

  return {
    answer,
    sources: filteredDocs.map((doc) => ({
      id: doc.metadata.id as string,
      updatedAt: doc.metadata.updatedAt as Date,
    })),
  };
};
