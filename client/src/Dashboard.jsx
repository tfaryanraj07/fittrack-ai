import axios from "axios";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [workouts, setWorkouts] = useState([]);

  const fetchWorkouts = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/workouts",
      {
        headers: { Authorization: token },
      }
    );
    setWorkouts(res.data);
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const bmi = user?.weight && user?.height
    ? (user.weight / ((user.height / 100) ** 2)).toFixed(1)
    : 0;

const chartData = {
  labels: workouts.map((w) =>
    new Date(w.date).toLocaleDateString()
  ),
  datasets: [
    {
      label: "Total Volume (Sets × Reps)",
      data: workouts.map((w) => w.sets * w.reps),
      backgroundColor: "rgba(0, 198, 255, 0.6)",
    },
  ],
};


const calculateCalories = () => {
  if (!user?.weight || !user?.height || !user?.age) return 0;

  const bmr =
    10 * user.weight +
    6.25 * user.height -
    5 * user.age +
    5;

  const activityFactor = 1.55; // moderate training

  let calories = bmr * activityFactor;

  if (user.goal === "bulking") {
    calories += 300;
  } else if (user.goal === "cutting") {
    calories -= 400;
  }

  return Math.round(calories);
};

const recommendedCalories = calculateCalories();


  return (
    <motion.div
      className="container"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Welcome back, {user?.name} 💪</h2>

      {/* 🔹 Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <div className="card">
          <h4>🔥 Calories</h4>
          <h2>{user?.calories}</h2>
        </div>

        <div className="card">
          <h4>⚖ Weight</h4>
          <h2>{user?.weight} kg</h2>
        </div>

        <div className="card">
          <h4>📊 BMI</h4>
          <h2>{bmi}</h2>
        </div>

        <div className="card">
          <h4>🎯 Goal</h4>
          <h2>{user?.goal}</h2>
        </div>
      </div>


<div className="card" style={{ marginTop: "30px" }}>
  <h3>🤖 AI Calorie Recommendation</h3>
  <h2>{recommendedCalories} kcal/day</h2>

  {user.goal === "bulking" && (
    <p>
      Eat in a controlled surplus. Focus on protein
      (2g/kg bodyweight) and compound lifts.
    </p>
  )}

  {user.goal === "cutting" && (
    <p>
      Maintain calorie deficit. Keep strength training
      and add moderate cardio.
    </p>
  )}
</div>




      {/* 🔹 Workout Chart */}
      <div className="card" style={{ marginTop: "40px" }}>
        <h3>Weekly Workout Progress</h3>
        {workouts.length > 0 && <Bar data={chartData} />}
      </div>

      {/* 🔹 AI Suggestion */}
      <div className="card" style={{ marginTop: "40px" }}>
        <h3>🧠 AI Recommendation</h3>
        <p>
          Based on your goal ({user?.goal}), increase compound lifts 
          and maintain high protein intake (1.8g/kg body weight).
          Stay consistent — you're 3 weeks closer to your transformation.
        </p>
      </div>
    </motion.div>
  );
}

export default Dashboard;
