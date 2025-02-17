import { useState } from 'react';

interface TransactionFormProps {
  onSubmit: (transaction: { amount: number; date: string; description: string }) => void;
  initialData?: { amount: number; date: string; description: string };
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit, initialData }) => {
  const [amount, setAmount] = useState<string>(initialData?.amount.toString() || ''); 
  const [date, setDate] = useState<string>(initialData?.date || '');
  const [description, setDescription] = useState<string>(initialData?.description || ''); 
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !date || !description) {
      setError('Please fill in all fields');
      return;
    }

    onSubmit({
      amount: parseFloat(amount),
      date,
      description,
    });

    setAmount('');
    setDate('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="amount" className="block text-sm font-medium">Amount</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input"
          required
        />
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium">Date</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)} 
          className="input"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium">Description</label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input"
          required
        />
      </div>

      {error && <div className="text-red-500">{error}</div>}

      <button type="submit" className="btn btn-primary">
        Add Transaction
      </button>
    </form>
  );
};

export default TransactionForm;

