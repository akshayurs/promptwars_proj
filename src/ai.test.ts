import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generatePlanWithAI } from './ai';

const mockGenerateContent = vi.fn();

vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: vi.fn().mockImplementation(() => {
      return {
        models: {
          generateContent: mockGenerateContent
        }
      };
    })
  };
});

describe('ai.ts - generatePlanWithAI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    import.meta.env.VITE_GEMINI_API_KEY = 'test-key';
  });

  it('throws an error if VITE_GEMINI_API_KEY is missing', async () => {
    import.meta.env.VITE_GEMINI_API_KEY = '';
    await expect(generatePlanWithAI('schedule', 30)).rejects.toThrow(/VITE_GEMINI_API_KEY is missing/);
  });

  it('throws an error if AI returns no text', async () => {
    mockGenerateContent.mockResolvedValueOnce({ text: '' });
    await expect(generatePlanWithAI('schedule', 30)).rejects.toThrow(/No response from AI/);
  });

  it('throws an error if AI returns invalid JSON schema', async () => {
    // Missing 'totalCost'
    const badJson = JSON.stringify({
      meals: [],
      groceryList: []
    });
    mockGenerateContent.mockResolvedValueOnce({ text: badJson });
    await expect(generatePlanWithAI('schedule', 30)).rejects.toThrow(/Failed to parse AI response/);
  });

  it('returns valid parsed Plan if AI responds correctly', async () => {
    const goodJson = JSON.stringify({
      meals: [],
      groceryList: ['Apple'],
      totalCost: 10
    });
    mockGenerateContent.mockResolvedValueOnce({ text: goodJson });
    
    const result = await generatePlanWithAI('schedule', 30);
    expect(result.totalCost).toBe(10);
    expect(result.groceryList).toContain('Apple');
  });
});
