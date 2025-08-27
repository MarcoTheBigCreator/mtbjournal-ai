import { ChatOpenAI } from '@langchain/openai';
import { StructuredOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import { aiOutputSchema } from '@/schemas';

const parser = StructuredOutputParser.fromZodSchema(aiOutputSchema);

const getPrompt = async (content: string) => {
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

export const analyze = async (content: string) => {
  const input = await getPrompt(content);

  const model = new ChatOpenAI({
    model: 'gpt-5-mini',
    verbosity: 'medium',
    reasoning: { effort: 'medium' },
  });

  const result = await model.invoke(input);

  const resultToParse = result.content as string;

  try {
    return parser.parse(resultToParse);
  } catch (error) {
    console.log(error);
  }
};
