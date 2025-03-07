import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlay, FaDownload } from 'react-icons/fa'; // Import icons
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const BLOCKS = 210000;
const MAX_HALVINGS = 34;
const TOTAL_BLOCKS = BLOCKS * MAX_HALVINGS;

function PalindromicUncommons() {
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const consoleRef = useRef(null);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [results]);

  const findPalindromicUncommons = () => {
    setIsRunning(true);
    setIsFinished(false);
    setResults([]);
    setTotal(0);
    const chunkSize = 10000;
    processChunk(0, chunkSize);
  };

  const processChunk = (startBlock, chunkSize) => {
    const endBlock = Math.min(startBlock + chunkSize, TOTAL_BLOCKS);
    let newPalins = [];
    for (let block = startBlock; block < endBlock; block++) {
      let uncommon = getBlockUncommon(block);
      if (checkUncommonPali(uncommon)) {
        newPalins.push(uncommon);
      }
    }
    if (newPalins.length > 0) {
      setResults((prev) => [...prev, ...newPalins]);
    }
    setTotal((prev) => prev + newPalins.length);
    if (endBlock < TOTAL_BLOCKS) {
      setTimeout(() => processChunk(endBlock, chunkSize), 0);
    } else {
      setIsRunning(false);
      setIsFinished(true);
    }
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
    return 0;
  }

  function palindromeCheck(numStr) {
    if (!numStr || numStr === '0') return false;
    return numStr === numStr.split('').reverse().join('');
  }

  function checkUncommonPali(satNum) {
    if (satNum % 10 !== 0) return false;
    let numStr = satNum.toString().replace(/0+$/, "");
    return palindromeCheck(numStr);
  }

  const downloadCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + results.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "palindromic_uncommons.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="App bg-black text-white min-vh-100">
      <header className="text-center py-4">
        <h1 className="fw-bold">Palindromic Uncommons</h1>
      </header>

      <div className="container text-center">
        <div className="d-flex justify-content-between mb-3 align-items-center">
          <button
            className={`btn ${isFinished ? 'btn-success' : 'btn-primary'}`}
            onClick={findPalindromicUncommons}
            disabled={isRunning}
          >
            <FaPlay className="me-2" /> {/* Play icon */}
            {isRunning ? 'Running...' : isFinished ? 'Finished' : 'Run Experiment'}
          </button>
          <p className="found-count mb-0">Found: {total}</p>
          <button
            className="btn btn-outline-light"
            onClick={downloadCSV}
            disabled={!isFinished}
          >
            <FaDownload className="me-2" /> {/* Download icon */}
            Download CSV
          </button>
        </div>
        <div className="console-output" ref={consoleRef}>
          {results.map((result, index) => (
            <div key={index}>{result}</div>
          ))}
        </div>
        <div className="mt-3">
          <Link to="/" className="btn btn-secondary">Back to Main</Link>
        </div>
      </div>
    </div>
  );
}

export default PalindromicUncommons;