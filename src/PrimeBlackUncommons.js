import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

const BLOCKS = 210000;
const MAX_HALVINGS = 33;
const TOTAL_BLOCKS = BLOCKS * MAX_HALVINGS;

function PrimeBlackUncommons() {
  const [results, setResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [foundCount, setFoundCount] = useState(0);
  const [isOmegaOnly, setIsOmegaOnly] = useState(false);
  const [lastNumberTime, setLastNumberTime] = useState(null);
  const [tick, setTick] = useState(0);
  const consoleRef = useRef(null);

  useEffect(() => {
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
    setResults(["> Starting experiment..."]);
    setFoundCount(0);
    setIsRunning(true);
    const chunkSize = 10000;
    processChunk(0, chunkSize); // Start at 0
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
    for (let block = startBlock; block < endBlock; block++) { // No Math.max
      let uncommon = getBlockUncommon(block);
      let blackSat = Math.floor(uncommon) - 1;
      let blackBlock = block - 1;
      if (isPrime(blackSat) && (!isOmegaOnly || isOmega(blackSat))) {
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

  function getRewardForEpoch(epoch) {
    let reward = 50 * 1e8; // 5000000000 sats
    for (let i = 0; i < epoch; i++) {
      reward = Math.floor(reward / 2);
      if (reward < 1) reward = 1;
    }
    return reward;
  }

  function isOmega(sat_num) {
    return Number.isInteger((sat_num + 1) / 1e8);
  }

  function isPrime(n) {
    // eslint-disable-next-line no-undef
    n = BigInt(n);
    if (n < 2n) return false;
    if (n === 2n || n === 3n) return true;
    if (n % 2n === 0n) return false;

    const smallPrimes = [3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n];
    for (const p of smallPrimes) {
      if (n === p) return true;
      if (n % p === 0n) return false;
    }

    let s = 0;
    let d = n - 1n;
    while (d % 2n === 0n) {
      d /= 2n;
      s++;
    }

    const bases = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n];

    function modPow(base, exp, mod) {
      let result = 1n;
      base = base % mod;
      while (exp > 0n) {
        if (exp % 2n === 1n) {
          result = (result * base) % mod;
        }
        exp /= 2n;
        base = (base * base) % mod;
      }
      return result;
    }

    for (const a of bases) {
      if (a >= n) continue;
      let x = modPow(a, d, n);
      if (x === 1n || x === n - 1n) continue;

      let composite = true;
      for (let i = 0; i < s - 1; i++) {
        x = modPow(x, 2n, n);
        if (x === n - 1n) {
          composite = false;
          break;
        }
      }
      if (composite) return false;
    }

    return true;
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
      </div>
    </div>
  );
}

export default PrimeBlackUncommons;