import useGlossaryTranslation from '../i18n/useGlossaryTranslation';
import { formatDimensionsSummary, translateDimensionKey, translateShapeLabel } from '../i18n/catalog';

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

const formatNumber = (value, digits = 3) =>
  Number.isFinite(value) ? value.toFixed(digits) : '0.000';

const ViewEstimateItemModal = ({ item, onClose, onEdit }) => {
  const { t, i18n } = useGlossaryTranslation();
  if (!item) return null;

  const dimensions = item.dimensions || {};

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{t('itemDetails.title')}</h3>
          <button type="button" className="icon-button" onClick={onClose} title={t('itemDetails.closeTitle')}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-grid">
            <div>
              <span>{t('itemDetails.shape')}</span>
              <strong>
                {item.shape?.label
                  ? translateShapeLabel(item.shape.label, t, i18n.language)
                  : t('general.na')}
              </strong>
            </div>
            <div>
              <span>{t('itemDetails.alloy')}</span>
              <strong>{item.alloy?.label || t('general.na')}</strong>
            </div>
            <div>
              <span>{t('itemDetails.pieces')}</span>
              <strong>
                {item.mode === 'WEIGHT_TO_QTY'
                  ? `${item.pieces} kg`
                  : Number.isFinite(item.pieces)
                    ? item.pieces
                    : t('general.na')}
              </strong>
            </div>
            <div>
              <span>{t('itemDetails.density')}</span>
              <strong>{Number.isFinite(item.densityGcm3) ? item.densityGcm3 : t('general.na')}</strong>
            </div>
            <div>
              <span>{t('itemDetails.resultKg')}</span>
              <strong>{formatNumber(item.calculation?.weightKg)}</strong>
            </div>
            <div>
              <span>{t('itemDetails.created')}</span>
              <strong>{formatIndiaDateTime(item.createdAt, t)}</strong>
            </div>
          </div>

          <div className="modal-dimensions">
            <h4>{t('itemDetails.dimensions')}</h4>
            <p>{formatDimensionsSummary(item.dimensions, t, i18n.language)}</p>
            <div className="dimension-list">
              {Object.keys(dimensions).length === 0 ? (
                <span>{t('general.na')}</span>
              ) : (
                Object.entries(dimensions).map(([key, value]) => (
                  <div key={key}>
                    <span>{translateDimensionKey(key, t, i18n.language)}</span>
                    <strong>
                      {value?.value ?? t('general.dash')} {value?.unit || ''}
                    </strong>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="secondary" onClick={onClose}>
            {t('itemDetails.close')}
          </button>
          {onEdit ? (
            <button type="button" className="primary" onClick={onEdit}>
              {t('itemDetails.editItem')}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ViewEstimateItemModal;
