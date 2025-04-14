import { useEffect, useState } from "react";
import axios from "axios";

export default function TransactionForm({ onTransactionComplete }) {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    type: "deposit",
    fromUser: "",
    toUser: "",
    amount: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/users");
        setUsers(res.data.users);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate amount
    if (isNaN(formData.amount)) {
      setMessage("Amount must be a number");
      return;
    }

    let payload = { 
      type: formData.type, 
      amount: Number(formData.amount) 
    };
  
    if (formData.type === "deposit") {
      payload.accountId = formData.fromUser;
    } else if (formData.type === "withdraw") {
      payload.accountId = formData.fromUser;
    } else if (formData.type === "transfer") {
      payload.fromAccountId = formData.fromUser;
      payload.toAccountId = formData.toUser;
    }
  
    try {
      await axios.post("/api/transactions/" + formData.type, payload);
      setMessage("Transaction successful");
      setFormData({ 
        type: "deposit", 
        fromUser: "", 
        toUser: "", 
        amount: "" 
      });
      onTransactionComplete?.();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Transaction failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-semibold">Make a Transaction</h2>

      <div className="grid grid-cols-1 gap-4">
        <select 
          name="type" 
          value={formData.type} 
          onChange={handleChange} 
          className="p-2 border rounded w-full"
        >
          <option value="deposit">Deposit</option>
          <option value="withdraw">Withdraw</option>
          <option value="transfer">Transfer</option>
        </select>

        <select 
          name="fromUser" 
          value={formData.fromUser} 
          onChange={handleChange} 
          className="p-2 border rounded w-full"
          required
        >
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user._id} value={user.accountId}>
              {user.firstName} {user.lastName} (Acct: {user.accountId?.slice(-4)})
            </option>
          ))}
        </select>

        {formData.type === "transfer" && (
          <select 
            name="toUser" 
            value={formData.toUser} 
            onChange={handleChange} 
            className="p-2 border rounded w-full"
            required
          >
            <option value="">Select Recipient</option>
            {users
              .filter(user => user._id !== formData.fromUser)
              .map((user) => (
                <option key={user._id} value={user.accountId}>
                  {user.firstName} {user.lastName} (Acct: {user.accountId?.slice(-4)})
                </option>
              ))}
          </select>
        )}

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          className="p-2 border rounded w-full"
          min="0.01"
          step="0.01"
          required
        />

        <button 
          type="submit" 
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Submit
        </button>

        {message && (
          <p className={`text-sm ${
            message.includes("success") ? "text-green-700" : "text-red-600"
          }`}>
            {message}
          </p>
        )}
      </div>
    </form>
  );
}