import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import __wbg_init, { is_prime } from './is_prime_wasm';
import './App.css';

function TestPrimeWasm() {
  const [number, setNumber] = useState('');
  const [result, setResult] = useState(null);
  const [isWasmLoaded, setIsWasmLoaded] = useState(false);

  // Load WASM when the component mounts
  useEffect(() => {
    const loadWasm = async () => {
      try {
        await __wbg_init(); // Uses the path set in is_prime_wasm.js
        setIsWasmLoaded(true);
        console.log('WASM loaded successfully');
      } catch (err) {
        console.error('Failed to load WASM:', err);
      }
    };
    loadWasm();
  }, []);

  // Check if the number is prime
  const checkPrime = () => {
    if (!isWasmLoaded) {
      setResult('> WASM not loaded yet');
      return;
    }
    if (!number) {
      setResult('> Enter a number');
      return;
    }
    // eslint-disable-next-line no-undef
    const num = BigInt(number);
    const prime = is_prime(num);
    setResult(`> ${number} is ${prime ? 'Prime' : 'Not Prime'}`);
  };

  return (
    <div className="console">
      <div className="console-output">
        <div className="console-line console-header">
          > Test WASM Prime Checker
        </div>
        <div className="console-line">
          > Enter a number to check if it’s prime:
        </div>
        <div className="console-line">
          <span>> </span>
          <input
            type="text"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="console-input console-input-black"
            placeholder="Number"
          />
        </div>
        {result && (
          <div className="console-line">
            {result}
          </div>
        )}
        <div className="controls">
          <button onClick={checkPrime}>
            [Check]
          </button>
          <Link to="/" className="console-link">[Back]</Link>
        </div>
      </div>
    </div>
  );
}

export default TestPrimeWasm;