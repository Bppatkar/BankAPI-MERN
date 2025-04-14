export default function TransactionList({ transactions, users }) {
  const getUserName = (accountId) => {
    const user = users.find(u => u.accountId === accountId);
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown';
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <div className="space-y-2">
          {transactions.map(txn => (
            <div key={txn._id} className="p-3 border rounded">
              <div className="flex justify-between">
                <span className="font-medium">{txn.type.toUpperCase()}</span>
                <span>₹{txn.amount.toFixed(2)}</span>
              </div>
              {txn.type === 'transfer' && (
                <div className="text-sm text-gray-600">
                  <div>From: {getUserName(txn.accountId)}</div>
                  <div>To: {getUserName(txn.toAccountId)}</div>
                </div>
              )}
              <div className="text-xs text-gray-400">
                {new Date(txn.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}