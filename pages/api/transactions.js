import connectDB from '../../lib/db';  
import Transaction from '../../models/Transaction'; 

export default async function handler(req, res) {
  await connectDB();

  // below code for getting tranCTION -- Mayank
  if (req.method === 'GET') {
    try {
      const transactions = await Transaction.find(); 
      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching transactions', error });
    }
  } 
  else if (req.method === 'PUT') {
    // PUT: Update an existing transaction by ID
    const { id } = req.query;
    console.log('api/...for edit ',id, req.body )
    const { amount, date, description, category } = req.body;
    try {
      const updatedTransaction = await Transaction.findByIdAndUpdate(
        id,
        { amount, date, description, category },
        { new: true }
      );
      console.log('updated transaction...',updatedTransaction)
      if (!updatedTransaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
      
      res.status(200).json(updatedTransaction);
    } catch (error) {
      res.status(500).json({ message: 'Error updating transaction', error });
    }
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

  // below code for add tranCTION -- Mayank
  else if (req.method === 'POST') {
    try {
      const newTransaction = new Transaction(req.body); 
      await newTransaction.save();
      res.status(201).json(newTransaction);
    } catch (error) {
      console.error('Error adding transaction:', error.message || error); 
      res.status(500).json({ message: 'Error creating transaction',error: error.message || error });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}


// import dbConnect from '../../lib/db';  // A utility to connect to MongoDB
// import Transaction from '../../models/Transaction';  // The Transaction model

// export async function handler(req, res) {
//   await dbConnect(); // Connect to the MongoDB

//   if (req.method === 'GET') {
//     try {
//       const transactions = await Transaction.find(); // Get all transactions
//       res.status(200).json(transactions);
//     } catch (error) {
//       res.status(500).json({ message: 'Error fetching transactions', error });
//     }
//   } else if (req.method === 'POST') {
//     try {
//       const newTransaction = new Transaction(req.body); // Create new transaction
//       await newTransaction.save();
//       res.status(201).json(newTransaction); // Return the created transaction
//     } catch (error) {
//       res.status(500).json({ message: 'Error creating transaction', error });
//     }
//   } else {
//     res.status(405).json({ message: 'Method Not Allowed' });
//   }
// }
