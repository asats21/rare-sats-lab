import { Link } from 'react-router-dom';
import './App.css';

function MainPage() {
  return (
    <div className="console">
      <div className="console-output">
        <div className="console-line console-header">
          > Rare Sats Lab
        </div>
        <div className="console-line">
          > Experiments:
        </div>
        <div className="console-line">
          > <Link to="/perfect-palinceptions" className="console-link">[Perfect Palinceptions]</Link> - Explore perfect palindromic satoshis.
        </div>
        <div className="console-line">
          > <Link to="/palindromic-uncommons" className="console-link">[Palindromic Uncommons]</Link> - Explore uncommon satoshis with palindromic properties.
        </div>
        <div className="console-line">
          > <Link to="/prime-uncommons" className="console-link">[Prime Uncommons]</Link> - Explore prime uncommon satoshis.
        </div>
        <div className="console-line">
          > <Link to="/prime-black-uncommons" className="console-link">[Prime Black Uncommons]</Link> - Explore prime black uncommon satoshis.
        </div>
        <div className="console-line">
          > <Link to="/rodarmor-names" className="console-link">[Rodarmor Names]</Link> - Explore rodarmor name satoshis.
        </div>
        <div className="console-line">
          > <Link to="/test-prime-wasm" className="console-link">[Test WASM is_prime]</Link> - Test the WASM is_prime function.
        </div>
        
        <div className="console-line">
          <span className="blinking-cursor">_</span>
        </div>
        <div className="console-line console-footer">
          > (C) Just kidding, there isn’t one. Honestly, it’s more of a little art experiment than an app. Have fun.
        </div>
      </div>
    </div>
  );
}

export default MainPage;