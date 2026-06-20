import React, { useState } from 'react';
import { Clock, DollarSign, ChefHat, RefreshCw } from 'lucide-react';
import { MealCard } from './components/MealCard';
import { BudgetMeter } from './components/BudgetMeter';
import { useMealPlanner } from './hooks/useMealPlanner';

function App() {
  const [schedule, setSchedule] = useState('');
  const [budget, setBudget] = useState<number | ''>('');
  
  const { plan, loading, substituting, error, generatePlan, makeMealCheaper } = useMealPlanner();

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedule || !budget) return;
    generatePlan(schedule, Number(budget));
  };

  const handleSubstitute = (index: number) => {
    if (!budget) return;
    makeMealCheaper(index, Number(budget));
  };

  return (
    <div className="app-container">
      <header style={{ marginBottom: '2rem' }}>
        <h1>DayBite</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Meals that fit your life, not the other way around.</p>
      </header>

      {error && (
        <div role="alert" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger-color)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', color: '#fca5a5' }}>
          {error}
        </div>
      )}

      <div className="glass-panel">
        <form onSubmit={handleGenerate} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="input-group" style={{ flex: 2, marginBottom: 0 }}>
            <label htmlFor="schedule-input">
              <Clock size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} aria-hidden="true" /> 
              How's your day looking?
            </label>
            <input 
              id="schedule-input"
              placeholder="e.g. Back to back meetings till 7pm, then gym" 
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              required
            />
          </div>
          <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
            <label htmlFor="budget-input">
              <DollarSign size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} aria-hidden="true" /> 
              Daily Budget ($)
            </label>
            <input 
              id="budget-input"
              type="number" 
              placeholder="e.g. 30" 
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              required
              min="1"
            />
          </div>
          <button type="submit" disabled={loading || !schedule || !budget} aria-busy={loading}>
            {loading ? <RefreshCw className="shimmer" size={18} aria-hidden="true" /> : <ChefHat size={18} aria-hidden="true" />}
            {loading ? 'Generating...' : 'Plan My Meals'}
          </button>
        </form>
      </div>

      <div aria-live="polite">
        {loading && (
          <div className="dashboard-grid">
            <div className="meals-grid">
              {[1, 2, 3].map(i => (
                <div key={i} className="glass-panel shimmer" style={{ height: '150px' }}></div>
              ))}
            </div>
            <div className="glass-panel shimmer" style={{ height: '300px' }}></div>
          </div>
        )}

        {plan && !loading && (
          <div className="dashboard-grid">
            <div className="meals-grid" role="list">
              {plan.meals.map((meal, idx) => (
                <div role="listitem" key={idx}>
                  <MealCard 
                    meal={meal} 
                    index={idx} 
                    substitutingIndex={substituting} 
                    onSubstitute={handleSubstitute} 
                  />
                </div>
              ))}
            </div>

            <div>
              <BudgetMeter plan={plan} budget={Number(budget)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
