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

  const [workouts, setWorkouts] = useState([]);
  const [form, setForm] = useState({
    exercise: "",
    sets: "",
    reps: "",
    weight: "",
    goalType: user?.goal,
    muscleGroup: "chest",
  });

  const fetchWorkouts = async () => {
    const res = await axios.get(
      "http:// `${import.meta.env.VITE_API_URL}/api/workouts",
      { headers: { Authorization: token } }
    );
    setWorkouts(res.data);
  };

  const addWorkout = async (e) => {
    e.preventDefault();

    await axios.post(
      "http:// `${import.meta.env.VITE_API_URL}/api/workouts",
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
  };

  const deleteWorkout = async (id) => {
   await axios.delete(
  `${import.meta.env.VITE_API_URL}/api/workouts/${id}`,
  { headers: { Authorization: token } }
);

    fetchWorkouts();
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

  // 🔥 Strength Progression
  const strengthChart = {
    labels: workouts.map((w) =>
      new Date(w.date).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Strength",
        data: workouts.map((w) => w.weight),
        borderColor: "#00c6ff",
      },
    ],
  };

  return (
    <motion.div className="container">
      <h2>📊 Advanced Progress</h2>

      {/* Add Exercise */}
      <div className="card">
        <h3>Add Exercise</h3>
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
            placeholder="Weight"
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

      {/* Delete + PR */}
      <div className="card">
        <h3>Exercises</h3>
        {workouts.map((w) => (
          <div key={w._id}>
            {w.exercise} ({w.muscleGroup}) - {w.weight}kg
            <button
              onClick={() => deleteWorkout(w._id)}
              style={{ marginLeft: "10px" }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Muscle Pie */}
     <div className="card" style={{ marginTop: "30px" }}>
  <h3>Muscle Distribution</h3>

  <div
    className="pie-wrapper"
    style={{
      width: "100%",
      maxWidth: "450px",
      height: "350px",
      margin: "0 auto",
      transition: "0.4s ease",
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
                padding: 15,
              },
            },
          },
          animation: {
            animateScale: true,
            animateRotate: true,
          },
        }}
      />
    )}
  </div>
      </div>

      {/* Strength */}
      <div className="card">
        <h3>Strength Curve</h3>
        {workouts.length > 0 && <Line data={strengthChart} />}
      </div>
    </motion.div>
  );
}

export default Progress;
