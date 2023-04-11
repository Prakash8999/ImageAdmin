import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import ViewImages from './pages/ViewImages';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/view" element={<ViewImages />} />
          
        </Routes>
      </Router>
    </>
  );
}

export default App;
