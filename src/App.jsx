import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./components/Home";
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import SpotifyCallBack from './components/SpotifyCallBack';
import { AuthProvider } from './context/useAuth';
import './App.css'


export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/callback" element={<SpotifyCallBack />} />
          <Route element={<ProtectedRoute/>}>
            <Route path="/" element={<Home />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  )
}
