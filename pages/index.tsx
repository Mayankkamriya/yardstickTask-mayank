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

    console.log("handleAddTransaction  with ID:", newTransaction.id);
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
                  <button onClick={() =>{ handleEditTransaction(transaction);
                   setTimeout(() => {
        window.scrollTo({top: 0, behavior: 'smooth' }) 
      }, 200);
       }}  className="bg-blue-500 text-black border border-blue-700 px-3 py-1 rounded hover:bg-blue-600">
                    Edit
                  </button>
                  <button onClick={() => handleDeleteTransaction(transaction.id)} className="bg-red-500 text-black border-2 border-red-900 px-3 py-1 rounded hover:bg-red-600">
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


  // This code is able to provide total summary and total expenses and description of the expenses
  // import React, { useState } from 'react';
  // import TransactionForm from '../components/TransactionForm';
  
  // interface Transaction {
  //   id: number;
  //   amount: number;
  //   date: string;
  //   description: string;
  //   category: string;
  // }
  
  // const Index: React.FC = () => {
  //   const [transactions, setTransactions] = useState<Transaction[]>([]);
  //   const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  
  //   const handleAddOrUpdateTransaction = (transaction: Transaction) => {
  //     setTransactions((prev) => {
  //       const existingIndex = prev.findIndex((t) => t.id === transaction.id);
  //       if (existingIndex !== -1) {
  //         const updatedTransactions = [...prev];
  //         updatedTransactions[existingIndex] = transaction;
  //         return updatedTransactions;
  //       }
  //       return [...prev, transaction];
  //     });
  //     setEditingTransaction(null);
  //   };
  
  //   const handleEdit = (transaction: Transaction) => {
  //     setEditingTransaction(transaction);
  //   };
  
  //   const handleDelete = (id: number) => {
  //     setTransactions((prev) => prev.filter((t) => t.id !== id));
  //   };
  
  //   const totalExpenses = transactions.reduce((acc, t) => acc + t.amount, 0);
  
  //   const categoryBreakdown = transactions.reduce<Record<string, number>>((acc, t) => {
  //     acc[t.category] = (acc[t.category] || 0) + t.amount;
  //     return acc;
  //   }, {});
  
  //   return (
  //     <div className="p-4">
  //       <h1 className="text-2xl font-bold mb-4">Expense Tracker</h1>
  
  //       <TransactionForm onSubmit={handleAddOrUpdateTransaction} editingTransaction={editingTransaction} />
  
  //       <div className="mt-4 p-4 border rounded shadow-md">
  //         <h2 className="text-xl font-semibold">Summary</h2>
  //         <p>Total Expenses: ${totalExpenses.toFixed(2)}</p>
  //         <h3 className="mt-2 font-semibold">Category Breakdown:</h3>
  //         <ul>
  //           {Object.entries(categoryBreakdown).map(([category, amount]) => (
  //             <li key={category}>
  //               {category}: ${amount.toFixed(2)}
  //             </li>
  //           ))}
  //         </ul>
  //       </div>
  
  //       <h2 className="text-xl font-semibold mt-4">Transactions</h2>
  //       <ul className="mt-2">
  //         {transactions.map((transaction) => (
  //           <li key={transaction.id} className="border p-2 rounded flex justify-between items-center">
  //             <span>
  //               {transaction.date} - {transaction.description} (${transaction.amount}) [{transaction.category}]
  //             </span>
  //             <div>
  //               <button className="bg-blue-500 text-white px-2 py-1 mr-2 rounded" onClick={() => handleEdit(transaction)}>
  //                 Edit
  //               </button>
  //               <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDelete(transaction.id)}>
  //                 Delete
  //               </button>
  //             </div>
  //           </li>
  //         ))}
  //       </ul>
  //     </div>
  //   );
  // };
  
  // export default Index;
  
  
  // // export default function Home() {
    // //   return (
      // //     <div >
      
      // //       Mayank 
      // //     </div>
      // //   );
      // // }
      