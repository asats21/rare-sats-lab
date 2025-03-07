import { Link } from 'react-router-dom';

function MainPage() {
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
                <Link to="/palindromic-uncommons" className="btn btn-primary">View Experiment</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
