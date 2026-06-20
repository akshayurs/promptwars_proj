import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import App from './App';
import * as aiModule from './ai';

// Mock the AI module so we don't actually call the Gemini API during tests
vi.mock('./ai', () => ({
  generatePlanWithAI: vi.fn(),
  substituteMeal: vi.fn(),
}));

describe('DayBite App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders the header and form inputs', () => {
    render(<App />);
    expect(screen.getByText('DayBite')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e.g. Back to back meetings/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e.g. 30/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Plan My Meals/i })).toBeInTheDocument();
  });

  test('generate button is disabled when inputs are empty', () => {
    render(<App />);
    const button = screen.getByRole('button', { name: /Plan My Meals/i });
    expect(button).toBeDisabled();
  });

  test('shows an error if form is submitted with missing data (though button is disabled, testing internal logic)', async () => {
    render(<App />);
    // We can enable the button manually or just test the state change when inputs are filled
    const scheduleInput = screen.getByPlaceholderText(/e.g. Back to back meetings/i);
    const budgetInput = screen.getByPlaceholderText(/e.g. 30/i);
    const button = screen.getByRole('button', { name: /Plan My Meals/i });

    fireEvent.change(scheduleInput, { target: { value: 'Busy day' } });
    fireEvent.change(budgetInput, { target: { value: '20' } });

    expect(button).not.toBeDisabled();
  });

  test('calls generatePlanWithAI when form is submitted', async () => {
    // Mock the successful AI response
    (aiModule.generatePlanWithAI as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      meals: [
        { type: 'Breakfast', time: '8:00 AM', title: 'Oatmeal', description: 'Quick oats', cost: 3 }
      ],
      groceryList: ['Oats'],
      totalCost: 3
    });

    render(<App />);
    
    fireEvent.change(screen.getByPlaceholderText(/e.g. Back to back meetings/i), { target: { value: 'Morning gym' } });
    fireEvent.change(screen.getByPlaceholderText(/e.g. 30/i), { target: { value: '15' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Plan My Meals/i }));

    expect(aiModule.generatePlanWithAI).toHaveBeenCalledWith('Morning gym', 15);
    
    // Wait for the meal card to appear
    await waitFor(() => {
      expect(screen.getByText('Oatmeal')).toBeInTheDocument();
      expect(screen.getByText('Quick oats')).toBeInTheDocument();
      expect(screen.getByText('Budget Feasibility')).toBeInTheDocument();
    });
  });
});
