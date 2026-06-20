import { useState, useCallback } from 'react';
import { Plan } from '../types';
import { generatePlanWithAI, substituteMeal } from '../ai';

export function useMealPlanner() {
  const [loading, setLoading] = useState(false);
  const [substituting, setSubstituting] = useState<number | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generatePlan = useCallback(async (schedule: string, budget: number) => {
    setError(null);
    setLoading(true);
    try {
      const result = await generatePlanWithAI(schedule, budget);
      setPlan(result);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to generate plan.');
    } finally {
      setLoading(false);
    }
  }, []);

  const makeMealCheaper = useCallback(async (index: number, budgetLimit: number) => {
    if (!plan) return;
    setSubstituting(index);
    setError(null);
    try {
      const result = await substituteMeal(plan, index, budgetLimit);
      setPlan(result);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to substitute meal.');
    } finally {
      setSubstituting(null);
    }
  }, [plan]);

  return {
    plan,
    loading,
    substituting,
    error,
    generatePlan,
    makeMealCheaper
  };
}
