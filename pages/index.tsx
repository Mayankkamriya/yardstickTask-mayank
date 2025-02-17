import React, { useState } from 'react';
import TransactionForm from '../components/TransactionForm';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Home = () => {
  const [transactions, setTransactions] = useState<{ amount: number; date: string; description: string }[]>([]);

  const handleAddTransaction = (transaction: { amount: number; date: string; description: string }) => {
    setTransactions((prevTransactions) => [...prevTransactions, transaction]);
  };

  // Aggregate transactions by month
  const getMonthlyExpenses = () => {
    const expensesByMonth: { [key: string]: number } = {};

    transactions.forEach((transaction) => {
      const month = new Date(transaction.date).toLocaleString('default', { month: 'short', year: 'numeric' }); // Get Month-Year
      expensesByMonth[month] = (expensesByMonth[month] || 0) + transaction.amount;
    });

    // Convert the object to an array for Recharts
    return Object.keys(expensesByMonth).map((month) => ({
      month,
      expenses: expensesByMonth[month],
    }));
  };

  const monthlyExpenses = getMonthlyExpenses();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Personal Finance Tracker</h1>
      <TransactionForm onSubmit={handleAddTransaction} />
      
      {/* Displaying Bar Chart */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold">Monthly Expenses</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyExpenses}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="expenses" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Displaying list of transactions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold">Transaction List</h2>
        <ul className="space-y-4">
          {transactions.map((transaction, index) => (
            <li key={index} className="p-4 border rounded">
              <div><strong>Amount:</strong> ${transaction.amount}</div>
              <div><strong>Date:</strong> {transaction.date}</div>
              <div><strong>Description:</strong> {transaction.description}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;


// export default function Home() {
//   return (
//     <div >
      
//       Mayank 
//     </div>
//   );
// }
