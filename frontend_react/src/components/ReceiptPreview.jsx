import { forwardRef } from 'react';

const formatIndiaDateTime = (isoString) => {
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
  const items = session?.items || [];
  const totals = session?.totals || { totalWeightKg: 0 };
  const createdAt = session?.updatedAt || session?.createdAt;

  return (
    <div className="receipt-preview" ref={ref}>
      <div className="receipt-page" id="pdf-content">
        <header className="receipt-header">
          <div>
            <h2>Estimate Receipt</h2>
            <p className="receipt-sub">Saiguru Industries</p>
          </div>
          <div className="receipt-meta">
            <span>Estimate No</span>
            <strong>{session?.estimateNo || '—'}</strong>
            <span>Date</span>
            <strong>{formatIndiaDateTime(createdAt) || '—'}</strong>
          </div>
        </header>

        <section className="receipt-customer">
          <div>
            <span>Customer Name</span>
            <strong>{session?.customer?.name || '—'}</strong>
          </div>
          <div>
            <span>Business Name</span>
            <strong>{session?.customer?.businessName || '—'}</strong>
          </div>
          <div>
            <span>Mobile No</span>
            <strong>{session?.customer?.mobile || '—'}</strong>
          </div>
          <div>
            <span>Email</span>
            <strong>{session?.customer?.email || '—'}</strong>
          </div>
        </section>

        <table className="receipt-table">
          <thead>
            <tr>
              <th>Sr</th>
              <th>Shape</th>
              <th>Alloy</th>
              <th>Pieces</th>
              <th>Dimensions</th>
              <th className="text-right">Result (kg)</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-cell">No items added.</td>
              </tr>
            ) : (
              items.map((item, index) => (
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
                  <td>{item.dimensionsSummary || 'n/a'}</td>
                  <td className="text-right">{formatNumber(item.calculation?.weightKg)}</td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="5">Total</td>
              <td className="text-right">{formatNumber(totals.totalWeightKg)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
});

export default ReceiptPreview;
