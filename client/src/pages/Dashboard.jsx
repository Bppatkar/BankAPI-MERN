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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="card">
            <TransactionForm
              users={users} // Pass the updated users list
              onTransactionComplete={() => {
                fetchTransactions();
                setSelectedAccount(null);
              }}
              onAccountSelect={setSelectedAccount}
            />
          </div>
          {selectedAccount && (
            <div className="card">
              <AccountBalance accountId={selectedAccount} />
            </div>
          )}
        </div>
        <div className="card">
          <TransactionList transactions={transactions} users={users} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <UserForm onUserCreated={fetchUsers} />
        </div>
        <div className="card">
          <UserList
            users={users}
            onUserDeleted={() => {
              fetchUsers();
              fetchTransactions();
            }}
          />
        </div>
      </div>
    </div>
  );
}
