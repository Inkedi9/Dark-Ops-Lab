import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Simulator from "./pages/Simulator";
import Results from "./pages/Results";
import About from "./pages/About";
import Profile from "./pages/Profile";
import NexusBackground from "@dark/ui/components/NexusBackground";
import SocPage from "./pages/SocPage";
import SocAlertsPage from "./pages/SocAlertsPage";
import SocPlaybooksPage from "./pages/SocPlaybooksPage";
import SocReportsPage from "./pages/SocReportsPage";
import SecurityCheckPage from "./pages/SecurityCheckPage";
import SocIntelPage from "./pages/SocIntelPage";
import DefenseProfilePage from "./pages/DefenseProfilePage";
import PhishFooter from "./components/layout/PhishFooter";

export default function App() {
  return (
    <div className="dark-shell relative min-h-screen overflow-x-hidden bg-[#05070A] text-slate-100">
      <NexusBackground />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.10),transparent_30%),linear-gradient(to_bottom,rgba(5,7,10,0.08),rgba(2,4,9,0.64))]" />

      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/results" element={<Results />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/security-check" element={<SecurityCheckPage />} />
          <Route path="/defense-profile" element={<DefenseProfilePage />} />
          <Route path="/soc" element={<SocPage />} />
          <Route path="/soc/alerts" element={<SocAlertsPage />} />
          <Route path="/soc/intel" element={<SocIntelPage />} />
          <Route path="/soc/playbooks" element={<SocPlaybooksPage />} />
          <Route path="/soc/reports" element={<SocReportsPage />} />
        </Routes>
      </div>
    </div>
  );
}
