import { Link, useNavigate, useParams } from 'react-router-dom';
import { getEstimateHistory, setCurrentSessionFromHistory } from '../utils/estimateStorage';
import useGlossaryTranslation from '../i18n/useGlossaryTranslation';
import { formatDimensionsSummary, translateShapeLabel } from '../i18n/catalog';

const formatIndiaDateTime = (isoString, t) => {
  if (!isoString) return t('general.na');
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
  const { t, i18n } = useGlossaryTranslation();

  const handleLoad = () => {
    if (!estimate) return;
    setCurrentSessionFromHistory(estimate);
    navigate('/estimate');
  };

  if (!estimate) {
    return (
      <main className="page page-history">
        <div className="empty-card">{t('historyDetail.notFound')}</div>
      </main>
    );
  }

  return (
    <main className="page page-history-detail">
      <section className="section-title">
        <p className="eyebrow">{t('historyDetail.eyebrow')}</p>
        <h1>{estimate.estimateNo}</h1>
        <p className="subtext">
          {t('historyDetail.updated', {
            date: formatIndiaDateTime(estimate.updatedAt || estimate.createdAt, t),
          })}
        </p>
      </section>

      <section className="history-detail-card">
        <div>
          <h2>{estimate.customer?.name || t('historyDetail.unknownCustomer')}</h2>
          <p>{estimate.customer?.businessName || t('historyDetail.noBusinessName')}</p>
          <p>{estimate.customer?.mobile || t('historyDetail.noMobile')}</p>
          <p>{estimate.customer?.email || t('historyDetail.noEmail')}</p>
        </div>
        <div className="history-detail-meta">
          <div>
            <span>{t('historyDetail.items')}</span>
            <strong>{estimate.items?.length || 0}</strong>
          </div>
          <div>
            <span>{t('historyDetail.totalWeight')}</span>
            <strong>
              {Number.isFinite(estimate.totals?.totalWeightKg)
                ? `${estimate.totals.totalWeightKg.toFixed(3)} kg`
                : t('general.na')}
            </strong>
          </div>
        </div>
      </section>

      <div className="table-wrapper">
        <table className="estimate-table">
          <thead>
            <tr>
              <th>{t('table.sr')}</th>
              <th>{t('table.shape')}</th>
              <th>{t('table.alloy')}</th>
              <th>{t('table.pieces')}</th>
              <th>{t('table.dimensions')}</th>
              <th>{t('table.resultKg')}</th>
            </tr>
          </thead>
          <tbody>
            {(estimate.items || []).map((item, index) => (
              <tr key={item.lineId || index}>
                <td>{index + 1}</td>
                <td>
                  {item.shape?.label
                    ? translateShapeLabel(item.shape.label, t, i18n.language)
                    : t('general.na')}
                </td>
                <td>{item.alloy?.label || t('general.na')}</td>
                <td>
                  {item.mode === 'WEIGHT_TO_QTY'
                    ? `${item.pieces} kg`
                    : Number.isFinite(item.pieces)
                      ? item.pieces
                      : t('general.na')}
                </td>
                <td>{formatDimensionsSummary(item.dimensions, t, i18n.language)}</td>
                <td>
                  {Number.isFinite(item.calculation?.weightKg)
                    ? item.calculation.weightKg.toFixed(3)
                    : t('general.na')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="history-actions">
        <Link to="/history" className="link-button">
          {t('historyDetail.backToHistory')}
        </Link>
        <button type="button" className="secondary" onClick={handleLoad}>
          {t('history.loadToEdit')}
        </button>
      </div>
    </main>
  );
};

export default HistoryDetailPage;
