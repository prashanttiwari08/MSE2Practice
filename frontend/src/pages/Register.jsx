import { useState } from "react";
import { registerUser } from "../api/api";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = await registerUser(form);

    if (!data.success) {
      alert(data.message);
    } else {
      alert("Registered Successfully");
      setForm({ name: "", email: "", password: "" });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
      />
      <br /><br />

      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />
      <br /><br />

      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />
      <br /><br />

      <button type="submit">Register</button>
    </form>
  );
};

export default Register;