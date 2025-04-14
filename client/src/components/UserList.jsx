import React from "react";
import axios from "axios";

export default function UserList({ users, onUserDeleted, onUserSelected }) {
  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`/api/users/${userId}`);
      onUserDeleted?.(); // Notify parent to refresh users and transactions
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-[#E2E8F0] p-6">
        <h2 className="text-2xl font-dm font-semibold text-[#0F172A] mb-4">
          Customer Overview
        </h2>

        <div className="grid gap-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-[#F1F5F9] hover:bg-[#E0F2FE] p-4 rounded-xl flex justify-between items-center transition cursor-pointer"
              onClick={() => onUserSelected?.(user)} // Notify parent when a user is clicked
            >
              <div>
                <p className="text-lg font-dm text-[#0F172A]">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering user selection
                  deleteUser(user._id);
                }}
                className="flex items-center gap-2 text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg shadow font-medium"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
