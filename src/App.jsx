import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Leagues from "./pages/Leagues";
import LeagueDetails from "./pages/LeagueDetails";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/leagues" element={<Leagues />} />
      <Route path="/leagues/:id" element={<LeagueDetails />} />
    </Routes>
  );
}

export default App;