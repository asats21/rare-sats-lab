import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import __wbg_init, { is_prime } from './is_prime_wasm'; // Add this line
import './App.css';

const BLOCKS = 210000;
const MAX_HALVINGS = 33;
const TOTAL_BLOCKS = BLOCKS * MAX_HALVINGS;

function PrimeBlackUncommons() {
  const [results, setResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [foundCount, setFoundCount] = useState(0);
  const [isOmegaOnly, setIsOmegaOnly] = useState(false);
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
    const numbers = results.filter((item) => item.blackSat).map((item) => `${item.blackSat};${item.block};${item.epoch};${item.reward}`);
    const csvContent = "data:text/csv;charset=utf-8," + numbers.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "prime_black_uncommons.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const processChunk = (startBlock, chunkSize) => {
    const endBlock = Math.min(startBlock + chunkSize, TOTAL_BLOCKS);
    let newPrimes = [];
    for (let block = startBlock; block < endBlock; block++) {
      let uncommon = getBlockUncommon(block);
      let blackSat = Math.floor(uncommon) - 1;
      let blackBlock = block - 1;
      if ((!isOmegaOnly || isOmega(blackSat)) && isPrime(blackSat)) {
        const epoch = Math.floor(blackBlock / BLOCKS);
        const rewardSats = getRewardForEpoch(epoch);
        const rewardDisplay = rewardSats >= 0.1 * 1e8
          ? `${rewardSats / 1e8} BTC`
          : `${rewardSats} sats`;
        newPrimes.push({ blackSat, block: blackBlock, epoch, reward: rewardDisplay });
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
        const count = finalResults.filter((item) => item.blackSat).length;
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

  // source: https://www.coinwarz.com/bitcoin-halving
  function getRewardForEpoch(epoch) {
    const rewards = [
      5000000000,  // Epoch 0, 50.000 BTC
      2500000000,  // Epoch 1, 25.000 BTC
      1250000000,  // Epoch 2, 12.500 BTC
      625000000,   // Epoch 3, 6.250 BTC
      312500000,   // Epoch 4, 3.125 BTC
      156250000,   // Epoch 5, 1.56250000 BTC
      78125000,    // Epoch 6, 0.78125000 BTC
      39062500,    // Epoch 7, 0.39062500 BTC
      19531250,    // Epoch 8, 0.19531250 BTC
      9765625,     // Epoch 9, 0.09765625 BTC
      4882812,     // Epoch 10, 0.04882813 BTC
      2441406,     // Epoch 11, 0.02441406 BTC
      1220703,     // Epoch 12, 0.01220703 BTC
      610351,      // Epoch 13, 0.00610352 BTC
      305175,      // Epoch 14, 0.00305176 BTC
      152587,      // Epoch 15, 0.00152588 BTC
      76293,       // Epoch 16, 0.00076294 BTC
      38146,       // Epoch 17, 0.00038147 BTC
      19073,       // Epoch 18, 0.00019073 BTC
      9536,        // Epoch 19, 0.00009537 BTC
      4768,        // Epoch 20, 0.00004768 BTC
      2384,        // Epoch 21, 0.00002384 BTC
      1192,        // Epoch 22, 0.00001192 BTC
      596,         // Epoch 23, 0.00000596 BTC
      298,         // Epoch 24, 0.00000298 BTC
      149,         // Epoch 25, 0.00000149 BTC
      74,          // Epoch 26, 0.00000075 BTC
      37,          // Epoch 27, 0.00000037 BTC
      19,          // Epoch 28, 0.00000019 BTC
      9,           // Epoch 29, 0.00000009 BTC
      5,           // Epoch 30, 0.00000005 BTC
      2,           // Epoch 31, 0.00000002 BTC
      1,           // Epoch 32, 0.00000001 BTC
      0            // Epoch 33, 0.00000000 BTC
    ];
  
    // Ensure the epoch is within the valid range
    if (epoch < 0 || epoch >= rewards.length) {
      return 0;
    }
  
    return rewards[epoch];
  }

  function isOmega(sat_num) {
    return Number.isInteger((sat_num + 1) / 1e8);
  }

  function isPrime(n) {
    if (!isWasmLoaded) return false;
    if (n < 0) return false;
    return is_prime(n);
  }

  const toggleOmega = () => {
    if (!isRunning) setIsOmegaOnly((prev) => !prev);
  };

  return (
    <div className="console">
      <div className="console-output" ref={consoleRef}>
        {results.map((result, index) => (
          <div key={index} className="console-line">
            > {typeof result === 'string' ? result : `${result.blackSat}  [Block: ${result.block} | Epoch: ${result.epoch} | Reward: ${result.reward}]`}
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
        <span onClick={toggleOmega} className={isRunning ? "disabled" : "console-toggle"}>
          {isOmegaOnly ? '[X]' : '[_]'} Omega
        </span>
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

export default PrimeBlackUncommons;