import { useEffect, useState } from "react";
import axios from "axios";

export default function TransactionForm({
  users, // Receive the updated users list as a prop
  onTransactionComplete,
  onAccountSelect,
}) {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [formData, setFormData] = useState({
    type: "deposit",
    fromUser: "",
    toUser: "",
    amount: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "fromUser" && value) {
      // Fetch account balance when user is selected
      axios
        .get(`/api/accounts/balance/${value}`)
        .then((res) => setSelectedAccount(res.data))
        .catch((err) => console.error("Error fetching balance", err));
    }
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
      amount: Number(formData.amount),
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
        amount: "",
      });
      onTransactionComplete?.();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Transaction failed");
    }
  };

  const formatMoney = (value) =>
    value !== undefined && value !== null ? value.toFixed(2) : "0.00";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-semibold text-primary">
        Make a Transaction
      </h2>

      <div className="grid grid-cols-1 gap-4">
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="input-field"
        >
          <option value="deposit">Deposit</option>
          <option value="withdraw">Withdraw</option>
          <option value="transfer">Transfer</option>
        </select>

        <select
          name="fromUser"
          value={formData.fromUser}
          onChange={handleChange}
          className="input-field"
          required
        >
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user._id} value={user.accountId}>
              {user.firstName} {user.lastName} (Acct:{" "}
              {user.accountId?.slice(-4)})
            </option>
          ))}
        </select>

        {formData.type === "transfer" && (
          <select
            name="toUser"
            value={formData.toUser}
            onChange={handleChange}
            className="input-field"
            required
          >
            <option value="">Select Recipient</option>
            {users
              .filter((user) => user.accountId !== formData.fromUser)
              .map((user) => (
                <option key={user._id} value={user.accountId}>
                  {user.firstName} {user.lastName} (Acct:{" "}
                  {user.accountId?.slice(-4)})
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
          className="input-field"
          min="0.01"
          step="0.01"
          required
        />

        <button type="submit" className="button-primary">
          Submit
        </button>

        {message && (
          <p
            className={`text-sm ${
              message.includes("success") ? "text-green-700" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </form>
  );
}
