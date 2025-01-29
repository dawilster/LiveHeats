import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RacesIndex from './pages/RacesIndex';
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RacesIndex />} />
      </Routes>
    </Router>
  );
}

export default App;

