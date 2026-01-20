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

const formatNumber = (value, digits = 3) =>
  Number.isFinite(value) ? value.toFixed(digits) : '0.000';

const ViewEstimateItemModal = ({ item, onClose, onEdit }) => {
  if (!item) return null;

  const dimensions = item.dimensions || {};

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Item details</h3>
          <button type="button" className="icon-button" onClick={onClose} title="Close">
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-grid">
            <div>
              <span>Shape</span>
              <strong>{item.shape?.label || 'n/a'}</strong>
            </div>
            <div>
              <span>Alloy</span>
              <strong>{item.alloy?.label || 'n/a'}</strong>
            </div>
            <div>
              <span>Pieces</span>
              <strong>
                {item.mode === 'WEIGHT_TO_QTY'
                  ? `${item.pieces} kg`
                  : Number.isFinite(item.pieces)
                    ? item.pieces
                    : 'n/a'}
              </strong>
            </div>
            <div>
              <span>Density (g/cm3)</span>
              <strong>{Number.isFinite(item.densityGcm3) ? item.densityGcm3 : 'n/a'}</strong>
            </div>
            <div>
              <span>Result (kg)</span>
              <strong>{formatNumber(item.calculation?.weightKg)}</strong>
            </div>
            <div>
              <span>Created</span>
              <strong>{formatIndiaDateTime(item.createdAt)}</strong>
            </div>
          </div>

          <div className="modal-dimensions">
            <h4>Dimensions</h4>
            {item.dimensionsSummary ? <p>{item.dimensionsSummary}</p> : null}
            <div className="dimension-list">
              {Object.keys(dimensions).length === 0 ? (
                <span>n/a</span>
              ) : (
                Object.entries(dimensions).map(([key, value]) => (
                  <div key={key}>
                    <span>{key}</span>
                    <strong>
                      {value?.value ?? '—'} {value?.unit || ''}
                    </strong>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="secondary" onClick={onClose}>
            Close
          </button>
          {onEdit ? (
            <button type="button" className="primary" onClick={onEdit}>
              Edit this item
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ViewEstimateItemModal;
