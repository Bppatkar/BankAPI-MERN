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
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserTransactions, setSelectedUserTransactions] = useState([]);
  const [selectedUserBalance, setSelectedUserBalance] = useState(null);

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

  const fetchUserDetails = async (accountId) => {
    try {
      const balanceRes = await axios.get(`/api/accounts/balance/${accountId}`);
      console.log("Balance API Response:", balanceRes.data);

      // Access the balance property explicitly
      const balance = parseFloat(balanceRes.data.balance) || 0;

      const userTransactions = transactions.filter(
        (txn) =>
          txn.fromAccountId === accountId || txn.toAccountId === accountId
      );

      setSelectedUserBalance(balance);
      setSelectedUserTransactions(userTransactions);
    } catch (err) {
      console.error("Failed to fetch user details", err);
      setSelectedUserBalance(0); // Fallback to 0 if fetching balance fails
      setSelectedUserTransactions([]);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    fetchUserDetails(user.accountId);
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
              users={users}
              onTransactionComplete={() => {
                fetchTransactions();
                if (selectedUser) fetchUserDetails(selectedUser.accountId);
              }}
              onAccountSelect={(accountId) => fetchUserDetails(accountId)}
            />
          </div>
          {selectedUser && (
            <div className="card">
              <AccountBalance accountId={selectedUser.accountId} />
            </div>
          )}
        </div>
        <div className="card">
          {selectedUser ? (
            <>
              <h2 className="text-xl font-semibold mb-4">
                {selectedUser.firstName} {selectedUser.lastName}'s Transactions
              </h2>
              <TransactionList
                transactions={selectedUserTransactions}
                users={users}
              />
              <p className="mt-4 text-gray-600">
                Balance: ₹{Number(selectedUserBalance)?.toFixed(2) || "0.00"}
              </p>
            </>
          ) : (
            <TransactionList transactions={transactions} users={users} />
          )}
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
              if (selectedUser) setSelectedUser(null);
            }}
            onUserSelected={handleUserSelect} // Pass the user selection handler
          />
        </div>
      </div>
    </div>
  );
}
