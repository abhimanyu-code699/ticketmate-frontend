import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signin from "./pages/Signup"
import Signup from "./pages/Signin"
import VerifyAccount from './pages/VerifyAccount';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Signin />} />
        <Route path='/verify' element={<VerifyAccount/>} />
        <Route path='/landing-page' element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App
