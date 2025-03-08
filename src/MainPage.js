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
          > <Link to="/palindromic-uncommons" className="console-link">[Palindromic Uncommons]</Link> - Explore uncommon satoshis with palindromic properties.
        </div>
        <div className="console-line">
          > <Link to="/prime-black-uncommons" className="console-link">[Prime Black Uncommons]</Link> - Explore prime black uncommon satoshis.
        </div>
        <div className="console-line">
          <span className="blinking-cursor">_</span>
        </div>
      </div>
    </div>
  );
}

export default MainPage;