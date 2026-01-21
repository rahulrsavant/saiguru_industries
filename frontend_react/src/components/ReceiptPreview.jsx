import { forwardRef } from 'react';
import useGlossaryTranslation from '../i18n/useGlossaryTranslation';
import { formatDimensionsSummary, translateShapeLabel } from '../i18n/catalog';

const formatIndiaDateTime = (isoString, t) => {
  if (!isoString) return '';
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

const ReceiptPreview = forwardRef(({ session }, ref) => {
  const { t, i18n } = useGlossaryTranslation();
  const items = session?.items || [];
  const totals = session?.totals || { totalWeightKg: 0 };
  const createdAt = session?.updatedAt || session?.createdAt;

  return (
    <div className="receipt-preview" ref={ref}>
      <div className="receipt-page" id="pdf-content">
        <header className="receipt-header">
          <div>
            <h2>{t('receipt.title')}</h2>
            <p className="receipt-sub">{t('receipt.company')}</p>
          </div>
          <div className="receipt-meta">
            <span>{t('receipt.estimateNo')}</span>
            <strong>{session?.estimateNo || t('general.dash')}</strong>
            <span>{t('receipt.date')}</span>
            <strong>{formatIndiaDateTime(createdAt, t) || t('general.dash')}</strong>
          </div>
        </header>

        <section className="receipt-customer">
          <div>
            <span>{t('receipt.customerName')}</span>
            <strong>{session?.customer?.name || t('general.dash')}</strong>
          </div>
          <div>
            <span>{t('receipt.businessName')}</span>
            <strong>{session?.customer?.businessName || t('general.dash')}</strong>
          </div>
          <div>
            <span>{t('receipt.mobileNo')}</span>
            <strong>{session?.customer?.mobile || t('general.dash')}</strong>
          </div>
          <div>
            <span>{t('receipt.email')}</span>
            <strong>{session?.customer?.email || t('general.dash')}</strong>
          </div>
        </section>

        <table className="receipt-table">
          <thead>
            <tr>
              <th>{t('table.sr')}</th>
              <th>{t('table.shape')}</th>
              <th>{t('table.alloy')}</th>
              <th>{t('table.pieces')}</th>
              <th>{t('table.dimensions')}</th>
              <th className="text-right">{t('table.resultKg')}</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-cell">{t('receipt.noItems')}</td>
              </tr>
            ) : (
              items.map((item, index) => (
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
                  <td className="text-right">{formatNumber(item.calculation?.weightKg)}</td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="5">{t('receipt.total')}</td>
              <td className="text-right">{formatNumber(totals.totalWeightKg)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
});

export default ReceiptPreview;
