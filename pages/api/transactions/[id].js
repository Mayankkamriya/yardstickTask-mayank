import connectDB from '../../../lib/db';  
import Transaction from '../../../models/Transaction'; 

export default async function handler(req, res) {
  await connectDB();

  // this even we do not come
   if (req.method === 'PUT') {
    // PUT: Update an existing transaction by ID
    const { id } = req.query;
    const { amount, date, description, category } = req.body;
    try {
      const updatedTransaction = await Transaction.findByIdAndUpdate(
        id,
        { amount, date, description, category },
        { new: true }
      );
      if (!updatedTransaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
      
      res.status(200).json(updatedTransaction);
    } catch (error) {
      res.status(500).json({ message: 'Error updating transaction', error });
    }

     // below code for DElete tranCTION -- Mayank
  } else if (req.method === 'DELETE') {
    // DELETE: Delete a transaction by ID
    const { id } = req.query;
    try {
      const deletedTransaction = await Transaction.findByIdAndDelete(id);

      if (!deletedTransaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }

      res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting transaction', error });
    }
  } 
 else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
