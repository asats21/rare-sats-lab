import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function PalindromicUncommons() {
  return (
    <div className="App bg-black text-white min-vh-100">
      <header className="text-center py-4">
        <h1 className="fw-bold">Palindromic Uncommons</h1>
      </header>
      <div className="text-center">
        <Link to="/" className="btn btn-secondary">Back to Main</Link>
      </div>
    </div>
  );
}

export default PalindromicUncommons;
