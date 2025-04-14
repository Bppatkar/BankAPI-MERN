import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AccountBalance({ accountId }) {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await axios.get(`/api/accounts/balance/${accountId}`);
        setBalance(res.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch balance");
      } finally {
        setLoading(false);
      }
    };

    if (accountId) {
      fetchBalance();
    }
  }, [accountId]);

  if (loading) return <div>Loading balance...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!balance) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <h3 className="text-lg font-semibold mb-2">Account Balance</h3>
      <div className="grid grid-cols-2 gap-2">
        <div>Account Number:</div>
        <div className="font-medium">{balance.accountNumber}</div>
        
        <div>Available Balance:</div>
        <div className="font-medium">₹{balance.availableBalance.toFixed(2)}</div>
        
        <div>Current Balance:</div>
        <div className="font-medium">₹{balance.balance.toFixed(2)}</div>
        
        <div>Credit Limit:</div>
        <div className="font-medium">₹{balance.credit.toFixed(2)}</div>
      </div>
    </div>
  );
}