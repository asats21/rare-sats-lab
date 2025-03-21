import { useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function PerfectPalinceptions() {
  // eslint-disable-next-line no-undef
  const START = BigInt("45000000000");          // 45 billion (11 digits)
  // eslint-disable-next-line no-undef
  const END = BigInt("2100000000000000");       // 2.1 quadrillion (16 digits)

  // State for options
  const [totalLengths, setTotalLengths] = useState({ 12: true, 14: true, 15: true, 16: true });
  const [subPaliLengths, setSubPaliLengths] = useState({ 3: false, 4: false, 5: false, 6: false, 7: false, 8: false });
  const [statsOnly, setStatsOnly] = useState(false);
  const [output, setOutput] = useState([]);

  // Helper function to generate palindromes
  function generatePalindromes(k) {
    const h = Math.ceil(k / 2);
    const palindromes = [];
    
    const generate = (s, i) => {
      if (i === h) {
        const prefix = s.slice(0, k - h);
        const p = s + prefix.split('').reverse().join('');
        palindromes.push(p);
        return;
      }
      const startDigit = i === 0 ? 1 : 0;
      for (let d = startDigit; d <= 9; d++) {
        generate(s + d, i + 1);
      }
    };
    
    generate('', 0);
    return palindromes;
  }

  // Main calculation function
  const runExperiment = () => {
    const lengths = Object.keys(totalLengths).filter(l => totalLengths[l]).map(Number);
    const subLengths = Object.keys(subPaliLengths).filter(l => subPaliLengths[l]).map(Number);
    let grandTotal = 0;
    const seenNumbers = new Set();
    const results = [];

    for (const m of lengths) {
      results.push(`Length ${m}:`);
      let mTotal = 0;

      let possibleK = [];
      for (let n = 2; n <= 5; n++) {
        if (m % n === 0) {
          possibleK.push(m / n);
        }
      }
      possibleK = subLengths.length > 0 ? possibleK.filter(k => subLengths.includes(k)) : possibleK;
      possibleK.sort((a, b) => a - b);

      for (const k of possibleK) {
        const n = m / k;
        results.push(`Subgroup with sub-palindrome length ${k} (repeated ${n} times):`);
        let subgroup = [];

        const subPalindromes = generatePalindromes(k);
        for (const p of subPalindromes) {
          const fullString = p.repeat(n);
        // eslint-disable-next-line no-undef
          const num = BigInt(fullString);

          if (num >= START && num <= END && !seenNumbers.has(fullString)) {
            seenNumbers.add(fullString);
            subgroup.push(num);
          }
        }

        subgroup.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
        if (!statsOnly) {
          subgroup.forEach(num => results.push(num.toString()));
        }
        results.push(`In subgroup, perfect palinceptions found: ${subgroup.length}`);
        mTotal += subgroup.length;
      }

      results.push(`Total for length ${m}: ${mTotal}`);
      results.push('');
      grandTotal += mTotal;
    }

    results.push(`Grand total perfect palinceptions found in this experiment: ${grandTotal}`);
    setOutput(results);
  };

  // Handlers for options
  const handleTotalLengthChange = (length) => {
    setTotalLengths(prev => ({ ...prev, [length]: !prev[length] }));
  };

  const handleSubPaliLengthChange = (length) => {
    setSubPaliLengths(prev => ({ ...prev, [length]: !prev[length] }));
  };

  return (
    <div className="console-vertical">
      <div className="console-output-vertical">
        <div className="console-line console-header">
          > Perfect Palinceptions
        </div>
        {output.map((line, index) => (
          <div key={index} className="console-line">
            > {line}
          </div>
        ))}
        <div className="console-line">
          <span className="blinking-cursor">_</span>
        </div>
      </div>
      <div className="options-menu">
        <div className="console-line">> Select Options:</div>
        <div className="console-line">> Total Lengths:</div>
        {[12, 14, 15, 16].map(length => (
          <div key={length} className="console-line">
            > <span 
                className={`console-toggle ${!totalLengths[length] ? 'disabled' : ''}`}
                onClick={() => handleTotalLengthChange(length)}
              >
                [{totalLengths[length] ? 'X' : ' '}] {length}
              </span>
          </div>
        ))}
        <div className="console-line">> Sub-palindrome Lengths:</div>
        {[3, 4, 5, 6, 7, 8].map(length => (
          <div key={length} className="console-line">
            > <span 
                className={`console-toggle ${!subPaliLengths[length] ? 'disabled' : ''}`}
                onClick={() => handleSubPaliLengthChange(length)}
              >
                [{subPaliLengths[length] ? 'X' : ' '}] {length}
              </span>
          </div>
        ))}
        <div className="console-line">> Other:</div>
        <div className="console-line">
          > <span 
              className={`console-toggle ${!statsOnly ? 'disabled' : ''}`}
              onClick={() => setStatsOnly(!statsOnly)}
            >
              [{statsOnly ? 'X' : ' '}] Stats Only
            </span>
        </div>
        <div className="controls">
          > <button onClick={runExperiment}>[Run Experiment]</button>
          > <Link to="/" className="console-link">[Back to Main]</Link>
        </div>
      </div>
    </div>
  );
}

export default PerfectPalinceptions;