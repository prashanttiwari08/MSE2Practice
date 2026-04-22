import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isLogin
      ? "https://mse2practice.onrender.com/login"
      : "https://mse2practice.onrender.com/register";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(
          isLogin
            ? { email, password }
            : { name, email, password }
        )
      });

      const data = await res.json();

      if (data.success) {
        alert(data.message);

        // Save user
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        navigate("/dashboard");
      } else {
        alert(data.message);
      }

    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  return (
  <div className="page-wrapper">
    <div className="portal-card">
      <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
      <p>{isLogin ? "Please login to your portal" : "Join the student community"}</p>

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">
          {isLogin ? "Login" : "Register"}
        </button>
      </form>

      <button className="toggle-btn" onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "New user? Register" : "Already have an account? Login"}
      </button>
    </div>
  </div>
);
};

export default Auth;