import React, { useEffect, useState } from "react";
import axios from "axios";
import { TrashIcon } from "@heroicons/react/24/outline";

function UserList() {
  const [users, setUsers] = useState([]);
  const [accounts, setAccounts] = useState({});

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/users");
      const userList = res.data.users || [];
      setUsers(userList);

      const balances = await Promise.all(
        userList.map((user) =>
          axios
            .get(`/api/users/${user._id}`)
            .then((res) => ({
              userId: user._id,
              balance: res.data.accountId?.balance || 0,
            }))
            .catch(() => ({ userId: user._id, balance: 0 }))
        )
      );

      const accountData = {};
      balances.forEach(({ userId, balance }) => {
        accountData[userId] = balance;
      });

      setAccounts(accountData);
    } catch (err) {
      console.error("Fetch users failed:", err);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`/api/users/${userId}`);
      fetchUsers();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 w-full">
      <h2 className="text-xl font-semibold mb-4">All Users</h2>
      {users.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        users.map((user) => (
          <div
            key={user._id}
            className="flex justify-between items-center border p-2 mb-2 rounded"
          >
            <div>
              <p>
                {user.firstName} {user.lastName} - {user.email}
              </p>
              <p className="text-sm text-gray-600">
                Balance: {formatCurrency(accounts[user._id] || 0)}
              </p>
            </div>
            <button
              onClick={() => deleteUser(user._id)}
              className="flex items-center gap-1 text-white bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-sm transition"
            >
              <TrashIcon className="w-4 h-4" />
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default UserList;
