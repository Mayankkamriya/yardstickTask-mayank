import React, { useState, useEffect } from 'react';

interface TransactionFormProps {
  onSubmit: (transaction: { id?: number; amount: number; date: string; description: string }) => void;
  editingTransaction?: { id: number; amount: number; date: string; description: string } | null;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit, editingTransaction }) => {
  const [amount, setAmount] = useState<number | string>('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  // Fill the form when editing a transaction
  useEffect(() => {
    console.log("Editing Transaction Data:", editingTransaction); 
    if (editingTransaction) {
      setAmount(editingTransaction.amount);
      setDate(editingTransaction.date);
      setDescription(editingTransaction.description);
    }
  }, [editingTransaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !date || !description) return;

    onSubmit({
      id: editingTransaction?.id ?? Date.now(), // If editing, keep the same ID
      amount: Number(amount),
      date,
      description,
    });

    // Reset form after submission
    setAmount('');
    setDate('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow-md">
      <h2 className="text-xl font-semibold">{editingTransaction ? 'Edit Transaction' : 'Add Transaction'}</h2>
      
      <div className="mb-4">
        <label className="block">Amount ($):</label>
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

      <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
        {editingTransaction ? 'Update Transaction' : 'Add Transaction'}
      </button>
    </form>
  );
};

export default TransactionForm;

