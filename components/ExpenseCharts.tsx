import React from 'react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, PieChart, Pie, Cell } from 'recharts';

interface ExpenseChartsProps {
  monthlyExpenses: { month: string; expenses: number }[];
  categoryExpenses: { category: string; expenses: number }[];
  categoryColors: { [key: string]: string };
}

const ExpenseCharts: React.FC<ExpenseChartsProps> = ({ monthlyExpenses, categoryExpenses, categoryColors }) => {
  return (
    <div className="max-w-7xl mx-auto p-6 mb-4 bg-white rounded-xl shadow-lg space-y-8 mt-6">
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 ">
        
        {/* Monthly Expenses Bar Chart */}
        <div className="bg-white shadow-lg rounded-xl p-6 w-full md:w-2/3">
          <h2 className="text-3xl font-semibold text-gray-700 mb-4">📊 Monthly Expenses</h2>
          <ResponsiveContainer width="90%" height={300}>
            <BarChart data={[...monthlyExpenses].sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())} >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" className="text-gray-600" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value}`} />
              <Legend />
              <Bar dataKey="expenses" fill="#6366F1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Expenses Pie Chart */}
        <div className="bg-white shadow-lg rounded-xl p-6 w-full md:w-2/5">
          <span className="text-3xl font-semibold text-gray-700 mb-4">🍕 Category Expenses</span>
          <div className="flex justify-center">
            <ResponsiveContainer width={450} height={300}>
              <PieChart>
                <Pie
                  data={categoryExpenses}
                  dataKey="expenses"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#6366F1"
                  label={({ name, value }) => `${name}: ₹${value}`}
                >
                  {categoryExpenses.map((entry) => (
                    <Cell key={entry.category} fill={categoryColors[entry.category] || '#6366F1'} className="focus:outline-none" />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseCharts;
