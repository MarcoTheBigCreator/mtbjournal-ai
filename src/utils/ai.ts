import { ChatOpenAI } from '@langchain/openai';
import { StructuredOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import { aiOutputSchema } from '@/schemas';

const parser = StructuredOutputParser.fromZodSchema(aiOutputSchema);

const getPrompt = async (content: string) => {
  const format_instructions = parser.getFormatInstructions();

  const prompt = new PromptTemplate({
    template:
      'Analyze the following journal entry. Follow the instructions and format your response to match the format instructions, no matter what! \n{format_instructions}\n{entry}',
    inputVariables: ['entry'],
    partialVariables: { format_instructions },
  });

  const input = await prompt.format({ entry: content });

  return input;
};

export const analyze = async (content: string) => {
  const input = await getPrompt(content);

  const model = new ChatOpenAI({
    temperature: 0.5,
    model: 'gpt-4o-mini-2024-07-18',
  });

  const result = await model.invoke(input);

  const resultToParse = result.content as string;

  try {
    return parser.parse(resultToParse);
  } catch (error) {
    console.log(error);
  }
};
