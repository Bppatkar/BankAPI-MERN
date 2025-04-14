export default function TransactionList({ transactions, users }) {
  const getUserName = (accountId) => {
    const user = users.find((u) => u.accountId === accountId);
    return user ? `${user.firstName} ${user.lastName}` : accountId?.slice(-4) || 'Unknown';
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
      {transactions.length === 0 ? (
        <p className="text-gray-500">No transactions found.</p>
      ) : (
        <div className="space-y-3">
          {transactions.map((txn) => (
            <div key={txn._id} className="p-3 border rounded-lg hover:bg-gray-50">
              <div className="flex justify-between items-center">
                <span className={`font-medium ${
                  txn.type === 'deposit' ? 'text-green-600' : 
                  txn.type === 'withdraw' ? 'text-red-600' : 'text-blue-600'
                }`}>
                  {txn.type.toUpperCase()}
                </span>
                <span className="font-bold">₹{txn.amount.toFixed(2)}</span>
              </div>
              
              {txn.type === 'transfer' && (
                <div className="text-sm text-gray-600 mt-1">
                  <div>From: {getUserName(txn.fromAccountId)}</div>
                  <div>To: {getUserName(txn.toAccountId)}</div>
                </div>
              )}
              
              <div className="text-xs text-gray-400 mt-2">
                {formatDate(txn.timestamp || txn.createdAt)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}