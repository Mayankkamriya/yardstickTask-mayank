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
    <div className="mt-4 bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-3xl font-semibold text-gray-700 mb-4">
        📜 Transaction List
      </h2>

      {transactions.length === 0 ? (
        <p className="text-gray-500 text-center">No transactions available</p>
      ) : (
        <ul className="space-y-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {transactions
            .slice()
            .reverse()
            .map((transaction) => (
              <li
                key={transaction._id}
                className="p-4 border border-gray-300 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 hover:bg-gray-100 transition-all duration-200"
              >
                {/* Left Section - Transaction Details */}
                <div className="text-gray-800 w-full sm:w-3/4">
                  <p>
                    <strong className="text-gray-600">Amount:</strong>{" "}
                    <span className="text-green-600 font-medium">
                      ₹{transaction.amount}
                    </span>
                  </p>
                  <p>
                    <strong className="text-gray-600">Date:</strong>{" "}
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong className="text-gray-600">Description:</strong>{" "}
                    {transaction.description}
                  </p>
                  <p>
                    <strong className="text-gray-600">Category:</strong>{" "}
                    <span className="text-blue-500">{transaction.category}</span>
                  </p>
                </div>

                {/* Right Section - Buttons */}
                <div className="flex space-x-2 mt-3 sm:mt-0">



          <button 
  onClick={() => { 
    handleEditTransaction(transaction);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 200);
  }} 
  className="bg-[#f9fafb] text-black px-4 py-2 rounded-lg shadow-md hover:bg-gray-200 transition-all duration-300"
>
  ✏️ Edit
</button>

<button 
  onClick={() => handleDeleteTransaction(transaction)} 
  className="bg-[#f9fafb] text-black px-4 py-2 rounded-lg shadow-md hover:bg-gray-200 transition-all duration-300"
>
  🗑️ Delete
</button>




            </div>
            </li>
        ))}
    </ul>
  )}
</div>
  );
};

export default TransactionList;
