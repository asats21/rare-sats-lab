import { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const BLOCKS = 210000;
const MAX_HALVINGS = 34;

function PalindromicUncommons() {
  const [results, setResults] = useState('');
  const [total, setTotal] = useState(0);

  const findPalindromicUncommons = () => {
    let palins = [];
    let totalBlocks = BLOCKS * MAX_HALVINGS; // Precomputed block limit

    for (let block = 0; block < totalBlocks; block++) {
      let uncommon = getBlockUncommon(block);
      if (checkUncommonPali(uncommon)) {
        palins.push(uncommon);
      }
    }

    setTotal(palins.length);
    setResults(palins.join('\n')); // Efficiently update state
  };

  function getBlockUncommon(block) {
    let reward = 50 * 1e8;
    let totalSats = 0;
    let currentBlock = 0;

    for (let i = 0; i < MAX_HALVINGS; i++) {
      let halvingBlocks = BLOCKS;
      if (block < currentBlock + halvingBlocks) {
        return totalSats + (block - currentBlock) * reward;
      }
      totalSats += halvingBlocks * reward;
      currentBlock += halvingBlocks;
      reward /= 2;
    }
    return 0; // Should never reach this
  }

  function palindromeCheck(numStr) {
    if (!numStr || numStr === '0') return false;
    return numStr === numStr.split('').reverse().join('');
  }

  function checkUncommonPali(satNum) {
    if (satNum % 10 !== 0) return false; // Ends in zero check
    let numStr = satNum.toString().replace(/0+$/, ""); // Remove trailing zeros
    return palindromeCheck(numStr);
  }

  return (
    <div className="App bg-black text-white min-vh-100">
      <header className="text-center py-4">
        <h1 className="fw-bold">Palindromic Uncommons</h1>
      </header>

      <div className="container text-center">
        <button className="btn btn-primary mb-3" onClick={findPalindromicUncommons}>
          Run Experiment
        </button>
        <p>Total Found: {total}</p>
        <textarea
          className="form-control bg-dark text-white"
          rows="10"
          value={results}
          readOnly
        />
        <div className="mt-3">
          <Link to="/" className="btn btn-secondary">Back to Main</Link>
        </div>
      </div>
    </div>
  );
}

export default PalindromicUncommons;
