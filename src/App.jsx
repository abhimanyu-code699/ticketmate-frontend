import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signin from "./pages/Signin"
import Signup from "./pages/Signup"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Signin />} />
      </Routes>
    </Router>
  );
}

export default App
