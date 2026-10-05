import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Leagues from "./pages/Leagues";
import LeagueDetails from "./pages/LeagueDetails";
import Favorites from "./pages/Favorites";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/leagues" element={<Leagues />} />
      <Route path="/leagues/:id" element={<LeagueDetails />} />
      <Route path="/favorites" element={<Favorites />} />
    </Routes>
  );
}

export default App;