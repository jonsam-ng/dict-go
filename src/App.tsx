import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import TowerGame from "@/pages/TowerGame";
import TrapGame from "@/pages/TrapGame";
import ChamberGame from "@/pages/ChamberGame";
import ReverseGame from "@/pages/ReverseGame";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tower" element={<TowerGame />} />
        <Route path="/trap" element={<TrapGame />} />
        <Route path="/chamber" element={<ChamberGame />} />
        <Route path="/reverse" element={<ReverseGame />} />
      </Routes>
    </Router>
  );
}
