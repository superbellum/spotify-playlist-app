import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./components/Home";
import SpotifyCallBack from './components/SpotifyCallBack';
import './App.css'


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/callback" element={<SpotifyCallBack />} />
      </Routes>
    </Router>
  )
}
