import { memo } from 'react';
import { RefreshCw } from 'lucide-react';
import { Meal } from '../types';

interface MealCardProps {
  meal: Meal;
  index: number;
  substitutingIndex: number | null;
  onSubstitute: (index: number) => void;
}

export const MealCard = memo(({ meal, index, substitutingIndex, onSubstitute }: MealCardProps) => {
  const isSubstituting = substitutingIndex === index;

  return (
    <div className="glass-panel meal-card">
      <div className="meal-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="meal-type">{meal.type}</span>
          <span className="meal-time">{meal.time}</span>
        </div>
        <span style={{ fontWeight: 600, color: 'var(--success-color)' }}>${meal.cost}</span>
      </div>
      <h3 className="meal-title">{meal.title}</h3>
      <p className="meal-desc">{meal.description}</p>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button 
          type="button" 
          className="substitute-btn" 
          onClick={() => onSubstitute(index)}
          disabled={substitutingIndex !== null}
          aria-label={`Substitute ${meal.title}`}
          aria-busy={isSubstituting}
        >
          {isSubstituting ? <RefreshCw size={14} className="shimmer" aria-hidden="true" /> : <RefreshCw size={14} aria-hidden="true" />} 
          {isSubstituting ? 'Substituting...' : 'Make it Cheaper'}
        </button>
      </div>
    </div>
  );
});

MealCard.displayName = 'MealCard';
