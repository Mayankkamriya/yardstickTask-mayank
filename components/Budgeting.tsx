import React, { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

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
    Others: 1200,
  });

  // Step 2: Update Budget Function
  const updateBudget = (category: string, amount: number) => {
    setBudgets((prevBudgets) => ({
      ...prevBudgets,
      [category]: amount,
    }));
  };

  // Step 3: Calculate Actual Spending per Category using useMemo for better performance
  const categorySpending = useMemo(() => {
    return transactions.reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {} as { [key: string]: number });
  }, [transactions]);

  // Step 4: Prepare Data for Budget vs. Actual Comparison Chart
  const budgetComparisonData = useMemo(() => {
    return Object.keys(budgets).map((category) => ({
      category,
      budget: budgets[category],
      actual: categorySpending[category] || 0,
    }));
  }, [budgets, categorySpending]);

  // Step 5: Spending Insights for each category
  // const spendingInsights = useMemo(() => {
  //   return budgetComparisonData.map(({ category, budget, actual }) => {
  //     const percentage = ((actual / budget) * 100).toFixed(1);
  //     return {
  //       category,
  //       message:
  //         actual > budget
  //           ? `⚠️ You've exceeded your ${category} budget!`
  //           : `✅ You're at ${percentage}% of your ${category} budget.`,
  //     };
  //   });
  // }, [budgetComparisonData]);



  const spendingInsights = useMemo(() => {
    return budgetComparisonData.map(({ category, budget, actual }) => {
      const percentage = ((actual / budget) * 100).toFixed(1);
      let message, bgColor, textColor;
  
      if (actual > budget) {
        message = `🚨 You've exceeded your ${category} budget!`;
        bgColor = "bg-red-100";
        textColor = "text-red-700";
      } else if (percentage >= 80) {
        message = `⚠️ You've used ${percentage}% of your ${category} budget. Be cautious!`;
        bgColor = "bg-yellow-100";
        textColor = "text-yellow-700";
      } else {
        message = `✅ You're at ${percentage}% of your ${category} budget.`;
        bgColor = "bg-green-50";
        textColor = "text-gray-700";
      }
  
      return { category, message, bgColor, textColor };
    });
  }, [budgetComparisonData]);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-xl shadow-lg space-y-5 mb-4">
  {/* Set Monthly Budgets */}
  <h2 className="text-3xl font-semibold text-gray-800">Set Monthly Budgets</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {Object.keys(budgets).map((category) => (
      <div key={category} className="flex flex-col space-y-1.5">
        <label htmlFor={category} className="text-gray-700 font-medium">
          {category} Budget:
        </label>
        <input
          type="number"
          id={category}
          className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          value={budgets[category]}
          onChange={(e) => updateBudget(category, Number(e.target.value))}
        />
      </div>
    ))}
  </div>

  {/* Budget vs. Actual Spending */}
  <h2 className="text-3xl font-semibold text-gray-800">Budget vs. Actual Spending</h2>
  <div className="bg-gray-100 p-6 rounded-lg shadow-md flex justify-center">
    <ResponsiveContainer width='100%' height={300}>
    <BarChart width={700} height={350} data={budgetComparisonData}>
      <XAxis dataKey="category" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="budget" fill="#8884d8" />
      <Bar dataKey="actual" fill="#82ca9d" />
    </BarChart>
    </ResponsiveContainer>
  </div>

  {/* Spending Insights */}
  {/* <h2 className="text-3xl font-semibold text-gray-800">Spending Insights</h2>
  <div className="bg-gray-100 p-6 rounded-lg shadow-md">
    <ul className="space-y-3">
      {spendingInsights.map(({ category, message }) => (
        <li key={category} className="text-gray-700 font-medium">{message}</li>
      ))}
    </ul>
  </div> */}
<div className="bg-white p-6 rounded-xl shadow-lg">
<h2 className="text-3xl font-semibold text-gray-800 mb-4">Spending Insights</h2>
      {spendingInsights.length === 0 ? (
        <p className="text-gray-500 text-lg">No spending data available.</p>
      ) : (
        <ul className="space-y-0.5">
          {spendingInsights.map(({ category, message, bgColor, textColor }) => (
            <li
              key={category}
              className={`text-[15px] lg:text-[16px] font-medium p-2 rounded-lg ${bgColor} ${textColor}`}
            >
              {message}
            </li>
          ))}
        </ul>
      )}
</div>


</div>

 );
};

export default Budgeting;


// import React, { useState } from "react";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

// interface Transaction {
//   category: string;
//   amount: number;
// }

// interface BudgetingProps {
//   transactions: Transaction[];
// }

// const Budgeting: React.FC<BudgetingProps> = ({ transactions }) => {
//   // Step 1: Define Budget State
//   const [budgets, setBudgets] = useState<{ [key: string]: number }>({
//     Food: 500,
//     Transport: 1100,
//     Entertainment: 500,
//     Shopping: 1500,
//     Bills: 1500,
//     Others:1200,
//   });

//   // Step 2: Function to Update Budget
//   const updateBudget = (category: string, amount: number) => {
//     setBudgets((prevBudgets) => ({
//       ...prevBudgets,
//       [category]: amount,
//     }));
//   };

//   // Step 3: Calculate Actual Spending per Category
//   const categorySpending: { [key: string]: number } = transactions.reduce((acc, transaction) => {
//     acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
//     return acc;
//   }, {} as { [key: string]: number });

//   // Step 4: Prepare Data for Budget vs. Actual Comparison Chart
//   const budgetComparisonData = Object.keys(budgets).map((category) => ({
//     category,
//     budget: budgets[category],
//     actual: categorySpending[category] || 0,
//   }));

//   // Step 5: Generate Simple Spending Insights
//   const spendingInsights = budgetComparisonData.map(({ category, budget, actual }) => {
//     const percentage = ((actual / budget) * 100).toFixed(1);
//     return {
//       category,
//       message:
//         actual > budget
//           ? `⚠️ You've exceeded your ${category} budget!`
//           : `✅ You're at ${percentage}% of your ${category} budget.`,
//     };
//   });

//   return (
//     <div className=" p-4 rounded">
//       <h2 className="text-xl font-semibold">Set Monthly Budgets</h2>
//       {Object.keys(budgets).map((category) => (
//         <div key={category}>
//           <label>{category} Budget:</label>
//           <input
//             type="number"
//             value={budgets[category]}
//             onChange={(e) => updateBudget(category, Number(e.target.value))}
//           />
//         </div>
//       ))}

//       <h2 className="p-1 text-xl font-semibold">Budget vs. Actual Spending</h2>
//       <BarChart width={600} height={300} data={budgetComparisonData}>
//         <XAxis dataKey="category" />
//         <YAxis />
//         <Tooltip />
//         <Legend />
//         <Bar dataKey="budget" fill="#8884d8" />
//         <Bar dataKey="actual" fill="#82ca9d" />
//       </BarChart>

//       <h2 className="p-1 text-xl font-semibold">Spending Insights</h2>
//       <ul>
//         {spendingInsights.map(({ category, message }) => (
//           <li key={category}>{message}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Budgeting;
