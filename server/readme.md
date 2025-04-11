# client

src/
├── api/ # API service layer
│ └── bankingApi.js # Axios instance and API calls
├── assets/ # Static assets
│ └── styles/ # Global styles
├── components/ # Reusable components
│ ├── auth/
│ │ ├── LoginForm.jsx
│ │ └── RegisterForm.jsx
│ ├── accounts/
│ │ ├── AccountCard.jsx
│ │ └── AccountList.jsx
│ ├── transactions/
│ │ ├── TransactionForm.jsx
│ │ └── TransactionList.jsx
│ └── shared/
│ ├── Layout.jsx
│ └── Navbar.jsx
├── hooks/ # Custom hooks
│ ├── useAuth.js
│ └── useAccounts.js
├── App.jsx
├── main.jsx
└── index.html

# Server

server/
├── constants/
│ └── constantError.js
├── controllers/
│ ├── accountController.js
│ ├── transactionController.js
│ └── userController.js
├── db/
│ └── database.js
├── middleware/
│ ├── authMiddleware.js
│ ├── createTransaction.js
│ └── errorHandler.js
├── models/
│ ├── accountSchema.js
│ ├── transactionSchema.js
│ └── userModel.js
├── routes/
│ ├── accountRoutes.js
│ ├── transactionRoutes.js
│ └── userRoutes.js
├── .env
├── .gitignore
├── app.js
├── package.json
└── README.md
