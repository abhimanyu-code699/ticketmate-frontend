import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VerifyAccount from './pages/VerifyAccount';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Documents from './pages/Documents';
import Dashboard from './pages/Dashboard';
import UploadTicket from './pages/UploadTicket';
import GetTicket from './pages/GetTicket';
import TicketHistory from './pages/TicketHistory';
import UpdateProfile from './pages/UpdateProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Signup/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/verify' element={<VerifyAccount/>} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/documents' element={<Documents />} />
        <Route path='/upload-ticket' element={<UploadTicket />} />
        <Route path='/get-ticket' element={<GetTicket />} />
        <Route path='/ticket-history' element={<TicketHistory/>}/>
        <Route path='/update-profile' element={<UpdateProfile/>} />
      </Routes>
    </Router>
  );
}

export default App
