import { useEffect, useState } from "react";
import axios from "axios";
import UserForm from "../components/UserForm";
import UserList from "../components/UserList";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import AccountBalance from "../components/AccountBalance";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/users");
      setUsers(res.data.users);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await axios.get("/api/transactions");
      setTransactions(res.data.transactions);
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchTransactions();
  }, []);

  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <TransactionForm 
            onTransactionComplete={() => {
              fetchTransactions();
              setSelectedAccount(null); // Reset to force balance refresh
            }} 
            onAccountSelect={setSelectedAccount}
          />
          {selectedAccount && <AccountBalance accountId={selectedAccount} />}
        </div>
        <TransactionList transactions={transactions} users={users} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UserForm onUserCreated={fetchUsers} />
        <UserList users={users} />
      </div>
    </div>
  );
}