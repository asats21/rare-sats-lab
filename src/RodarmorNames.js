import { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import __wbg_init, { is_prime } from './is_prime_wasm';
import { rodarmorNames } from './RodarmorNamesList';
import { isPizza } from './Pizza';
import './App.css';

function RodarmorNames() {
  // State for WASM loading, checkbox filters, and name display
  const [isWasmLoaded, setIsWasmLoaded] = useState(false);
  const [isPrimeChecked, setIsPrimeChecked] = useState(false);
  const [isPizzaChecked, setIsPizzaChecked] = useState(false);
  const [displayedNames, setDisplayedNames] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  // Reference for the console output div to manage scrolling
  const consoleRef = useRef(null);

  // Load WASM module when component mounts
  useEffect(() => {
    const loadWasm = async () => {
      try {
        await __wbg_init();
        setIsWasmLoaded(true);
      } catch (err) {
        console.error('Failed to load WASM:', err);
      }
    };
    loadWasm();
  }, []);

  // Sort rodarmor names alphabetically by name (computed once)
  const sortedNames = useMemo(() => {
    return Object.entries(rodarmorNames)
      .sort((a, b) => a[1].localeCompare(b[1])); // Sort by name
  }, []);

  // Filter names based on checkbox states
  const filteredNames = useMemo(() => {
    if (!isWasmLoaded) return []; // Wait for WASM to load
    return sortedNames.filter(([num, name]) => {
      const isPrimeNum = isPrimeChecked ? is_prime(num) : true;
      const isPizzaNum = isPizzaChecked ? isPizza(Number(num)) : true;
      return isPrimeNum && isPizzaNum;
    });
  }, [sortedNames, isPrimeChecked, isPizzaChecked, isWasmLoaded]);

  // Handle the "Run" button click
  const handleRun = () => {
    setDisplayedNames([]); // Reset the list
    setIsRunning(true);    // Start the display process
  };

  // Progressively display names when running
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setDisplayedNames((prev) => {
        const nextIndex = prev.filter(item => Array.isArray(item)).length;
        if (nextIndex >= filteredNames.length) {
          clearInterval(interval);
          setIsRunning(false);
          const count = filteredNames.length;
          return [...prev, `> Experiment finished. Found ${count} names.`];
        }
        const batchSize = 100;
        const nextBatch = filteredNames.slice(nextIndex, nextIndex + batchSize);
        return [...prev, ...nextBatch];
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, filteredNames]);

  // Auto-scroll to the bottom when displayedNames updates
  useLayoutEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [displayedNames]);

  // Render the console-like UI
  return (
    <div className="console">
      <div className="console-output" ref={consoleRef}>
        <div className="console-line console-header">
          > Rodarmor Names
        </div>
        {displayedNames.map((item, index) => (
          <div key={index} className="console-line">
            > {typeof item === 'string' ? item : `${item[1]} (${item[0]})`}
          </div>
        ))}
        <div className="console-line">
          <span className="blinking-cursor">_</span>
        </div>
      </div>
      <div className="controls">
        <span>> </span>
        <button onClick={handleRun} disabled={isRunning}>[Start]</button>
        <span onClick={() => setIsPrimeChecked(!isPrimeChecked)} className="console-toggle">
          {isPrimeChecked ? '[X]' : '[_]'} Prime
        </span>
        <span onClick={() => setIsPizzaChecked(!isPizzaChecked)} className="console-toggle">
          {isPizzaChecked ? '[X]' : '[_]'} Pizza
        </span>
        <Link to="/" className="console-link">[Back]</Link>
      </div>
    </div>
  );
}

export default RodarmorNames;