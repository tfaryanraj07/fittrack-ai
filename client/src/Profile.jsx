import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function Profile() {
  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("user"));

  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [form, setForm] = useState(userData);

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        "http://localhost:5000/api/auth/update",
        form,
        { headers: { Authorization: token } }
      );

      localStorage.setItem("user", JSON.stringify(res.data));
      setEditing(false);
      alert("Profile Updated Successfully");
    } catch (err) {
      alert("Error updating profile");
    }
  };

  const handleChangePassword = async () => {
    try {
      await axios.put(
        "http://localhost:5000/api/auth/change-password",
        passwordData,
        { headers: { Authorization: token } }
      );

      setPasswordData({ oldPassword: "", newPassword: "" });
      setChangingPassword(false);
      alert("Password Changed Successfully");
    } catch (err) {
      alert("Incorrect old password");
    }
  };

  const bmi =
    userData?.weight && userData?.height
      ? (userData.weight / ((userData.height / 100) ** 2)).toFixed(1)
      : 0;

  return (
    <motion.div
      className="container"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2>👤 Profile</h2>

      {/* Profile Info Card */}
      <div className="card" style={{ marginTop: "20px" }}>
        {editing ? (
          <>
            <input
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
            <input
              value={form.weight}
              onChange={(e) =>
                setForm({ ...form, weight: Number(e.target.value) })
              }
            />
            <input
              value={form.height}
              onChange={(e) =>
                setForm({ ...form, height: Number(e.target.value) })
              }
            />
            <button onClick={handleUpdate}>Save Changes</button>
          </>
        ) : (
          <>
            <p><strong>Name:</strong> {userData.name}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Weight:</strong> {userData.weight} kg</p>
            <p><strong>Height:</strong> {userData.height} cm</p>
            <p><strong>Goal:</strong> {userData.goal}</p>
            <p><strong>BMI:</strong> {bmi}</p>

            <button onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          </>
        )}
      </div>

      {/* Change Password Section */}
      <div className="card" style={{ marginTop: "30px" }}>
        <h3>🔐 Change Password</h3>

        {changingPassword ? (
          <>
            <input
              type="password"
              placeholder="Old Password"
              value={passwordData.oldPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  oldPassword: e.target.value,
                })
              }
            />
            <input
              type="password"
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
            />

            <button onClick={handleChangePassword}>
              Update Password
            </button>
          </>
        ) : (
          <button onClick={() => setChangingPassword(true)}>
            Change Password
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default Profile;
