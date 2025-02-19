import connectDB from '../../lib/db';  
import Transaction from '../../models/Transaction'; 
import { toast } from "react-toastify";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const transactions = await Transaction.find(); 
      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching transactions', error });
    }
  } 
  else if (req.method === 'POST') {
    try {
      const newTransaction = new Transaction(req.body); 
      await newTransaction.save();

        // Encode
        // const encodedto = `${process.env.ENCODETO}`
      //   const encodednewTransaction = Buffer.from(JSON.stringify(newTransaction)).toString(encodedto);
      //  console.log('encodedtransaction...',encodednewTransaction)
      toast.success("Transaction Added successfully!");
      res.status(201).json(newTransaction);
    } catch (error) {
      console.error('Error adding transaction:', error.message || error); 
      res.status(500).json({ message: 'Error creating transaction',error: error.message || error });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
