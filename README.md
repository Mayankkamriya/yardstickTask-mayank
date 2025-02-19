# 💰 Personal Finance Visualizer (yardstickTask-mayank)

## 📌 Overview
The **Personal Finance Visualizer** is a modern web-based application designed to help users efficiently track their expenses. It provides insightful visualizations, transaction management, and downloadable reports to enhance financial awareness.

## 🚀 Features
✅ **Expense Tracking** - Seamlessly add, update, and delete transactions.  
✅ **Recent Transactions** - Instantly view a summary of the latest financial activities.  
✅ **Total Expenses Calculation** - Get real-time updates on total expenditures.  
✅ **Category-Based Analysis** - Monitor spending patterns through categorized insights.  
✅ **Data Storage** - Securely store transactions using **MongoDB (or Local Storage as a fallback)**.   
✅ **Transaction History** -  View all recorded transactions in one place.      
✅ **Deployed Version Available** - Access the application online anytime.  

## 🛠 Tech Stack
- **Frontend:** Next.js, Tailwind CSS
- **Backend:** Node.js
- **Database:** MongoDB (or Local Storage as fallback)
- **Charts & Visualizations:** Recharts (Bar & Pie Charts)

## 🔥 API Endpoints
- `GET /api//transactions` - Fetch all transactions
- `POST /api//transactions` - Add a new transaction
- `PUT /api//transactions/:id` - Update an existing transaction
- `DELETE /api//transactions/:id` - Remove a transaction

## 📂 Installation & Setup
1. Clone the repository:  
   ```bash
   git clone https://github.com/your-username/yardstickTask-mayank.git
   cd yardstickTask-mayank
   ```
2. Install dependencies:  
   ```bash
   npm install
   ```
3. Start the development server:  
   ```bash
   npm run dev
   ```
4. Open the app at: [http://localhost:3000](http://localhost:3000)

## 🌍 Deployment
The project is deployed online. You can access it here:  
🔗 **Live Demo:** [https://mayankyardstick.vercel.app](https://mayankyardstick.vercel.app)  

## ❗ Known Issues

   - **Bug**: When clicking the Edit button, the date field is not getting set properly.
   - **Cause**: The date state is not being correctly initialized when loading the edit form.
   - **Status**: Identified
   - **Workaround**: Manually reselect the date before saving.

Planned Fix: Updating the state management to ensure the date field is set correctly when editing an entry.

## 🤝 Contribution
Contributions are welcome! Feel free to fork this repository and submit a pull request with improvements.

## 📜 License
This project is licensed under the MIT License.

