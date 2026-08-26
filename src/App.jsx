import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Leagues from "./pages/Leagues";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/leagues" element={<Leagues />} />
    </Routes>
  );
}

export default App;