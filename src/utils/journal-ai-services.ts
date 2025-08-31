import { OpenAIEmbeddings } from '@langchain/openai';
import {
  StringOutputParser,
  StructuredOutputParser,
} from '@langchain/core/output_parsers';
import { PromptTemplate, ChatPromptTemplate } from '@langchain/core/prompts';
import { aiOutputSchema } from '@/schemas';
import { Document } from '@langchain/core/documents';
import { RunnableSequence } from '@langchain/core/runnables';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import {
  ANALYSIS_PROMPT,
  MAX_WORDS,
  MIN_FILTERED_DOCUMENTS,
  MODEL_OPENAI,
  SIMILARITY_THRESHOLD,
  SYSTEM_INITIAL_QUESTION_PROMPT,
  SYSTEM_REFINE_QUESTION_PROMPT,
  USER_INITIAL_QUESTION_PROMPT,
  USER_REFINE_QUESTION_PROMPT,
} from '@/constants';
import { AiAnswer, EntryAnalysis, EntrySource } from '@/types';
import { truncateText } from './text-utils';

const structuredOutputParser =
  StructuredOutputParser.fromZodSchema(aiOutputSchema);

const DOCUMENT_BATCH_SIZE = MIN_FILTERED_DOCUMENTS;

const CONTEXT_SEPARATOR = '\n\n';

const formatDocumentForContext = (document: Document): string =>
  `Note (updated: ${document.metadata.updatedAt}):\n${document.pageContent}`;

const truncateToMaxWords = (text: string): string =>
  truncateText(text, MAX_WORDS);

const buildAnalysisPrompt = async (entryContent: string): Promise<string> => {
  const formatInstructions = structuredOutputParser.getFormatInstructions();

  const analysisPromptTemplate = new PromptTemplate({
    template: ANALYSIS_PROMPT,
    inputVariables: ['entry'],
    partialVariables: { format_instructions: formatInstructions },
  });

  const formattedPrompt = await analysisPromptTemplate.format({
    entry: entryContent,
  });

  return formattedPrompt;
};

export const analyzeJournalEntry = async (
  entryContent: string
): Promise<EntryAnalysis | undefined> => {
  if (!entryContent || entryContent.trim().length === 0) {
    console.warn('No content provided for analysis');
    return undefined;
  }

  const analysisPrompt = await buildAnalysisPrompt(entryContent);

  const aiResponse = await MODEL_OPENAI.invoke(analysisPrompt);

  const responseText = aiResponse.content as string;

  try {
    return structuredOutputParser.parse(responseText);
  } catch (error) {
    console.error(
      'Failed to parse AI analysis:',
      error instanceof Error ? error.message : error
    );
    return undefined;
  }
};

const initialQuestionPrompt = ChatPromptTemplate.fromMessages([
  SYSTEM_INITIAL_QUESTION_PROMPT,
  USER_INITIAL_QUESTION_PROMPT,
]);

const refineAnswerPrompt = ChatPromptTemplate.fromMessages([
  SYSTEM_REFINE_QUESTION_PROMPT,
  USER_REFINE_QUESTION_PROMPT,
]);

const initialAnswerChain = RunnableSequence.from([
  initialQuestionPrompt,
  MODEL_OPENAI,
  new StringOutputParser(),
]);

const refineAnswerChain = RunnableSequence.from([
  refineAnswerPrompt,
  MODEL_OPENAI,
  new StringOutputParser(),
]);

const createDocumentsFromEntries = (entries: EntrySource[]): Document[] => {
  const documents = entries.map((entry) => {
    return new Document({
      pageContent: truncateToMaxWords(entry.content),
      metadata: { id: entry.id, updatedAt: entry.updatedAt },
    });
  });

  return documents;
};

export const askQuestionAboutEntries = async (
  question: string,
  entries: EntrySource[]
): Promise<AiAnswer | null> => {
  if (!question?.trim() || !entries?.length) {
    return null;
  }

  const entryDocuments = createDocumentsFromEntries(entries);

  const embeddings = new OpenAIEmbeddings();
  const vectorStore = await MemoryVectorStore.fromDocuments(
    entryDocuments,
    embeddings
  );

  const documentsWithScores = await vectorStore.similaritySearchWithScore(
    question
  );

  const relevantDocuments = documentsWithScores
    .filter(([, score]) => score >= SIMILARITY_THRESHOLD)
    .map(([doc]) => doc);

  if (relevantDocuments.length === 0) {
    return null;
  }

  let currentAnswer = await initialAnswerChain.invoke({
    question,
    context: relevantDocuments
      .slice(0, DOCUMENT_BATCH_SIZE)
      .map(formatDocumentForContext)
      .join(CONTEXT_SEPARATOR),
  });

  for (
    let i = DOCUMENT_BATCH_SIZE;
    i < relevantDocuments.length;
    i += DOCUMENT_BATCH_SIZE
  ) {
    const documentBatch = relevantDocuments.slice(i, i + DOCUMENT_BATCH_SIZE);
    currentAnswer = await refineAnswerChain.invoke({
      question,
      existingAnswer: currentAnswer,
      context: documentBatch
        .map(formatDocumentForContext)
        .join(CONTEXT_SEPARATOR),
    });
  }

  return {
    answer: currentAnswer,
    sources: relevantDocuments.map((doc) => ({
      id: doc.metadata.id as string,
      updatedAt: doc.metadata.updatedAt as Date,
    })),
  };
};
