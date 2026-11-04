import assert from 'node:assert/strict';
import test from 'node:test';
import { AIMessage } from '@langchain/core/messages';
import { OpenAIEmbeddings } from '@langchain/openai';

test('AI migration preserves analysis and semantic search without network calls', async (t) => {
  process.env.OPENAI_API_KEY = 'sk-test-no-network';
  t.mock.method(globalThis, 'fetch', async () => {
    throw new Error('Unexpected network call in AI regression tests');
  });

  const { MODEL_OPENAI } = await import('../src/constants/AiConstants');
  const { analyzeJournalEntry, askQuestionAboutEntries } = await import('../src/utils/journal-ai-services');

  await t.test('empty content does not invoke the model', async (t) => {
    const model = t.mock.method(MODEL_OPENAI, 'invoke', async () => {
      throw new Error('Model must not be called');
    });
    assert.equal(await analyzeJournalEntry('   '), undefined);
    assert.equal(await askQuestionAboutEntries('question', []), null);
    assert.equal(model.mock.callCount(), 0);
  });

  await t.test('structured analysis remains compatible with Zod 4', async (t) => {
    const analysis = {
      color: 'green', summary: 'A good day.', subject: 'Walking', mood: 'Happy',
      negative: false, recommendation: 'Keep walking.', sentimentScore: 7,
    };
    t.mock.method(MODEL_OPENAI, 'invoke', async () => new AIMessage(JSON.stringify(analysis)));
    assert.deepEqual(await analyzeJournalEntry('I enjoyed a walk today.'), analysis);
  });

  await t.test('malformed model output is handled without a rejected request', async (t) => {
    t.mock.method(MODEL_OPENAI, 'invoke', async () => new AIMessage('not valid JSON'));
    t.mock.method(console, 'error', () => {});
    assert.equal(await analyzeJournalEntry('A journal entry.'), undefined);
  });

  await t.test('semantic search retains only relevant sources and their metadata', async (t) => {
    t.mock.method(OpenAIEmbeddings.prototype, 'embedDocuments', async () => [[1, 0], [0, 1]]);
    t.mock.method(OpenAIEmbeddings.prototype, 'embedQuery', async () => [1, 0]);
    t.mock.method(MODEL_OPENAI, 'invoke', async () => new AIMessage('You enjoyed walking.'));
    const updatedAt = new Date('2026-01-01T00:00:00Z');
    const result = await askQuestionAboutEntries('What did I enjoy?', [
      { id: 'relevant', content: 'I enjoyed walking.', updatedAt },
      { id: 'unrelated', content: 'A shopping list.', updatedAt },
    ]);
    assert.deepEqual(result, {
      answer: 'You enjoyed walking.',
      sources: [{ id: 'relevant', updatedAt }],
    });
  });

  await t.test('search with no relevant documents does not invoke the model', async (t) => {
    t.mock.method(OpenAIEmbeddings.prototype, 'embedDocuments', async () => [[0, 1]]);
    t.mock.method(OpenAIEmbeddings.prototype, 'embedQuery', async () => [1, 0]);
    const model = t.mock.method(MODEL_OPENAI, 'invoke', async () => {
      throw new Error('Model must not be called');
    });
    assert.equal(await askQuestionAboutEntries('What did I enjoy?', [
      { id: 'unrelated', content: 'A shopping list.', updatedAt: new Date() },
    ]), null);
    assert.equal(model.mock.callCount(), 0);
  });
});
