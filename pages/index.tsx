import React, { useState } from 'react';
import TransactionForm from '../components/TransactionForm';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Transaction {
  id?: number;
  amount: number;
  date: string;
  description: string;
}

const Home = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Handle adding a new transaction or updating an existing one
  const handleAddTransaction = (transaction: Transaction) => {

    const newTransaction = { 
      ...transaction, 
      id: Date.now() // Assign a unique ID based on timestamp
    };

    console.log("handleAddTransaction  with ID:", newTransaction);
    if (editingTransaction) {
      // Update existing transaction
      setTransactions((prevTransactions) =>
        prevTransactions.map((t) => (t.id === editingTransaction.id ? transaction : t))
      );
      setEditingTransaction(null); // Reset edit state
    } else {
      // Add new transaction
      setTransactions((prevTransactions) => [...prevTransactions, { ...transaction, id: Date.now() }]);
    }
  };

  // Handle deleting a transaction
  const handleDeleteTransaction = (id: number) => {
    console.log("Deleting Transaction with ID:", id);
    setTransactions((prevTransactions) => prevTransactions.filter((t) => t.id !== id));
  };

  // Handle editing a transaction
  const handleEditTransaction = (transaction: Transaction) => {
    console.log("edit Transaction with ID:", transaction);
    setEditingTransaction(transaction);
  };

  // Aggregate transactions by month for the chart
  const getMonthlyExpenses = () => {
    const expensesByMonth: { [key: string]: number } = {};

    transactions.forEach((transaction) => {
      const month = new Date(transaction.date).toLocaleString('default', { month: 'short', year: 'numeric' });
      expensesByMonth[month] = (expensesByMonth[month] || 0) + transaction.amount;
    });

    return Object.keys(expensesByMonth).map((month) => ({
      month,
      expenses: expensesByMonth[month],
    }));
  };

  const monthlyExpenses = getMonthlyExpenses();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Personal Finance Tracker</h1>
      
      {/* Transaction Form */}
      <TransactionForm onSubmit={handleAddTransaction} editingTransaction={editingTransaction} />
      
      {/* Monthly Expenses Bar Chart */}
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

      {/* Transaction List */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold">Transaction List</h2>
        <ul className="space-y-4">
          {transactions.map((transaction) => (
            <li key={transaction.id} className="p-4 border rounded flex justify-between items-center">
              <div>
                <strong>Amount:</strong> ${transaction.amount} <br />
                <strong>Date:</strong> {transaction.date} <br />
                <strong>Description:</strong> {transaction.description}
              </div>
              <div className="flex space-x-2">
                <button onClick={() => handleEditTransaction(transaction)} className="px-3 py-1 bg-blue-500 text-black rounded">
                  Edit
                </button>
                <button onClick={() => handleDeleteTransaction(transaction.id)} className="px-3 py-1 bg-red-500 text-red rounded">
                  Delete
                </button>
              </div>
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
