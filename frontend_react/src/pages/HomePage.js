import { useNavigate } from 'react-router-dom';
import { createNewEstimateSession } from '../utils/estimateStorage';

const HomePage = () => {
  const navigate = useNavigate();

  const handleStartNew = () => {
    createNewEstimateSession();
    navigate('/estimate');
  };

  return (
    <main className="page page-home">
      <section className="hero-card">
        <div>
          <p className="eyebrow">Saiguru Industries</p>
          <h1>Quick estimates for metal stock in minutes.</h1>
          <p className="hero-sub">
            Start a new estimate, review saved history, or tweak preferences for your shop.
          </p>
        </div>
        <div className="home-actions">
          <button type="button" className="home-card primary" onClick={handleStartNew}>
            <span>Start New Estimate</span>
            <small>Fresh customer details and empty line items.</small>
          </button>
          <button type="button" className="home-card" onClick={() => navigate('/history')}>
            <span>History</span>
            <small>Browse and reopen saved estimates.</small>
          </button>
          <button type="button" className="home-card" onClick={() => navigate('/settings')}>
            <span>Settings</span>
            <small>Update defaults and clear history.</small>
          </button>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
