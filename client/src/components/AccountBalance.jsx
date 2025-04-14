import { useState, useEffect } from "react";
import axios from "axios";

export default function AccountBalance({ accountId }) {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!accountId) return;

    const fetchBalance = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`/api/accounts/balance/${accountId}`);
        // console.log("Account ID:", accountId);
        // console.log("Balance API Response:", res.data);

        // Access the balance property explicitly
        const fetchedBalance = parseFloat(res.data.balance) || 0; // Ensure balance is a number
        setBalance(fetchedBalance);
      } catch (err) {
        console.error("Failed to fetch account balance", err);
        setError("Failed to load balance");
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [accountId]);

  if (loading) {
    return <p>Loading balance...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold">Account Balance</h3>
      <p className="text-gray-600">
        Balance: ₹{Number(balance)?.toFixed(2) || "0.00"}
      </p>
    </div>
  );
}
