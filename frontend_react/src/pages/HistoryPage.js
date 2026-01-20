import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getEstimateHistory, setCurrentSessionFromHistory } from '../utils/estimateStorage';

const formatIndiaDateTime = (isoString) => {
  if (!isoString) return 'n/a';
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoString));
};

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setHistory(getEstimateHistory());
  }, []);

  const handleLoad = (estimate) => {
    setCurrentSessionFromHistory(estimate);
    navigate('/estimate');
  };

  return (
    <main className="page page-history">
      <section className="section-title">
        <h1>Estimate history</h1>
        <p>Saved estimates are stored locally on this device.</p>
      </section>

      <div className="history-grid">
        {history.length === 0 ? (
          <div className="empty-card">No saved estimates yet.</div>
        ) : (
          history.map((estimate) => (
            <div key={estimate.estimateNo} className="history-card">
              <div className="history-header">
                <div>
                  <p className="eyebrow">Estimate</p>
                  <h2>{estimate.estimateNo}</h2>
                  <p className="subtext">{formatIndiaDateTime(estimate.updatedAt || estimate.createdAt)}</p>
                </div>
                <div className="history-meta">
                  <span>{estimate.customer?.name || 'Unknown customer'}</span>
                  <span>{estimate.items?.length || 0} items</span>
                  <span>
                    {Number.isFinite(estimate.totals?.totalWeightKg)
                      ? `${estimate.totals.totalWeightKg.toFixed(3)} kg`
                      : 'n/a'}
                  </span>
                </div>
              </div>
              <div className="history-actions">
                <Link to={`/history/${encodeURIComponent(estimate.estimateNo)}`} className="link-button">
                  View details
                </Link>
                <button type="button" className="secondary" onClick={() => handleLoad(estimate)}>
                  Load to Edit
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
};

export default HistoryPage;
