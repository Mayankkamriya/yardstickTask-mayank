// pages/index.tsx
import React, { useState } from 'react';
import TransactionForm from '../components/TransactionForm';

const Home = () => {
  const [transactions, setTransactions] = useState<{ amount: number; date: string; description: string }[]>([]);

  const handleAddTransaction = (transaction: { amount: number; date: string; description: string }) => {
    setTransactions((prevTransactions) => [...prevTransactions, transaction]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Personal Finance Tracker</h1>
      <TransactionForm onSubmit={handleAddTransaction} />
      
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
