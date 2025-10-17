import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signin from "./pages/Signin"
import Signup from "./pages/Signup"
import VerifyAccount from './pages/VerifyAccount';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Signin />} />
        <Route path='/verify' element={<VerifyAccount/>} />
      </Routes>
    </Router>
  );
}

export default App
