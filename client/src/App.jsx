import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "./Dashboard";
import Progress from "./Progress";
import Weight from "./WeightTracker";
import Profile from "./Profile";
import Navbar from "./Navbar";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Register />} />
        <Route path="/Login" element={<Login />} />

        {/* Protected Routes with Navbar */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Dashboard />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Progress />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/weight"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Weight />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Profile />
              </>
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
