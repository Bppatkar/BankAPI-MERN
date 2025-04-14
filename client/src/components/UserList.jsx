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
    <div className="bg-[#F8FAFC] min-h-screen p-6">
  <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-[#E2E8F0] p-6">
    <h2 className="text-2xl font-dm font-semibold text-[#0F172A] mb-4">Customer Overview</h2>

    <div className="grid gap-4">
      {users.map(user => (
        <div
          key={user._id}
          className="bg-[#F1F5F9] hover:bg-[#E0F2FE] p-4 rounded-xl flex justify-between items-center transition"
        >
          <div>
            <p className="text-lg font-dm text-[#0F172A]">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-gray-500">{user.email}</p>
            <p className="text-base font-space text-blue-600 mt-1">
              Balance: {formatCurrency(accounts[user._id] || 0)}
            </p>
          </div>
          <button
            onClick={() => deleteUser(user._id)}
            className="flex items-center gap-2 text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg shadow font-medium"
          >
            <TrashIcon className="w-4 h-4" />
            Delete
          </button>
        </div>
      ))}
    </div>
  </div>
</div>

  );
}

export default UserList;
