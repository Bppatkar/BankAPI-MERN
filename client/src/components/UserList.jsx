export default function UserList({ users }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">All Users</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul className="space-y-2">
          {users.map((user) => (
            <li key={user._id} className="p-2 border rounded-md">
              {user.firstName} {user.lastName} - {user.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
