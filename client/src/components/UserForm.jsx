import axios from "axios";
import { useState } from "react";

export default function UserForm({ onUserCreated }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/users", formData);
      setMessage(res.data.message || "User created successfully");
      setError("");
      setFormData({ firstName: "", lastName: "", email: "" });
      onUserCreated?.();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error creating user");
      setMessage("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md space-y-4"
    >
      <h2 className="text-xl font-semibold">Create User</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          className="p-2 border rounded"
          type="text"
          name="firstName"
          value={formData.firstName}
          placeholder="First Name"
          onChange={handleChange}
          required
        />
        <input
          className="p-2 border rounded"
          type="text"
          name="lastName"
          value={formData.lastName}
          placeholder="Last Name"
          onChange={handleChange}
          required
        />
        <input
          className="p-2 border rounded"
          type="email"
          name="email"
          value={formData.email}
          placeholder="Email"
          onChange={handleChange}
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Create
      </button>
      {message && <p className="mt-2 text-sm text-green-700">{message}</p>}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </form>
  );
}
