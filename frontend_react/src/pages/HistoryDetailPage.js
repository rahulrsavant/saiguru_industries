import { Link, useNavigate, useParams } from 'react-router-dom';
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

const HistoryDetailPage = () => {
  const { estimateNo } = useParams();
  const navigate = useNavigate();
  const history = getEstimateHistory();
  const estimate = history.find((entry) => entry.estimateNo === estimateNo);

  const handleLoad = () => {
    if (!estimate) return;
    setCurrentSessionFromHistory(estimate);
    navigate('/estimate');
  };

  if (!estimate) {
    return (
      <main className="page page-history">
        <div className="empty-card">Estimate not found.</div>
      </main>
    );
  }

  return (
    <main className="page page-history-detail">
      <section className="section-title">
        <p className="eyebrow">Estimate detail</p>
        <h1>{estimate.estimateNo}</h1>
        <p className="subtext">Updated {formatIndiaDateTime(estimate.updatedAt || estimate.createdAt)}</p>
      </section>

      <section className="history-detail-card">
        <div>
          <h2>{estimate.customer?.name || 'Unknown customer'}</h2>
          <p>{estimate.customer?.businessName || 'No business name'}</p>
          <p>{estimate.customer?.mobile || 'No mobile'}</p>
          <p>{estimate.customer?.email || 'No email'}</p>
        </div>
        <div className="history-detail-meta">
          <div>
            <span>Items</span>
            <strong>{estimate.items?.length || 0}</strong>
          </div>
          <div>
            <span>Total weight</span>
            <strong>
              {Number.isFinite(estimate.totals?.totalWeightKg)
                ? `${estimate.totals.totalWeightKg.toFixed(3)} kg`
                : 'n/a'}
            </strong>
          </div>
        </div>
      </section>

      <div className="table-wrapper">
        <table className="estimate-table">
          <thead>
            <tr>
              <th>Sr</th>
              <th>Shape</th>
              <th>Alloy</th>
              <th>Pieces</th>
              <th>Dimensions</th>
              <th>Result (kg)</th>
            </tr>
          </thead>
          <tbody>
            {(estimate.items || []).map((item, index) => (
              <tr key={item.lineId || index}>
                <td>{index + 1}</td>
                <td>{item.shape?.label || 'n/a'}</td>
                <td>{item.alloy?.label || 'n/a'}</td>
                <td>
                  {item.mode === 'WEIGHT_TO_QTY'
                    ? `${item.pieces} kg`
                    : Number.isFinite(item.pieces)
                      ? item.pieces
                      : 'n/a'}
                </td>
                <td>{item.dimensionsSummary}</td>
                <td>
                  {Number.isFinite(item.calculation?.weightKg)
                    ? item.calculation.weightKg.toFixed(3)
                    : 'n/a'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="history-actions">
        <Link to="/history" className="link-button">
          Back to History
        </Link>
        <button type="button" className="secondary" onClick={handleLoad}>
          Load to Edit
        </button>
      </div>
    </main>
  );
};

export default HistoryDetailPage;
