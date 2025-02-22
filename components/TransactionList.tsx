import React from "react";

interface Transaction {
  _id?: string;
  amount: number;
  date: string;
  description: string;
  category: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  handleEditTransaction: (transaction: Transaction) => void;
  handleDeleteTransaction: (transaction: Transaction) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  handleEditTransaction,
  handleDeleteTransaction,
}) => {
  return (
     <div className=" bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-3xl font-semibold text-gray-700 mb-4 text-center">
          📜 Transaction List
        </h2>
  
    {transactions.length === 0 ? (
      <p className="text-gray-500 text-center">No transactions available</p>
    ) : (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 rounded-lg">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b text-left">Amount</th>
            <th className="py-2 px-4 border-b text-left">Date</th>
            <th className="py-2 px-4 border-b text-left">Description</th>
            <th className="py-2 px-4 border-b text-left">Category</th>
            <th className="py-2 px-4 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.slice().reverse().map((transaction) => (
            <tr key={transaction._id} className="hover:bg-gray-50 transition-all duration-200">
              <td className="py-2 px-4 border-b text-gray-800">₹{transaction.amount}</td>
              <td className="py-2 px-4 border-b text-gray-600">{new Date(transaction.date).toLocaleDateString()}</td>
              <td className="py-2 px-4 border-b text-gray-600">{transaction.description}</td>
              <td className="py-2 px-4 border-b text-blue-500">{transaction.category}</td>
              <td className="py-2 px-4 border-b">
                <div className="flex space-x-3">
                  <button 
                    onClick={() => { 
                      handleEditTransaction(transaction);
                      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 200);
                    }} 
                    className="bg-gray-100 text-black px-4 py-2 rounded-lg shadow-md hover:bg-gray-200 transition-all duration-300"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteTransaction(transaction)} 
                    className="bg-gray-100 text-black px-4 py-2 rounded-lg shadow-md hover:bg-gray-200 transition-all duration-300"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>
  );
};

export default TransactionList;
