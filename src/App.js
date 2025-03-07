import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import PalindromicUncommons from './PalindromicUncommons';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/palindromic-uncommons" element={<PalindromicUncommons />} />
      </Routes>
    </Router>
  );
}

export default App;