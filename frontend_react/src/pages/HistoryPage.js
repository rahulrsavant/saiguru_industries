import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getEstimateHistory, setCurrentSessionFromHistory } from '../utils/estimateStorage';
import useGlossaryTranslation from '../i18n/useGlossaryTranslation';

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

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();
  const { t } = useGlossaryTranslation();

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
        <h1>{t('history.title')}</h1>
        <p>{t('history.subtitle')}</p>
      </section>

      <div className="history-grid">
        {history.length === 0 ? (
          <div className="empty-card">{t('history.empty')}</div>
        ) : (
          history.map((estimate) => (
            <div key={estimate.estimateNo} className="history-card">
              <div className="history-header">
                <div>
                  <p className="eyebrow">{t('history.estimateLabel')}</p>
                  <h2>{estimate.estimateNo}</h2>
                  <p className="subtext">
                    {formatIndiaDateTime(estimate.updatedAt || estimate.createdAt, t)}
                  </p>
                </div>
                <div className="history-meta">
                  <span>{estimate.customer?.name || t('history.unknownCustomer')}</span>
                  <span>{t('history.itemsCount', { count: estimate.items?.length || 0 })}</span>
                  <span>
                    {Number.isFinite(estimate.totals?.totalWeightKg)
                      ? `${estimate.totals.totalWeightKg.toFixed(3)} kg`
                      : t('general.na')}
                  </span>
                </div>
              </div>
              <div className="history-actions">
                <Link to={`/history/${encodeURIComponent(estimate.estimateNo)}`} className="link-button">
                  {t('history.viewDetails')}
                </Link>
                <button type="button" className="secondary" onClick={() => handleLoad(estimate)}>
                  {t('history.loadToEdit')}
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
