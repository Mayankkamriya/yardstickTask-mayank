import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

interface Transaction {
  category: string;
  amount: number;
}

interface BudgetingProps {
  transactions: Transaction[];
}

const Budgeting: React.FC<BudgetingProps> = ({ transactions }) => {
  // Step 1: Define Budget State
  const [budgets, setBudgets] = useState<{ [key: string]: number }>({
    Food: 500,
    Transport: 1100,
    Entertainment: 500,
    Shopping: 1500,
    Bills: 1500,
    Others:1200,
  });

  // Step 2: Function to Update Budget
  const updateBudget = (category: string, amount: number) => {
    setBudgets((prevBudgets) => ({
      ...prevBudgets,
      [category]: amount,
    }));
  };

  // Step 3: Calculate Actual Spending per Category
  const categorySpending: { [key: string]: number } = transactions.reduce((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {} as { [key: string]: number });

  // Step 4: Prepare Data for Budget vs. Actual Comparison Chart
  const budgetComparisonData = Object.keys(budgets).map((category) => ({
    category,
    budget: budgets[category],
    actual: categorySpending[category] || 0,
  }));

  // Step 5: Generate Simple Spending Insights
  const spendingInsights = budgetComparisonData.map(({ category, budget, actual }) => {
    const percentage = ((actual / budget) * 100).toFixed(1);
    return {
      category,
      message:
        actual > budget
          ? `⚠️ You've exceeded your ${category} budget!`
          : `✅ You're at ${percentage}% of your ${category} budget.`,
    };
  });

  return (
    <div className=" p-4 rounded">
      <h2 className="text-xl font-semibold">Set Monthly Budgets</h2>
      {Object.keys(budgets).map((category) => (
        <div key={category}>
          <label>{category} Budget:</label>
          <input
            type="number"
            value={budgets[category]}
            onChange={(e) => updateBudget(category, Number(e.target.value))}
          />
        </div>
      ))}

      <h2 className="p-1 text-xl font-semibold">Budget vs. Actual Spending</h2>
      <BarChart width={600} height={300} data={budgetComparisonData}>
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="budget" fill="#8884d8" />
        <Bar dataKey="actual" fill="#82ca9d" />
      </BarChart>

      <h2 className="p-1 text-xl font-semibold">Spending Insights</h2>
      <ul>
        {spendingInsights.map(({ category, message }) => (
          <li key={category}>{message}</li>
        ))}
      </ul>
    </div>
  );
};

export default Budgeting;
