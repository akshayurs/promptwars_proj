import React from 'react';
import { Activity } from 'lucide-react';
import { Plan } from '../types';

interface BudgetMeterProps {
  plan: Plan;
  budget: number;
}

export const BudgetMeter: React.FC<BudgetMeterProps> = ({ plan, budget }) => {
  const isOverBudget = plan.totalCost > budget;
  const percentage = Math.min(100, (plan.totalCost / budget) * 100);

  return (
    <div className="glass-panel" style={{ position: 'sticky', top: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={18} color="var(--accent-color)" aria-hidden="true" /> Budget Feasibility
        </h3>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
        <span style={{ color: 'var(--text-secondary)' }}>Estimated Cost</span>
        <span style={{ fontWeight: 'bold' }}>${plan.totalCost} / ${budget}</span>
      </div>
      
      <div className="budget-meter" aria-label={`Budget usage: ${percentage.toFixed(0)}%`} aria-live="polite">
        <div 
          className="budget-fill" 
          style={{ 
            width: `${percentage}%`,
            backgroundColor: isOverBudget ? 'var(--danger-color)' : 'var(--success-color)'
          }}
        />
      </div>
      
      {isOverBudget && (
        <p style={{ fontSize: '0.8rem', color: 'var(--danger-color)', marginBottom: '1.5rem' }} role="alert">
          You're over budget! Try substituting a meal.
        </p>
      )}

      <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '1.5rem 0' }} />

      <h3 style={{ marginBottom: '1rem' }}>Grocery List</h3>
      <div role="list">
        {plan.groceryList.map((item, idx) => (
          <div key={idx} className="grocery-item" role="listitem">
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-color)' }} aria-hidden="true" />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};
