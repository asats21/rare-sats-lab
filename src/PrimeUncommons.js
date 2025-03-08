import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getRewardForEpoch } from './getRewardForEpoch';
import __wbg_init, { is_prime } from './is_prime_wasm'; // Add this line
import './App.css';

const BLOCKS = 210000;
const MAX_HALVINGS = 33;
const TOTAL_BLOCKS = BLOCKS * MAX_HALVINGS;

function PrimeUncommons() {
  const [results, setResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [foundCount, setFoundCount] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [currentBlock, setCurrentBlock] = useState(0);
  const [lastNumberTime, setLastNumberTime] = useState(null);
  const [tick, setTick] = useState(0);
  const [isWasmLoaded, setIsWasmLoaded] = useState(false); // Add this line
  const consoleRef = useRef(null);

  useEffect(() => {
    const loadWasm = async () => {
      try {
        await __wbg_init(); // Uses the path set in is_prime_wasm.js (e.g., process.env.PUBLIC_URL)
        setIsWasmLoaded(true);
        console.log('WASM loaded successfully');
      } catch (err) {
        console.error('Failed to load WASM:', err);
      }
    };
    loadWasm();
  }, []); // Empty dependency array so it runs once on mount

  useLayoutEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [results]);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTick((prev) => prev + 1);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const start = () => {
    if (isRunning) return;
    if (!isWasmLoaded) {
      setResults(["> WASM module still loading, hold up..."]);
      return;
    }
    setResults(["> Starting experiment..."]);
    setFoundCount(0);
    setIsRunning(true);
    setStartTime(Date.now());
    setCurrentBlock(0);
    const chunkSize = 10000;
    processChunk(0, chunkSize);
  };

  const downloadCSV = () => {
    const numbers = results.filter((item) => item.uncommonSat).map((item) => `${item.uncommonSat};${item.block};${item.epoch};${item.reward}`);
    const csvContent = "data:text/csv;charset=utf-8," + numbers.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "prime_uncommons.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const processChunk = (startBlock, chunkSize) => {
    const endBlock = Math.min(startBlock + chunkSize, TOTAL_BLOCKS);
    let newPrimes = [];
    for (let block = startBlock; block < endBlock; block++) {
      let uncommonSat = getBlockUncommon(block);
      if (isPrime(uncommonSat)) {
        const epoch = Math.floor(block / BLOCKS);
        const rewardSats = getRewardForEpoch(epoch);
        const rewardDisplay = rewardSats >= 0.1 * 1e8
          ? `${rewardSats / 1e8} BTC`
          : `${rewardSats} sats`;
        newPrimes.push({ uncommonSat, block: block, epoch, reward: rewardDisplay });
      }
    }
    if (newPrimes.length > 0) {
      setResults((prev) => [...prev, ...newPrimes]);
      setFoundCount((prev) => prev + newPrimes.length);
      setLastNumberTime(Date.now());
    }
    setCurrentBlock(endBlock); // Update current block
    if (endBlock < TOTAL_BLOCKS) {
      setTimeout(() => processChunk(endBlock, chunkSize), 0);
    } else {
      setIsRunning(false);
      setResults((prev) => {
        const finalResults = newPrimes.length > 0 ? [...prev, ...newPrimes] : prev;
        const count = finalResults.filter((item) => item.uncommonSat).length;
        return [...finalResults, `> Experiment finished. Found ${count} numbers.`];
      });
    }
  };

  function getBlockUncommon(block) {
    let totalSats = 0;
    let currentBlock = 0;
    for (let i = 0; i < MAX_HALVINGS; i++) {
      let halvingBlocks = BLOCKS;
      if (block < currentBlock + halvingBlocks) {
        const reward = getRewardForEpoch(i);
        return totalSats + (block - currentBlock) * reward;
      }
      totalSats += halvingBlocks * getRewardForEpoch(i);
      currentBlock += halvingBlocks;
    }
    return totalSats;
  }

  function isPrime(n) {
    if (!isWasmLoaded) return false;
    if (n < 0) return false;
    return is_prime(n);
  }

  return (
    <div className="console">
      <div className="console-output" ref={consoleRef}>
        {results.map((result, index) => (
          <div key={index} className="console-line">
            > {typeof result === 'string' ? result : `${result.uncommonSat}  [Block: ${result.block} | Epoch: ${result.epoch} | Reward: ${result.reward}]`}
          </div>
        ))}

        {tick > -1 && null} {/* Dummy use to silence ESLint */}

        <div className="console-line">
          {isRunning && lastNumberTime !== null && Date.now() - lastNumberTime > 1000 ? (
            <span className="blinking-cursor">In Progress</span>
          ) : (
            <span className="blinking-cursor">_</span>
          )}
        </div>
      </div>
      <div className="controls">
        <span>> </span>
        <button onClick={start} disabled={isRunning}>[Start]</button>
        <button onClick={downloadCSV} disabled={isRunning || foundCount === 0}>[Download CSV]</button>
        <Link to="/" className="console-link">[Back]</Link>
        {startTime && (
          <span className="time-elapsed">
            Elapsed: {Math.floor((Date.now() - startTime) / 1000)}s
            {currentBlock > 0 && (
              <> | Left: {Math.floor(((Date.now() - startTime) / currentBlock) * (TOTAL_BLOCKS - currentBlock) / 1000)}s</>
            )}
          </span>
        )}
      </div>
    </div>
  );
}

export default PrimeUncommons;