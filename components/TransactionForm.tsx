import React, { useState, useEffect } from 'react';

interface TransactionFormProps {
  onSubmit: (transaction: { _id?: string; amount: number; date: string; description: string; category: string; }) => void;
  editingTransaction?: { _id?: string; amount: number; date: string; description: string; category: string; } | null;
}

const categories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Others'];

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit, editingTransaction }) => {
  const [amount, setAmount] = useState<number | string>('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0]);
  
  // Fill the form when editing a transaction
  useEffect(() => {
    // console.log("Editing Transaction Data:", editingTransaction); 
    if (editingTransaction) {
      setAmount(editingTransaction.amount);
      setDate(editingTransaction.date);
      setDescription(editingTransaction.description);
      setCategory(editingTransaction.category);

    }
  }, [editingTransaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !date || !description) return;

    const formattedDate = new Date(date).toISOString(); // Ensure proper date format

    onSubmit({
      // id: editingTransaction?._id , // If editing, keep the same ID
      amount: Number(amount),
      date :formattedDate,
      description,
      category,
    });

    // Reset form after submission
    setAmount('');
    setDate('');
    setDescription('');
    setCategory(categories[0]);
  };

  return (<>
  {/* original */}
    {/* <form onSubmit={handleSubmit} className="p-4 border rounded shadow-md w-4/5 ">
      <h2 className="text-xl font-semibold">{editingTransaction ? 'Edit Transaction' : 'Add Transaction'}</h2>
      
      <div className="mb-4">
        <label className="block">Amount (Rs):</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border rounded p-2 w-full"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block">Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded p-2 w-full"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block">Description:</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border rounded p-2 w-full"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block">Category:</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded p-2 w-full"
          required
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
        {editingTransaction ? 'Update Transaction' : 'Add Transaction'}
      </button>
    </form> */}


<form
  onSubmit={handleSubmit}
  className="max-w-7xl w-full mx-auto p-8 border rounded-lg shadow-lg bg-white"
>
  <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">
    {editingTransaction ? "Edit Transaction" : "Add Transaction"}
  </h2>

  {/* Form Grid Layout for Laptop View */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Amount Input */}
    <div className="space-y-2">
      <label className="block text-gray-700 font-medium">Amount (₹):</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        required
      />
    </div>

    {/* Date Input */}
    <div className="space-y-2">
      <label className="block text-gray-700 font-medium">Date:</label>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        required
      />
    </div>

    {/* Description Input */}
    <div className="space-y-2 col-span-2">
      <label className="block text-gray-700 font-medium">Description:</label>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        required
      />
    </div>

    {/* Category Dropdown */}
    <div className="space-y-2 col-span-2">
      <label className="block text-gray-700 font-medium">Category:</label>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        required
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  </div>

  {/* Submit Button */}
  <button
    type="submit"
    className="max-w-7xl mt-6 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-200"
  >
    {editingTransaction ? "Update Transaction" : "Add Transaction"}
  </button>
</form>

</>  );
};

export default TransactionForm;

