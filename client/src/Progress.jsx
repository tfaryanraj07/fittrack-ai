import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

function Progress() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const API = import.meta.env.VITE_API_URL;

  const [workouts, setWorkouts] = useState([]);
  const [form, setForm] = useState({
    exercise: "",
    sets: "",
    reps: "",
    weight: "",
    goalType: user?.goal,
    muscleGroup: "chest",
  });

  // 🔥 Fetch Workouts
  const fetchWorkouts = async () => {
    try {
      const res = await axios.get(
        `${API}/api/workouts`,
        { headers: { Authorization: token } }
      );
      setWorkouts(res.data);
    } catch (err) {
      console.error("Error fetching workouts:", err);
    }
  };

  // 🔥 Add Workout
  const addWorkout = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${API}/api/workouts`,
        {
          exercise: form.exercise,
          sets: Number(form.sets),
          reps: Number(form.reps),
          weight: Number(form.weight),
          goalType: form.goalType,
          muscleGroup: form.muscleGroup,
        },
        { headers: { Authorization: token } }
      );

      setForm({
        exercise: "",
        sets: "",
        reps: "",
        weight: "",
        goalType: user?.goal,
        muscleGroup: "chest",
      });

      fetchWorkouts();
    } catch (err) {
      console.error("Error adding workout:", err);
    }
  };

  // 🔥 Delete Workout
  const deleteWorkout = async (id) => {
    try {
      await axios.delete(
        `${API}/api/workouts/${id}`,
        { headers: { Authorization: token } }
      );
      fetchWorkouts();
    } catch (err) {
      console.error("Error deleting workout:", err);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  // 🔥 Muscle Group Distribution
  const muscleMap = {};
  workouts.forEach((w) => {
    if (!muscleMap[w.muscleGroup]) muscleMap[w.muscleGroup] = 0;
    muscleMap[w.muscleGroup] += w.sets * w.reps;
  });

  const pieData = {
    labels: Object.keys(muscleMap),
    datasets: [
      {
        data: Object.values(muscleMap),
        backgroundColor: [
          "#00c6ff",
          "#ff00ff",
          "#00ffcc",
          "#ff9900",
          "#ff4d4d",
        ],
      },
    ],
  };

  // 🔥 Strength Progression Chart
  const strengthChart = {
    labels: workouts.map((w) =>
      new Date(w.date).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Strength (kg)",
        data: workouts.map((w) => w.weight),
        borderColor: "#00c6ff",
        backgroundColor: "rgba(0,198,255,0.2)",
        tension: 0.3,
      },
    ],
  };

  return (
    <motion.div
      className="container"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2>📊 Advanced Progress Analytics</h2>

      {/* 🔥 Add Exercise */}
      <div className="card">
        <h3>➕ Add Exercise</h3>

        <form onSubmit={addWorkout}>
          <input
            placeholder="Exercise"
            value={form.exercise}
            onChange={(e) =>
              setForm({ ...form, exercise: e.target.value })
            }
          />

          <input
            placeholder="Sets"
            value={form.sets}
            onChange={(e) =>
              setForm({ ...form, sets: e.target.value })
            }
          />

          <input
            placeholder="Reps"
            value={form.reps}
            onChange={(e) =>
              setForm({ ...form, reps: e.target.value })
            }
          />

          <input
            placeholder="Weight (kg)"
            value={form.weight}
            onChange={(e) =>
              setForm({ ...form, weight: e.target.value })
            }
          />

          <select
            value={form.muscleGroup}
            onChange={(e) =>
              setForm({ ...form, muscleGroup: e.target.value })
            }
          >
            <option value="chest">Chest</option>
            <option value="back">Back</option>
            <option value="legs">Legs</option>
            <option value="shoulders">Shoulders</option>
            <option value="arms">Arms</option>
          </select>

          <button type="submit">Add</button>
        </form>
      </div>

      {/* 🔥 Exercise List */}
      <div className="card">
        <h3>🏋 Logged Exercises</h3>
        {workouts.length === 0 && <p>No workouts yet.</p>}

        {workouts.map((w) => (
          <div key={w._id} style={{ marginBottom: "10px" }}>
            {w.exercise} ({w.muscleGroup}) — {w.weight}kg
            <button
              onClick={() => deleteWorkout(w._id)}
              style={{ marginLeft: "10px" }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* 🔥 Muscle Pie */}
      <div className="card" style={{ marginTop: "30px" }}>
        <h3>💪 Muscle Distribution</h3>

        <div
          className="pie-wrapper"
          style={{
            width: "100%",
            maxWidth: "450px",
            height: "350px",
            margin: "0 auto",
          }}
        >
          {workouts.length > 0 && (
            <Pie
              data={pieData}
              options={{
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: {
                      color: "#fff",
                    },
                  },
                },
              }}
            />
          )}
        </div>
      </div>

      {/* 🔥 Strength Curve */}
      <div className="card">
        <h3>📈 Strength Progression</h3>
        {workouts.length > 0 && <Line data={strengthChart} />}
      </div>
    </motion.div>
  );
}

export default Progress;
