bank-api/
├── client/
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ │ ├── TransactionForm.jsx
│ │ │ ├── TransactionList.jsx
│ │ │ ├── UserForm.jsx
│ │ │ └── UserList.jsx
│ │ ├── pages/
│ │ │ ├── Dashboard.jsx
│ │ │ └── App.jsx
│ │ └── index.js
│ └── package.json
├── server/
│ ├── config/
│ │ └── constants.js
│ ├── controllers/
│ │ ├── accountController.js
│ │ ├── transactionController.js
│ │ └── userController.js
│ ├── middleware/
│ │ ├── createTransaction.js
│ │ └── errorHandler.js
│ ├── models/
│ │ ├── accountSchema.js
│ │ ├── transactionSchema.js
│ │ └── userModel.js
│ ├── routes/
│ │ ├── transactions.js
│ │ ├── userAccounts.js
│ │ └── userRoutes.js
│ ├── db/
│ │ └── database.js
│ ├── .env
│ ├── package.json
│ └── server.js
└── README.md
