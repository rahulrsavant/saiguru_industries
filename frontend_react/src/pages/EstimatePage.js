import { useEffect, useMemo, useState } from 'react';
import Calculator from '../components/Calculator';
import ReceiptPreview from '../components/ReceiptPreview';
import ViewEstimateItemModal from '../components/ViewEstimateItemModal';
import {
  createNewEstimateSession,
  getSettings,
  loadCurrentEstimateSession,
  persistCurrentEstimateSession,
  upsertHistoryEntry,
} from '../utils/estimateStorage';

const buildEmptySession = () => loadCurrentEstimateSession() || createNewEstimateSession();

const formatIndiaDateTime = (isoString) => {
  if (!isoString) return 'n/a';
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const calculateTotals = (items) => {
  const totals = items.reduce(
    (accumulator, item) => {
      const weight = Number(item.calculation?.weightKg);
      if (Number.isFinite(weight)) {
        accumulator.totalWeightKg += weight;
      }
      return accumulator;
    },
    { totalWeightKg: 0 }
  );
  return totals;
};

const normalizeDimensions = (dimensions) => {
  if (!dimensions) return '';
  const entries = Object.entries(dimensions)
    .map(([key, value]) => ({
      key,
      value: Number(value?.value),
      unit: value?.unit || '',
    }))
    .sort((a, b) => a.key.localeCompare(b.key));
  return JSON.stringify(entries);
};

const EstimatePage = () => {
  const [session, setSession] = useState(buildEmptySession);
  const [customerErrors, setCustomerErrors] = useState({});
  const [settings, setSettings] = useState(getSettings());
  const [viewingItem, setViewingItem] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);

  useEffect(() => {
    persistCurrentEstimateSession(session);
  }, [session]);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  const validateCustomer = () => {
    const errors = {};
    if (!session.customer.name.trim()) {
      errors.name = 'Customer name is required.';
    }

    const rawMobile = session.customer.mobile.trim();
    if (!rawMobile) {
      errors.mobile = 'Mobile number is required.';
    } else {
      const cleaned = rawMobile.replace(/\s+/g, '');
      const normalized = cleaned.startsWith('+91') ? cleaned.slice(3) : cleaned;
      if (!/^\d{10}$/.test(normalized)) {
        errors.mobile = 'Enter a valid 10-digit mobile number.';
      }
    }

    if (session.customer.email.trim()) {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(session.customer.email.trim());
      if (!emailOk) {
        errors.email = 'Enter a valid email address.';
      }
    }

    setCustomerErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const updateCustomerField = (key, value) => {
    setSession((prev) => ({
      ...prev,
      customer: {
        ...prev.customer,
        [key]: value,
      },
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleAddLineItem = (lineItem) => {
    setSession((prev) => {
      if (editingItemId) {
        const index = prev.items.findIndex((item) => item.lineId === editingItemId);
        if (index >= 0) {
          const existingItem = prev.items[index];
          const updatedItem = {
            ...lineItem,
            lineId: existingItem.lineId,
            createdAt: existingItem.createdAt,
          };
          const items = prev.items.map((item, itemIndex) =>
            itemIndex === index ? updatedItem : item
          );
          const totals = calculateTotals(items);
          const nextSession = {
            ...prev,
            items,
            totals,
            updatedAt: new Date().toISOString(),
          };
          upsertHistoryEntry(nextSession);
          return nextSession;
        }
      }

      const incomingSignature = [
        lineItem.shape?.id,
        lineItem.alloy?.id,
        lineItem.mode,
        normalizeDimensions(lineItem.dimensions),
      ].join('|');
      const existingIndex = prev.items.findIndex((item) => {
        const signature = [
          item.shape?.id,
          item.alloy?.id,
          item.mode,
          normalizeDimensions(item.dimensions),
        ].join('|');
        return signature === incomingSignature;
      });

      if (existingIndex >= 0) {
        const shouldMerge = window.confirm(
          'This item is already added. Do you want to add the quantity to the existing line?'
        );
        if (!shouldMerge) {
          return prev;
        }
        const existingItem = prev.items[existingIndex];
        const mergedPieces = Number(existingItem.pieces) + Number(lineItem.pieces);
        const mergedItem = {
          ...existingItem,
          pieces: Number.isFinite(mergedPieces) ? mergedPieces : existingItem.pieces,
          calculation: {
            ...existingItem.calculation,
            weightKg: Number.isFinite(existingItem.calculation?.weightKg) &&
              Number.isFinite(lineItem.calculation?.weightKg)
              ? existingItem.calculation.weightKg + lineItem.calculation.weightKg
              : existingItem.calculation?.weightKg ?? lineItem.calculation?.weightKg,
            quantity: Number.isFinite(existingItem.calculation?.quantity) &&
              Number.isFinite(lineItem.calculation?.quantity)
              ? existingItem.calculation.quantity + lineItem.calculation.quantity
              : existingItem.calculation?.quantity ?? lineItem.calculation?.quantity,
            volumeM3: Number.isFinite(existingItem.calculation?.volumeM3) &&
              Number.isFinite(lineItem.calculation?.volumeM3)
              ? existingItem.calculation.volumeM3 + lineItem.calculation.volumeM3
              : existingItem.calculation?.volumeM3 ?? lineItem.calculation?.volumeM3,
          },
        };
        const items = prev.items.map((item, index) =>
          index === existingIndex ? mergedItem : item
        );
        const totals = calculateTotals(items);
        const nextSession = {
          ...prev,
          items,
          totals,
          updatedAt: new Date().toISOString(),
        };
        upsertHistoryEntry(nextSession);
        return nextSession;
      }

      const items = [...prev.items, lineItem];
      const totals = calculateTotals(items);
      const nextSession = {
        ...prev,
        items,
        totals,
        updatedAt: new Date().toISOString(),
      };
      upsertHistoryEntry(nextSession);
      return nextSession;
    });
    if (editingItemId) {
      setEditingItemId(null);
    }
  };

  const handleRemoveLineItem = (lineId) => {
    setSession((prev) => {
      const items = prev.items.filter((item) => item.lineId !== lineId);
      const totals = calculateTotals(items);
      const nextSession = {
        ...prev,
        items,
        totals,
        updatedAt: new Date().toISOString(),
      };
      if (items.length > 0) {
        upsertHistoryEntry(nextSession);
      }
      return nextSession;
    });
  };

  const items = session.items || [];
  const totals = session.totals || calculateTotals(items);
  const isCustomerMissing = !session.customer.name.trim() || !session.customer.mobile.trim();
  const canPrint = items.length > 0;
  const handlePrint = () => {
    if (!canPrint) return;
    const originalTitle = document.title;
    const nextTitle = `estimate_${session.estimateNo || 'receipt'}`;
    const restoreTitle = () => {
      document.title = originalTitle;
      window.removeEventListener('afterprint', restoreTitle);
    };
    document.title = nextTitle;
    window.addEventListener('afterprint', restoreTitle);
    window.print();
  };

  const handleViewItem = (item) => {
    setViewingItem(item);
    if (editingItemId) {
      setEditingItemId(null);
    }
  };

  const handleEditItem = (item) => {
    setEditingItemId(item.lineId);
    setViewingItem(null);
  };

  const closeView = () => setViewingItem(null);

  const editingItem = editingItemId ? items.find((item) => item.lineId === editingItemId) : null;

  const tableRows = useMemo(
    () =>
      items.map((item, index) => ({
        ...item,
        rowIndex: index + 1,
      })),
    [items]
  );

  return (
    <main className="page page-estimate">
      <section className="estimate-header">
        <div>
          <p className="eyebrow">Estimate</p>
          <h1>{session.estimateNo}</h1>
          <p className="subtext">Created {formatIndiaDateTime(session.createdAt)}</p>
        </div>
        <div className="estimate-meta">
          <div>
            <span>Unit system</span>
            <strong>{settings.unitSystem}</strong>
          </div>
          <div>
            <span>Items</span>
            <strong>{items.length}</strong>
          </div>
          <div>
            <span>Total weight</span>
            <strong>{totals.totalWeightKg.toFixed(3)} kg</strong>
          </div>
        </div>
      </section>

      <section className="customer-section">
        <div className="section-title">
          <h2>Customer details</h2>
          <p>Required fields help keep estimates searchable.</p>
        </div>
        <div className="field-row">
          <label>
            Customer Name
            <input
              type="text"
              value={session.customer.name}
              onChange={(event) => updateCustomerField('name', event.target.value)}
            />
            {customerErrors.name ? <span className="field-error">{customerErrors.name}</span> : null}
          </label>
          <label>
            Business Name
            <input
              type="text"
              value={session.customer.businessName}
              onChange={(event) => updateCustomerField('businessName', event.target.value)}
            />
          </label>
          <label>
            Mobile No
            <input
              type="tel"
              value={session.customer.mobile}
              onChange={(event) => updateCustomerField('mobile', event.target.value)}
            />
            {customerErrors.mobile ? <span className="field-error">{customerErrors.mobile}</span> : null}
          </label>
          <label>
            Email
            <input
              type="email"
              value={session.customer.email}
              onChange={(event) => updateCustomerField('email', event.target.value)}
            />
            {customerErrors.email ? <span className="field-error">{customerErrors.email}</span> : null}
          </label>
        </div>
      </section>

      <Calculator
        estimateNo={session.estimateNo}
        settings={settings}
        onAddLineItem={handleAddLineItem}
        validateCustomer={validateCustomer}
        prefillItem={editingItem}
      />

      <section className="estimate-items">
        <div className="section-title">
          <h2>Estimate items</h2>
          <p>Each item is saved to history when added.</p>
        </div>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-cell">
                    No items yet. Use Add to Estimate to capture the calculation.
                  </td>
                </tr>
              ) : (
                tableRows.map((item) => (
                  <tr key={item.lineId}>
                    <td>{item.rowIndex}</td>
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
                    <td>
                      <div className="action-buttons">
                        <button
                          type="button"
                          className="icon-button"
                          title="View"
                          aria-label="View"
                          onClick={() => handleViewItem(item)}
                        >
                          👁
                        </button>
                        <button
                          type="button"
                          className="icon-button"
                          title="Edit"
                          aria-label="Edit"
                          onClick={() => handleEditItem(item)}
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          className="icon-button danger"
                          title="Remove"
                          aria-label="Remove"
                          onClick={() => handleRemoveLineItem(item.lineId)}
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {tableRows.length ? (
              <tfoot>
                <tr>
                  <td colSpan="5">Totals</td>
                  <td>{totals.totalWeightKg.toFixed(3)}</td>
                  <td />
                </tr>
              </tfoot>
            ) : null}
          </table>
        </div>
      </section>

      <ViewEstimateItemModal
        item={viewingItem}
        onClose={closeView}
        onEdit={viewingItem ? () => handleEditItem(viewingItem) : null}
      />

      <section className="receipt-section">
        <div className="receipt-title-row no-print">
          <div>
            <h2>Receipt Preview</h2>
            <p className="subtext">This is how your PDF will look when printed.</p>
          </div>
          <div className="receipt-actions no-print">
            <button type="button" className="primary" onClick={handlePrint} disabled={!canPrint}>
              Print Receipt (PDF)
            </button>
            {!canPrint ? (
              <span className="helper-text">Add items to estimate to print receipt.</span>
            ) : null}
            {isCustomerMissing ? (
              <span className="helper-text warn">
                Customer name and mobile are recommended for printing.
              </span>
            ) : null}
          </div>
        </div>
        <div className="receipt-preview-wrapper">
          <ReceiptPreview session={session} />
        </div>
      </section>
    </main>
  );
};

export default EstimatePage;
