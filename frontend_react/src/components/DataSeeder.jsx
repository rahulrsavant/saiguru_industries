import { useState } from 'react';
import { API_BASE_URL } from '../utils/apiConfig';
import { authFetch } from '../utils/authFetch';
import useGlossaryTranslation from '../i18n/useGlossaryTranslation';
import { persistCurrentEstimateSession, upsertHistoryEntry } from '../utils/estimateStorage';

const DataSeeder = ({ onSeedComplete, onEstimateLoaded }) => {
  const { t } = useGlossaryTranslation();
  const [seedSummary, setSeedSummary] = useState(null);
  const [estimateSummary, setEstimateSummary] = useState(null);
  const [seedErrorKey, setSeedErrorKey] = useState('');
  const [seedSuccessKey, setSeedSuccessKey] = useState('');
  const [isSeeding, setIsSeeding] = useState(false);
  const [confirmMode, setConfirmMode] = useState('');

  const handleSeed = async (mode) => {
    setIsSeeding(true);
    setSeedErrorKey('');
    setSeedSuccessKey('');
    try {
      const response = await authFetch(`${API_BASE_URL}/api/admin/seed/products`, {
        method: 'POST',
        body: JSON.stringify({ mode }),
      });
      if (!response.ok) {
        setSeedErrorKey('admin.seedError');
        return;
      }
      const data = await response.json();
      const products = data.products || data;
      setSeedSummary(products);
      setEstimateSummary(data.estimate || null);
      const hasFailures = (products.items || []).some((item) => item.status === 'FAILED');
      if (hasFailures) {
        setSeedErrorKey('admin.seedPartialError');
      } else {
        setSeedSuccessKey('admin.seedSuccess');
      }
      if (onSeedComplete) {
        onSeedComplete(data);
      }
      if (data.estimate?.estimateId) {
        const estimateResponse = await authFetch(`${API_BASE_URL}/api/estimate/current`);
        if (estimateResponse.ok) {
          const estimateSession = await estimateResponse.json();
          persistCurrentEstimateSession(estimateSession);
          upsertHistoryEntry(estimateSession);
          if (onEstimateLoaded) {
            onEstimateLoaded(estimateSession);
          }
        }
      }
    } catch (err) {
      setSeedErrorKey('admin.seedError');
    } finally {
      setIsSeeding(false);
    }
  };

  const results = seedSummary?.items || [];

  return (
    <section className="admin-seed-panel">
      <div className="admin-header">
        <h2>{t('admin.seedTitle')}</h2>
        <p>{t('admin.seedSubtitle')}</p>
      </div>
      <div className="admin-seed-actions">
        <button type="button" className="secondary" onClick={() => setConfirmMode('seed')} disabled={isSeeding}>
          {t('admin.seedButton')}
        </button>
        <button type="button" className="secondary" onClick={() => setConfirmMode('reseed')} disabled={isSeeding}>
          {t('admin.reseedButton')}
        </button>
        {isSeeding ? <span className="helper-text">{t('admin.seedRunning')}</span> : null}
      </div>

      {seedErrorKey ? <div className="error-box">{t(seedErrorKey)}</div> : null}
      {seedSuccessKey ? <div className="success-box">{t(seedSuccessKey)}</div> : null}

      {seedSummary ? (
        <div className="admin-seed-summary">
          <div className="admin-seed-metrics">
            <span>{t('admin.seedInserted', { count: seedSummary.inserted })}</span>
            <span>{t('admin.seedSkipped', { count: seedSummary.skipped })}</span>
            <span>{t('admin.seedDeleted', { count: seedSummary.deleted })}</span>
            <span>{t('admin.seedBatch', { batchId: seedSummary.batchId })}</span>
          </div>
        </div>
      ) : null}

      {estimateSummary ? (
        <div className="admin-seed-summary">
          <div className="admin-seed-metrics">
            <span>{t('admin.seedEstimateNo', { estimateNo: estimateSummary.estimateNo || '--' })}</span>
            <span>{t('admin.seedEstimateInserted', { count: estimateSummary.itemsInserted || 0 })}</span>
            <span>{t('admin.seedEstimateSkipped', { count: estimateSummary.itemsSkipped || 0 })}</span>
            <span>{t('admin.seedEstimateDeleted', { count: estimateSummary.itemsDeleted || 0 })}</span>
          </div>
          <button
            type="button"
            className="secondary"
            onClick={() => {
              const target = document.getElementById('estimate-items');
              if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
          >
            {t('admin.seedEstimateOpen')}
          </button>
        </div>
      ) : null}

      {results.length ? (
        <div className="admin-table">
          <div className="admin-table-row admin-table-header seed-row">
            <span>{t('admin.seedType')}</span>
            <span>{t('admin.seedName')}</span>
            <span>{t('admin.seedStatus')}</span>
            <span>{t('admin.seedWeight')}</span>
            <span>{t('admin.seedErrorLabel')}</span>
          </div>
          {results.map((item) => {
            const productType = item.productType || item.type;
            const displayName = item.displayName || item.name;
            const errorText = item.error || item.notes || '--';
            return (
              <div key={`${productType}-${item.id || displayName}`} className="admin-table-row seed-row">
                <span>{productType}</span>
                <span>{displayName}</span>
                <span>{item.status}</span>
                <span>{item.weightKg != null ? `${item.weightKg.toFixed(3)} kg` : '--'}</span>
                <span>{errorText}</span>
              </div>
            );
          })}
        </div>
      ) : null}

      {confirmMode ? (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{t('admin.seedConfirmTitle')}</h3>
              <button
                type="button"
                className="icon-button"
                onClick={() => setConfirmMode('')}
                title={t('general.close')}
                aria-label={t('general.close')}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p>
                {confirmMode === 'reseed' ? t('admin.reseedConfirm') : t('admin.seedConfirm')}
              </p>
            </div>
            <div className="modal-footer">
              <button type="button" className="secondary" onClick={() => setConfirmMode('')}>
                {t('general.cancel')}
              </button>
              <button
                type="button"
                className="primary"
                onClick={() => {
                  const mode = confirmMode;
                  setConfirmMode('');
                  handleSeed(mode);
                }}
              >
                {t('general.confirm')}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default DataSeeder;
