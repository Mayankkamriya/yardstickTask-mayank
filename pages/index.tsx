import React, { useState, useEffect } from 'react';
import TransactionForm from '../components/TransactionForm';
import Budgeting from "../components/Budgeting";
import ExpenseCharts from "../components/ExpenseCharts";
import TransactionList from "../components/TransactionList";
import { toast } from "react-toastify";
interface Transaction {
  _id?: string; 
  amount: number;
  date: string;
  description: string;
  category: string;
}

const Home = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

    // below code for getting tranCTION -- Mayank
  useEffect(() => {
    // Fetch initial transactions from the API
    const fetchTransactions = async () => {
      try {
        const response = await fetch('/api/transactions');
        const data = await response.json();
        // console.log('data...',data)
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, []);

  const handleAddTransaction = async (transaction: Transaction) => {
    const newTransaction = { 
      ...transaction,
      // _id: editingTransaction ? editingTransaction._id : Date.now().toString() // Keep the original ID when editing 
    };

    // Handle API request for adding or updating transaction
    try {
      let response;
      if (editingTransaction) {
        response = await fetch(`/api/transactions/${editingTransaction._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTransaction),
        });
        toast.success("Transaction Updated successfully!");
      } else {
        response = await fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTransaction),
        }
      );
      toast.success("Transaction Added successfully!");
      }

      const data = await response.json();
      if (response.ok) {
        // Update transactions list after successful request
        if (editingTransaction) {
          setTransactions((prevTransactions) =>
            prevTransactions.map((t) => (t._id === editingTransaction._id ? data : t))
          );
          setEditingTransaction(null);
        } else {
          setTransactions((prevTransactions) => [...prevTransactions, data]);
        }
      } else {
        console.error('Error saving transaction:', data);
      }
    } catch (error) {
      console.error('Error with transaction request:', error);
    }
  };
  const categoryColors: { [key: string]: string } = {
    Food: '#ff6384',
    Transport: '#36a2eb',
    Entertainment: '#ffce56',
    Bills: '#4bc0c0',
    Health: '#9966ff',
    Others: '#ff9f40',
  };

  const handleDeleteTransaction = async (transaction: Transaction) => {

      const confirmDelete = window.confirm(
        `🚨 Are you sure you want to delete this transaction?\n\n` +
        `📝 Details:\n- Amount: ${transaction.amount}\n-Date: ${new Date(transaction.date).toLocaleDateString()}\n- Category: ${transaction.category}\n\n` +
        `⚠️ This action is irreversible!`
      );
    
      if (!confirmDelete) return; // If user cancels, do nothing
    

    try {
      const response = await fetch(`/api/transactions/${transaction._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the transaction from the state after successful deletion
        setTransactions((prevTransactions) =>
          prevTransactions.filter((t) => t._id !== transaction._id)
        );
      } else {
        console.error('Error deleting transaction');
      }
    } catch (error) {
      console.error('Error with delete request:', error);
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

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

  const getCategoryExpenses = () => {
    const expensesByCategory: { [key: string]: number } = {};

    transactions.forEach((transaction) => {
      expensesByCategory[transaction.category] = (expensesByCategory[transaction.category] || 0) + transaction.amount;
    });

    return Object.keys(expensesByCategory).map((category) => ({
      category,
      expenses: expensesByCategory[category],
    }));
  };

  const getSummary = () => {
    const totalExpenses = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    const categoryExpenses = getCategoryExpenses();

    return {
      totalExpenses,
      categoryExpenses,
      recentTransactions: transactions.slice(0, 5),
    };
  };

  const monthlyExpenses = getMonthlyExpenses();
  const { totalExpenses, categoryExpenses, recentTransactions } = getSummary();

  return (
    <div className="container mx-auto p-4">
      {/* <h1 className="text-2xl font-bold">Personal Finance Tracker</h1> */}
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-4">📌 Personal Finance Visualizer</h1>

        {/* Transaction Form */}
      <div  className="flex justify-center mt-4">
        <TransactionForm onSubmit={handleAddTransaction} editingTransaction={editingTransaction  || undefined} />
      </div>

         {/* Budgeting Component */}
     <div className="mt-8">
       <Budgeting transactions={transactions} />
     </div>


<div className='max-w-7xl mx-auto p-4 mt-8 mb-8 bg-white rounded-xl shadow-lg space-y-8'>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 gap-y-8 mt-8">
  {/* Recent Transactions Card */}
  <div className="bg-gray-100 p-6 rounded-lg shadow-md mt-8 mb-4 mr-2">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Transactions</h3>
    <ul className="space-y-2">
      {recentTransactions
        .slice()
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by latest date first
        .slice(0, 5) // Take the first 5 after sorting
        .map((transaction) => (
        <li
          key={transaction._id}
          className="flex justify-between text-gray-700 bg-white p-2 rounded-lg shadow-sm"
        >
          <span className="text-sm">{transaction.description}</span>&nbsp;
          <span className="font-semibold">₹{transaction.amount}</span>
        </li>
      ))}
  </ul>
  </div>

  {/* Category Breakdown Card */}
  <div className="bg-gray-100 p-6 rounded-lg shadow-md mt-8">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">Category Breakdown</h3>
    <ul className="space-y-2">
      {categoryExpenses.map(({ category, expenses }) => (
        <li key={category} className="flex justify-between text-gray-700 bg-white p-2 rounded-lg shadow-sm">
          <span className="text-sm font-medium">{category} </span>&nbsp;
          <span className="font-semibold"> ₹{expenses}</span>
        </li>
      ))}
    </ul>
  </div>


</div>
  {/* Total Expenses Card */}
  <div className="bg-gray-100 p-6 rounded-lg shadow-md">
    <h3 className="text-xl font-semibold">Total Expenses</h3>
    <p className="text-3xl font-bold">₹{totalExpenses.toFixed(2)}</p>
  </div>

</div>

  <ExpenseCharts monthlyExpenses={monthlyExpenses} categoryExpenses={categoryExpenses} categoryColors={categoryColors} />

<div className="max-w-7xl mx-auto p-18 bg-white rounded-xl shadow-lg space-y-8">
      {/* Transaction List Component */}
      <TransactionList
        transactions={transactions}
        handleEditTransaction={handleEditTransaction}
        handleDeleteTransaction={handleDeleteTransaction}
      />
    </div>

    </div>
  );
};

export default Home;
