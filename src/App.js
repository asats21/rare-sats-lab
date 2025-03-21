import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import PalindromicUncommons from './PalindromicUncommons';
import PrimeUncommons from './PrimeUncommons';
import PrimeBlackUncommons from './PrimeBlackUncommons';
import PerfectPalinceptions from './PerfectPalinceptions';
import RodarmorNames from './RodarmorNames';
import TestPrimeWasm from './TestPrimeWasm';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/palindromic-uncommons" element={<PalindromicUncommons />} />
        <Route path="/prime-uncommons" element={<PrimeUncommons />} />
        <Route path="/prime-black-uncommons" element={<PrimeBlackUncommons />} />
        <Route path="/perfect-palinceptions" element={<PerfectPalinceptions />} />
        <Route path="/rodarmor-names" element={<RodarmorNames />} />
        <Route path="/test-prime-wasm" element={<TestPrimeWasm />} />
      </Routes>
    </Router>
  );
}

export default App;