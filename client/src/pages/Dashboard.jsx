import { useEffect, useState } from "react";
import axios from "axios";
import UserForm from "../components/UserForm";
import UserList from "../components/UserList";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]); // new

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
      <TransactionForm onTransactionComplete={fetchTransactions} />
      <TransactionList transactions={transactions} users={users} />
      <UserForm onUserCreated={fetchUsers} />
      <UserList users={users} />
    </div>
  );
}
