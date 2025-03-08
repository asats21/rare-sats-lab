import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import PalindromicUncommons from './PalindromicUncommons';
import PrimeBlackUncommons from './PrimeBlackUncommons';
import TestPrimeWasm from './TestPrimeWasm'; // Adjust the path if necessary

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/palindromic-uncommons" element={<PalindromicUncommons />} />
        <Route path="/prime-black-uncommons" element={<PrimeBlackUncommons />} />
        <Route path="/test-prime-wasm" element={<TestPrimeWasm />} />
      </Routes>
    </Router>
  );
}

export default App;