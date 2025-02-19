import React, { useState, useEffect } from 'react';
import TransactionForm from '../components/TransactionForm';
import Budgeting from "../components/Budgeting";
import { toast } from "react-toastify";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-4">📌 Personal Finance Tracker</h1>

        {/* Transaction Form */}
      <div  className="flex justify-center mt-4">
        <TransactionForm onSubmit={handleAddTransaction} editingTransaction={editingTransaction  || undefined} />
      </div>

         {/* Budgeting Component */}
     <div className="mt-8">
       <Budgeting transactions={transactions} />
     </div>


<div className='max-w-7xl mx-auto p-4 mt-8 mb-8 bg-white rounded-xl shadow-lg space-y-8'>
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 gap-y-8 mt-8">
  {/* Recent Transactions Card */}
  <div className="bg-gray-100 p-6 rounded-lg shadow-md mt-8">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Transactions</h3>
    <ul className="space-y-2">
      {recentTransactions.slice(-5).map((transaction) => (
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


  {/* Total Expenses Card */}
  {/* <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg flex flex-col justify-between space-y-4"> */}
  <div className="bg-gray-100 p-6 rounded-lg shadow-md">
    <h3 className="text-xl font-semibold">Total Expenses</h3>
    <p className="text-3xl font-bold">₹{totalExpenses.toFixed(2)}</p>
  </div>

</div>
</div>

      {/* Monthly Expenses Bar Chart */}
    <div className="max-w-7xl mx-auto p-6 mb-4 bg-white rounded-xl shadow-lg space-y-8">
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 ">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full md:w-2/3">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">📊 Monthly Expenses</h2>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart data={monthlyExpenses}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" className="text-gray-600" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="expenses" fill="#6366F1" />
          </BarChart>
        </ResponsiveContainer>
    </div>

      {/* Category Expenses Pie Chart */}
      <div className="bg-white shadow-lg rounded-xl p-6 w-full md:w-1/3">
        <span className="text-2xl font-semibold text-gray-700 mb-4">🍕 Category Expenses</span>
        <ResponsiveContainer width={300} height={300}>
          <PieChart>
            <Pie
              data={categoryExpenses}
              dataKey="expenses"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#6366F1"
              label
            >
              {categoryExpenses.map((entry) => (
                <Cell key={entry.category} fill={categoryColors[entry.category] || '#6366F1'} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
    </div>


      {/* Transaction List */}
      <div className="max-w-7xl mx-auto p-8 bg-white rounded-xl shadow-lg space-y-8">
<div className="mt-4 bg-white shadow-lg rounded-xl p-6">
  <h2 className="text-2xl font-semibold text-gray-700 mb-4">📜 Transaction List</h2>
  
  {transactions.length === 0 ? (
    <p className="text-gray-500 text-center">No transactions available</p>
  ) : (
    <ul className="space-y-4">
      {transactions.slice().reverse().map((transaction) => (
        <li 
          key={transaction._id} 
          className="p-4 border border-gray-300 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 hover:bg-gray-100 transition-all duration-200"
        >
          {/* Left Section - Transaction Details */}
          <div className="text-gray-800 w-full sm:w-3/4">
            <p><strong className="text-gray-600">Amount:</strong> <span className="text-green-600 font-medium">₹{transaction.amount}</span></p>
            <p><strong className="text-gray-600">Date:</strong> {new Date(transaction.date).toLocaleDateString()}</p>
            <p><strong className="text-gray-600">Description:</strong> {transaction.description}</p>
            <p><strong className="text-gray-600">Category:</strong> <span className="text-blue-500">{transaction.category}</span></p>
          </div>

          {/* Right Section - Buttons */}
          <div className="flex space-x-2 mt-3 sm:mt-0">
            <button 
              onClick={() => { 
                handleEditTransaction(transaction);
                setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 200);
              }} 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-all duration-200"
            >
              ✏️ Edit
            </button>

            <button 
              onClick={() => handleDeleteTransaction(transaction)} 
              className="bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition-all duration-200"
            >
              🗑️ Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  )}
</div>
</div>

    </div>
  );
};

export default Home;



// import React, { useState } from 'react';
// import TransactionForm from '../components/TransactionForm';
// import Budgeting from "../components/Budgeting";
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// interface Transaction {
//   id?: number;
//   amount: number;
//   date: string;
//   description: string;
//   category: string;
// }

// // const categories = [
// //   'Food',
// //   'Transport',
// //   'Entertainment',
// //   'Bills',
// //   'Health',
// //   'Other',
// // ];

// const Home = () => {
//   const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

//   const handleAddTransaction = (transaction: Transaction) => {
//     const newTransaction = { 
//       ...transaction,
//       id: editingTransaction ? editingTransaction.id : Date.now() // Keep the original ID when editing 
//       // id: Date.now()
//     };

//     // console.log("handleAddTransaction  with ID:", transaction.id);
//     if (editingTransaction) {
//       setTransactions((prevTransactions) =>
//         prevTransactions.map((t) => (t.id === editingTransaction.id ? newTransaction : t))
//       );
//       setEditingTransaction(null);
//     } else {
//       setTransactions((prevTransactions) => [...prevTransactions, { ...newTransaction, id: Date.now() }]);
//     }
//   };

//   const categoryColors: { [key: string]: string } = {
//     Food: '#ff6384',
//     Transport: '#36a2eb',
//     Entertainment: '#ffce56',
//     Bills: '#4bc0c0',
//     Health: '#9966ff',
//     Other: '#ff9f40',
//   };

//   const handleDeleteTransaction = (transaction: Transaction) => {
//     const id = transaction.id
//     setTransactions((prevTransactions) => prevTransactions.filter((t) => t.id !== id));
//   };

//   const handleEditTransaction = (transaction: Transaction) => {
//     setEditingTransaction(transaction);
//   };

//   const getMonthlyExpenses = () => {
//     const expensesByMonth: { [key: string]: number } = {};

//     transactions.forEach((transaction) => {
//       const month = new Date(transaction.date).toLocaleString('default', { month: 'short', year: 'numeric' });
//       expensesByMonth[month] = (expensesByMonth[month] || 0) + transaction.amount;
//     });

//     return Object.keys(expensesByMonth).map((month) => ({
//       month,
//       expenses: expensesByMonth[month],
//     }));
//   };

//   const getCategoryExpenses = () => {
//     const expensesByCategory: { [key: string]: number } = {};

//     transactions.forEach((transaction) => {
//       expensesByCategory[transaction.category] = (expensesByCategory[transaction.category] || 0) + transaction.amount;
//     });

//     return Object.keys(expensesByCategory).map((category) => ({
//       category,
//       expenses: expensesByCategory[category],
//     }));
//   };

//   const getSummary = () => {
//     const totalExpenses = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
//     const categoryExpenses = getCategoryExpenses();

//     return {
//       totalExpenses,
//       categoryExpenses,
//       recentTransactions: transactions.slice(0, 5),
//     };
//   };

//   const monthlyExpenses = getMonthlyExpenses();
//   const { totalExpenses, categoryExpenses, recentTransactions } = getSummary();

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold">Personal Finance Tracker</h1>

//       {/* Transaction Form */}
//       <TransactionForm onSubmit={handleAddTransaction} editingTransaction={editingTransaction  || undefined}
//       //  categories={categories} 
//        />

//         {/* Budgeting Component */}
//     <div className="mt-8">
//       <Budgeting transactions={transactions} />
//     </div>

//       {/* Dashboard Summary Cards */}
//       <div className="grid grid-cols-3 gap-4 mt-8">
//         <div className="bg-gray-200 p-4 rounded">
//           <h3 className="text-xl font-semibold">Total Expenses</h3>
//           <p className="text-2xl">Rs{totalExpenses.toFixed(2)}</p>
//         </div>
//         <div className="bg-gray-200 p-4 rounded">
//           <h3 className="text-xl font-semibold">Category Breakdown</h3>
//           <ul>
//             {categoryExpenses.map(({ category, expenses }) => (
//               <li key={category} className="flex justify-between py-1">
//                 <span className="mr-2">{category}</span>
//                 <span>Rs{expenses.toFixed(2)}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//         <div className="bg-gray-200 p-4 rounded">
//           <h3 className="text-xl font-semibold">Recent Transactions</h3>
//           <ul>

//           {recentTransactions
//       .slice(-5) // Get the last 5 added transactions
//       // .reverse() // Reverse to show the latest added first
//       .map((transaction) => (
//         <li key={transaction.id} className="flex justify-between py-1">
//           <span className="mr-2">{transaction.description}</span> {/* Adds spacing */}
//           <span className="font-medium">Rs{transaction.amount}</span>
//         </li>
//       ))}

//             {/* {recentTransactions.map((transaction) => (
//               <li key={transaction.id} className="flex justify-between">
//                 <span>{transaction.description}</span>
//                 <span>Rs{transaction.amount}</span>
//               </li>
//             ))} */}
//           </ul>
//         </div>
//       </div>

//       {/* Monthly Expenses Bar Chart */}
//       <div className="mt-8">
//         <h2 className="text-xl font-semibold">Monthly Expenses</h2>
//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart data={monthlyExpenses}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="month" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="expenses" fill="#8884d8" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Category Expenses Pie Chart */}
//       <div className="mt-8">
//         <h2 className="text-xl font-semibold">Category Expenses</h2>
//         <ResponsiveContainer width="100%" height={300}>
//           <PieChart>
//             <Pie data={categoryExpenses} dataKey="expenses" nameKey="category" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
//               {categoryExpenses.map((entry) => (
//                 <Cell key={entry.category} fill={categoryColors[entry.category] || '#8884d8'} />
//               ))}
//             </Pie>
//             <Tooltip /> 
//           </PieChart>
//         </ResponsiveContainer>

//         {/* <ResponsiveContainer width="100%" height={300}>
//           <PieChart>
//             <Pie data={categoryExpenses} dataKey="expenses" nameKey="category" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
//               {categoryExpenses.map((entry, index) => <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#8884d8' : '#82ca9d'} />)}
//             </Pie>
//           </PieChart>
//         </ResponsiveContainer> */}
//       </div>

//       {/* Transaction List */}
//       <div className="mt-8">
//         <h2 className="text-xl font-semibold">Transaction List</h2>
//         <ul className="space-y-4">
//           {transactions.reverse().map((transaction) => (
//             <li key={transaction.id} className="p-4 border rounded flex justify-between items-center">
//               <div>
//                 <strong>Amount:</strong> Rs{transaction.amount} <br />
//                 <strong>Date:</strong> {transaction.date} <br />
//                 <strong>Description:</strong> {transaction.description} <br />
//                 <strong>Category:</strong> {transaction.category}
//               </div>
//               <div className="flex space-x-2">
//                 <button onClick={() => { handleEditTransaction(transaction); 
//                   setTimeout(() => {
//                             window.scrollTo({top: 0, behavior: 'smooth' }) 
//                           }, 200);
//                  }} className="bg-blue-500 text-black border border-blue-700 px-3 py-1 rounded hover:bg-blue-600">
//                   Edit
//                 </button>
//                 <button onClick={() => handleDeleteTransaction(transaction)} className="bg-red-500 text-black border-2 border-red-900 px-3 py-1 rounded hover:bg-red-600">
//                   Delete
//                 </button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default Home;


// // normal code of monthly summary caomarision

// // import React, { useState } from 'react';
// // import TransactionForm from '../components/TransactionForm';
// // import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// // interface Transaction {
// //     id?: number;
// //     amount: number;
// //     date: string;
// //     description: string;
// //   }
  
// //   const Home = () => {
// //       const [transactions, setTransactions] = useState<Transaction[]>([]);
// //       const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
        
// //           // Handle adding a new transaction or updating an existing one
// //           const handleAddTransaction = (transaction: Transaction) => {

// //     const newTransaction = { 
// //       ...transaction, 
// //       id: Date.now() // Assign a unique ID based on timestamp
// //     };

// //     console.log("handleAddTransaction  with ID:", newTransaction.id);
// //     if (editingTransaction) {
// //       // Update existing transaction
// //       setTransactions((prevTransactions) =>
// //         prevTransactions.map((t) => (t.id === editingTransaction.id ? transaction : t))
// //       );
// //       setEditingTransaction(null); // Reset edit state
// //     } else {
// //         // Add new transaction
// //         setTransactions((prevTransactions) => [...prevTransactions, { ...transaction, id: Date.now() }]);
// //       }
// //     };
  
// //     // Handle deleting a transaction
// //     const handleDeleteTransaction = (id: number) => {
// //     console.log("Deleting Transaction with ID:", id);
// //     setTransactions((prevTransactions) => prevTransactions.filter((t) => t.id !== id));
// //   };

// //   // Handle editing a transaction
// //   const handleEditTransaction = (transaction: Transaction) => {
// //     console.log("edit Transaction with ID:", transaction);
// //     setEditingTransaction(transaction);
// //   };

// //   // Aggregate transactions by month for the chart
// //   const getMonthlyExpenses = () => {
// //       const expensesByMonth: { [key: string]: number } = {};
  
// //       transactions.forEach((transaction) => {
// //           const month = new Date(transaction.date).toLocaleString('default', { month: 'short', year: 'numeric' });
// //           expensesByMonth[month] = (expensesByMonth[month] || 0) + transaction.amount;
// //         });
    
// //         return Object.keys(expensesByMonth).map((month) => ({
// //             month,
// //             expenses: expensesByMonth[month],
// //           }));
// //         };
      
// //         const monthlyExpenses = getMonthlyExpenses();
      
// //         return (
// //     <div className="container mx-auto p-4">
// //       <h1 className="text-2xl font-bold">Personal Finance Tracker</h1>
      
// //       {/* Transaction Form */}
// //       <TransactionForm onSubmit={handleAddTransaction} editingTransaction={editingTransaction} />
      
// //       {/* Monthly Expenses Bar Chart */}
// //       <div className="mt-8">
// //         <h2 className="text-xl font-semibold">Monthly Expenses</h2>
// //         <ResponsiveContainer width="100%" height={300}>
// //           <BarChart data={monthlyExpenses}>
// //             <CartesianGrid strokeDasharray="3 3" />
// //             <XAxis dataKey="month" />
// //             <YAxis />
// //             <Tooltip />
// //             <Legend />
// //             <Bar dataKey="expenses" fill="#8884d8" />
// //           </BarChart>
// //         </ResponsiveContainer>
// //       </div>

// //       {/* Transaction List */}
// //       <div className="mt-8">
// //         <h2 className="text-xl font-semibold">Transaction List</h2>
// //         <ul className="space-y-4">
// //           {transactions.map((transaction) => (
// //               <li key={transaction.id} className="p-4 border rounded flex justify-between items-center">
// //                 <div>
// //                   <strong>Amount:</strong> ${transaction.amount} <br />
// //                   <strong>Date:</strong> {transaction.date} <br />
// //                   <strong>Description:</strong> {transaction.description}
// //                 </div>
// //                 <div className="flex space-x-2">
// //                   <button onClick={() =>{ handleEditTransaction(transaction);
// //                    setTimeout(() => {
// //         window.scrollTo({top: 0, behavior: 'smooth' }) 
// //       }, 200);
// //        }}  className="bg-blue-500 text-black border border-blue-700 px-3 py-1 rounded hover:bg-blue-600">
// //                     Edit
// //                   </button>
// //                   <button onClick={() => handleDeleteTransaction(transaction.id)} className="bg-red-500 text-black border-2 border-red-900 px-3 py-1 rounded hover:bg-red-600">
// //                     Delete
// //                   </button>
// //                 </div>
// //               </li>
// //             ))}
// //           </ul>
// //         </div>
// //       </div>
// //     );
// //   };
  
// //   export default Home;


//   // This code is able to provide total summary and total expenses and description of the expenses
//   // import React, { useState } from 'react';
//   // import TransactionForm from '../components/TransactionForm';
  
//   // interface Transaction {
//   //   id: number;
//   //   amount: number;
//   //   date: string;
//   //   description: string;
//   //   category: string;
//   // }
  
//   // const Index: React.FC = () => {
//   //   const [transactions, setTransactions] = useState<Transaction[]>([]);
//   //   const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  
//   //   const handleAddOrUpdateTransaction = (transaction: Transaction) => {
//   //     setTransactions((prev) => {
//   //       const existingIndex = prev.findIndex((t) => t.id === transaction.id);
//   //       if (existingIndex !== -1) {
//   //         const updatedTransactions = [...prev];
//   //         updatedTransactions[existingIndex] = transaction;
//   //         return updatedTransactions;
//   //       }
//   //       return [...prev, transaction];
//   //     });
//   //     setEditingTransaction(null);
//   //   };
  
//   //   const handleEdit = (transaction: Transaction) => {
//   //     setEditingTransaction(transaction);
//   //   };
  
//   //   const handleDelete = (id: number) => {
//   //     setTransactions((prev) => prev.filter((t) => t.id !== id));
//   //   };
  
//   //   const totalExpenses = transactions.reduce((acc, t) => acc + t.amount, 0);
  
//   //   const categoryBreakdown = transactions.reduce<Record<string, number>>((acc, t) => {
//   //     acc[t.category] = (acc[t.category] || 0) + t.amount;
//   //     return acc;
//   //   }, {});
  
//   //   return (
//   //     <div className="p-4">
//   //       <h1 className="text-2xl font-bold mb-4">Expense Tracker</h1>
  
//   //       <TransactionForm onSubmit={handleAddOrUpdateTransaction} editingTransaction={editingTransaction} />
  
//   //       <div className="mt-4 p-4 border rounded shadow-md">
//   //         <h2 className="text-xl font-semibold">Summary</h2>
//   //         <p>Total Expenses: ${totalExpenses.toFixed(2)}</p>
//   //         <h3 className="mt-2 font-semibold">Category Breakdown:</h3>
//   //         <ul>
//   //           {Object.entries(categoryBreakdown).map(([category, amount]) => (
//   //             <li key={category}>
//   //               {category}: ${amount.toFixed(2)}
//   //             </li>
//   //           ))}
//   //         </ul>
//   //       </div>
  
//   //       <h2 className="text-xl font-semibold mt-4">Transactions</h2>
//   //       <ul className="mt-2">
//   //         {transactions.map((transaction) => (
//   //           <li key={transaction.id} className="border p-2 rounded flex justify-between items-center">
//   //             <span>
//   //               {transaction.date} - {transaction.description} (${transaction.amount}) [{transaction.category}]
//   //             </span>
//   //             <div>
//   //               <button className="bg-blue-500 text-white px-2 py-1 mr-2 rounded" onClick={() => handleEdit(transaction)}>
//   //                 Edit
//   //               </button>
//   //               <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDelete(transaction.id)}>
//   //                 Delete
//   //               </button>
//   //             </div>
//   //           </li>
//   //         ))}
//   //       </ul>
//   //     </div>
//   //   );
//   // };
  
//   // export default Index;
  
  
//   // // export default function Home() {
//     // //   return (
//       // //     <div >
      
//       // //       Mayank 
//       // //     </div>
//       // //   );
//       // // }
      