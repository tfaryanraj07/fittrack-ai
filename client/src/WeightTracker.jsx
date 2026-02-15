import axios from "axios";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

function WeightTracker() {
  const token = localStorage.getItem("token");
  const [weight, setWeight] = useState("");
  const [weights, setWeights] = useState([]);

  const fetchWeights = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/weight`,
      {
        headers: { Authorization: token },
      }
    );
    setWeights(res.data);
  };

  const addWeight = async (e) => {
    e.preventDefault();

    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/weight`,
      { weight: Number(weight) },
      { headers: { Authorization: token } }
    );

    setWeight("");
    fetchWeights();
  };

  useEffect(() => {
    fetchWeights();
  }, []);

  const chartData = {
    labels: weights.map((w) =>
      new Date(w.date).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Weight Progress",
        data: weights.map((w) => w.weight),
        borderColor: "#00c6ff",
        backgroundColor: "rgba(0,198,255,0.3)",
      },
    ],
  };

  return (
    <motion.div
      className="container"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2>⚖ Weight Tracker</h2>

      <form onSubmit={addWeight}>
        <input
          placeholder="Enter Weight (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <div style={{ marginTop: "40px" }}>
        {weights.length > 0 && <Line data={chartData} />}
      </div>
    </motion.div>
  );
}

export default WeightTracker;
