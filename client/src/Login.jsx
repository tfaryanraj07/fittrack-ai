import { useState } from "react";
import axios from "axios";

function Login() {
  const [form, setForm] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        " `${import.meta.env.VITE_API_URL}/api/auth/login",
        form
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login Successful!");
      window.location.href = "/dashboard";
    } catch (err) {
      alert("Login Failed");
    }
  };

  return (
    <div className="container">

      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <br /><br />

        <button type="submit">Login</button>
        <p style={{ marginTop: "15px" }}>
  Don’t have an account?{" "}
  <span
    style={{ color: "#00c6ff", cursor: "pointer" }}
    onClick={() => (window.location.href = "/")}
  >
    Register
  </span>
</p>

      </form>
    </div>
  );
}

export default Login;
