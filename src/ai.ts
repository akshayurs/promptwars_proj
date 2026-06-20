import { GoogleGenAI } from '@google/genai';
import { Plan } from './types';

const SYSTEM_INSTRUCTION = `
You are DayBite, an AI chef that creates meal plans tailored exactly to a user's daily schedule and budget.
Return ONLY a strictly formatted JSON object matching the requested schema. No markdown, no markdown formatting blocks like \`\`\`json, just the raw JSON.
`;

const SCHEMA = {
  type: "OBJECT",
  properties: {
    meals: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          type: { type: "STRING", description: "Breakfast, Lunch, or Dinner" },
          time: { type: "STRING", description: "Suggested time to eat based on schedule" },
          title: { type: "STRING", description: "Name of the dish" },
          description: { type: "STRING", description: "Short description highlighting why it fits the schedule/budget" },
          cost: { type: "NUMBER", description: "Estimated cost in dollars" }
        },
        required: ["type", "time", "title", "description", "cost"]
      }
    },
    groceryList: {
      type: "ARRAY",
      items: { type: "STRING" },
      description: "List of ingredients needed"
    },
    totalCost: { type: "NUMBER", description: "Sum of all meal costs" }
  },
  required: ["meals", "groceryList", "totalCost"]
};

export const generatePlanWithAI = async (schedule: string, budget: number): Promise<Plan> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("VITE_GEMINI_API_KEY is missing in .env");
  
  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    Create a practical meal plan for today.
    My Schedule/Constraints: ${schedule}
    My Daily Budget: $${budget}
    
    Make sure the meals actually fit the schedule (e.g., if I'm busy until 7pm, give me a fast 15-min dinner).
    Try to stay within the budget, but if you go over, be realistic about the costs.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: SCHEMA,
      temperature: 0.7,
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  try {
    const parsed = JSON.parse(text) as Plan;
    if (!parsed.meals || !parsed.groceryList || parsed.totalCost === undefined) {
       throw new Error("Invalid schema from AI");
    }
    return parsed;
  } catch {
    throw new Error("Failed to parse AI response into valid Plan format.");
  }
};

export const substituteMeal = async (currentPlan: Plan, mealIndexToReplace: number, budgetLimit: number): Promise<Plan> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("VITE_GEMINI_API_KEY is missing in .env");

  const ai = new GoogleGenAI({ apiKey });
  const mealToReplace = currentPlan.meals[mealIndexToReplace];
  
  const prompt = `
    I have this current meal plan:
    ${JSON.stringify(currentPlan.meals, null, 2)}
    
    I need to make the ${mealToReplace.type} ("${mealToReplace.title}") CHEAPER.
    My total budget limit is $${budgetLimit}.
    Current total cost is $${currentPlan.totalCost}.
    
    Please provide a CHEAPER substitute for the ${mealToReplace.type} that still fits my schedule.
    Also provide an updated complete grocery list and the new total cost for the whole day.
    
    Return ONLY a JSON object with the exact same schema as before, containing the updated 3 meals, the updated groceryList, and the updated totalCost.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: SCHEMA,
      temperature: 0.7,
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  try {
    const parsed = JSON.parse(text) as Plan;
    if (!parsed.meals || !parsed.groceryList || parsed.totalCost === undefined) {
       throw new Error("Invalid schema from AI substitution");
    }
    return parsed;
  } catch {
    throw new Error("Failed to parse AI substitution response into valid Plan format.");
  }
};
