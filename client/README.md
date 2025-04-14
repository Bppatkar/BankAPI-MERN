# client
├── public
├── src/
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





├── src/
│   ├── assets/
│   ├── components/
│   │   └── shared/ (NavBar, Button, etc.)
│   ├── pages/
│   │   ├── Users/
│   │   ├── Accounts/
│   │   └── Transactions/
│   ├── services/         <-- Axios API calls
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── tailwind.config.js
├── vite.config.js
├── postcss.config.js
└── package.json
