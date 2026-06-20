export interface Meal {
  type: string;
  time: string;
  title: string;
  description: string;
  cost: number;
}

export interface Plan {
  meals: Meal[];
  groceryList: string[];
  totalCost: number;
}
