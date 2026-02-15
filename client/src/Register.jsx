import { useState } from "react";
import axios from "axios";

function Register() {
  const [form, setForm] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        form
      );
      alert("Registered Successfully!");
    } catch (err) {
      alert("Error registering user");
    }
  };

  return (
    <div className="container">

      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <br /><br />

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

        <input
          placeholder="Height"
          onChange={(e) =>
            setForm({ ...form, height: Number(e.target.value) })
          }
        />
        <br /><br />

        <input
          placeholder="Weight"
          onChange={(e) =>
            setForm({ ...form, weight: Number(e.target.value) })
          }
        />
        <br /><br />
        <input
  placeholder="Age"
  onChange={(e) =>
    setForm({ ...form, age: Number(e.target.value) })
  }
/>


        <select
          onChange={(e) => setForm({ ...form, goal: e.target.value })}
        >
          <option value="">Select Goal</option>
          <option value="bulking">Bulking</option>
          <option value="cutting">Cutting</option>
        </select>

        <br /><br />

        <button type="submit">Register</button>
        <p style={{ marginTop: "15px" }}>
  Already have an account?{" "}
  <span
    style={{ color: "#00c6ff", cursor: "pointer" }}
    onClick={() => (window.location.href = "/Login")}
  >
    Login
  </span>
</p>

      </form>
    </div>
  );
}

export default Register;
