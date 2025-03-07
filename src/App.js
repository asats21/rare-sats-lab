import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <div className="App bg-black text-white min-vh-100">
      <header className="text-center py-4">
        <h1 className="fw-bold">Rare Sats Lab</h1>
      </header>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-4">
            <div className="card bg-dark text-white border-light">
              <div className="card-body">
                <h5 className="card-title">Palindromic Uncommons</h5>
                <p className="card-text">Explore uncommon satoshis with palindromic properties.</p>
                <a href="#/" className="btn btn-primary">View Experiment</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;