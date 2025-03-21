import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom'; // Added for the back button
import { getRewardForEpoch } from './getRewardForEpoch';
import './App.css';

const BLOCKS = 210000;
const MAX_HALVINGS = 33;
const TOTAL_BLOCKS = BLOCKS * MAX_HALVINGS;

function ConsoleNumbers() {
  const [results, setResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaliBlockOnly, setIsPaliBlockOnly] = useState(false);
  const [lastNumberTime, setLastNumberTime] = useState(null);
  const [tick, setTick] = useState(0);
  const [foundCount, setFoundCount] = useState(0);
  const consoleRef = useRef(null);

  // Auto-scroll to the bottom when results update
  useLayoutEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [results]);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTick((prev) => prev + 1); // Force re-render every 100ms
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const start = () => {
    if (isRunning) return;
    setResults(["> Starting experiment..."]);
    setFoundCount(0);
    setIsRunning(true);
    const chunkSize = 4000;
    processChunk(0, chunkSize);
  };

  const downloadCSV = () => {
    const numbers = results.filter((item) => typeof item === 'number' || item.sat).map((item) => {
      if (typeof item === 'number') return item;
      return `${item.sat};${item.block}`;
    });
    const csvContent = "data:text/csv;charset=utf-8," + numbers.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "palindromic_uncommons.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const togglePaliBlock = () => {
    if (!isRunning) setIsPaliBlockOnly((prev) => !prev);
  };

  const processChunk = (startBlock, chunkSize) => {
    const endBlock = Math.min(startBlock + chunkSize, TOTAL_BLOCKS);
    let newPalins = [];
    for (let block = startBlock; block < endBlock; block++) {
      let uncommon = getBlockUncommon(block);
      if (checkUncommonPali(uncommon) && (!isPaliBlockOnly || palindromeCheck(block))) {
        if (isPaliBlockOnly) {
          newPalins.push({ sat: uncommon, block: block });
        } else {
          newPalins.push(uncommon);
        }
      }
    }
    if (newPalins.length > 0) {
      setResults((prev) => [...prev, ...newPalins]);
      setFoundCount((prev) => prev + newPalins.length);
      setLastNumberTime(Date.now()); // Record time when numbers are added
    }
    if (endBlock < TOTAL_BLOCKS) {
      setTimeout(() => processChunk(endBlock, chunkSize), 0);
    } else {
      setIsRunning(false);
      setResults((prev) => {
        const finalResults = newPalins.length > 0 ? [...prev, ...newPalins] : prev;
        const count = finalResults.filter((item) => typeof item === 'number' || item.sat).length;
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

  function palindromeCheck(num) {
    const numStr = String(num); // Force it to a string, even if it’s a number or undefined
    if (!numStr || numStr === '0') return false;
    return numStr === numStr.split('').reverse().join('');
  }

  function checkUncommonPali(satNum) {
    if (satNum % 10 !== 0) return false;
    let numStr = satNum.toString().replace(/0+$/, "");
    return palindromeCheck(numStr);
  }

  return (
    <div className="console">
      <div className="console-output" ref={consoleRef}>
        {results.map((result, index) => (
          <div key={index} className="console-line">
            > {typeof result === 'string' ? (
              result
            ) : result.sat ? (
              `${result.sat}  [Block: ${result.block}]`
            ) : (
              result
            )}
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
      <span onClick={togglePaliBlock} className={isRunning ? "disabled" : "console-toggle"}>
        {isPaliBlockOnly ? '[X]' : '[_]'} PaliBlock
      </span>
      <button onClick={downloadCSV} disabled={isRunning || foundCount === 0}>[Download CSV]</button>
      <Link to="/" className="console-link">[Back]</Link>
      </div>
    </div>
  );
}

export default ConsoleNumbers;