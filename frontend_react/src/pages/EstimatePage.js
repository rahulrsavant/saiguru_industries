import { useEffect, useMemo, useState } from 'react';
import Calculator from '../components/Calculator';
import DataSeeder from '../components/DataSeeder';
import ReceiptPreview from '../components/ReceiptPreview';
import ViewEstimateItemModal from '../components/ViewEstimateItemModal';
import useGlossaryTranslation from '../i18n/useGlossaryTranslation';
import { formatDimensionsSummary, translateShapeLabel } from '../i18n/catalog';
import { useAuth } from '../context/AuthContext';
import {
  createNewEstimateSession,
  getSettings,
  loadCurrentEstimateSession,
  persistCurrentEstimateSession,
  upsertHistoryEntry,
} from '../utils/estimateStorage';

const buildEmptySession = () => loadCurrentEstimateSession() || createNewEstimateSession();

const formatIndiaDateTime = (isoString, t) => {
  if (!isoString) return t('general.na');
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
  const { t, i18n } = useGlossaryTranslation();
  const { user } = useAuth();
  const [session, setSession] = useState(buildEmptySession);
  const [customerErrors, setCustomerErrors] = useState({});
  const [settings, setSettings] = useState(getSettings());
  const [viewingItem, setViewingItem] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);
  const [catalogRefreshToken, setCatalogRefreshToken] = useState(0);

  useEffect(() => {
    persistCurrentEstimateSession(session);
  }, [session]);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  const validateCustomer = () => {
    const errors = {};
    if (!session.customer.name.trim()) {
      errors.name = 'validation.customerNameRequired';
    }

    const rawMobile = session.customer.mobile.trim();
    if (!rawMobile) {
      errors.mobile = 'validation.mobileRequired';
    } else {
      const cleaned = rawMobile.replace(/\s+/g, '');
      const normalized = cleaned.startsWith('+91') ? cleaned.slice(3) : cleaned;
      if (!/^\d{10}$/.test(normalized)) {
        errors.mobile = 'validation.mobileInvalid';
      }
    }

    if (session.customer.email.trim()) {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(session.customer.email.trim());
      if (!emailOk) {
        errors.email = 'validation.emailInvalid';
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
          t('validation.mergeDuplicate')
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
  const unitSystemLabel = settings.unitSystem === 'imperial' ? t('settings.imperial') : t('settings.metric');
  const isAdmin = user?.role === 'ADMIN';
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
          <p className="eyebrow">{t('estimate.eyebrow')}</p>
          <h1>{session.estimateNo}</h1>
          <p className="subtext">
            {t('estimate.created', { date: formatIndiaDateTime(session.createdAt, t) })}
          </p>
        </div>
        <div className="estimate-meta">
          <div>
            <span>{t('estimate.unitSystem')}</span>
            <strong>{unitSystemLabel}</strong>
          </div>
          <div>
            <span>{t('estimate.items')}</span>
            <strong>{items.length}</strong>
          </div>
          <div>
            <span>{t('estimate.totalWeight')}</span>
            <strong>{totals.totalWeightKg.toFixed(3)} kg</strong>
          </div>
        </div>
      </section>

      <section className="customer-section">
        <div className="section-title">
          <h2>{t('estimate.customerDetailsTitle')}</h2>
          <p>{t('estimate.customerDetailsSubtitle')}</p>
        </div>
        <div className="field-row">
          <label>
            {t('estimate.customerName')}
            <input
              type="text"
              value={session.customer.name}
              onChange={(event) => updateCustomerField('name', event.target.value)}
            />
            {customerErrors.name ? <span className="field-error">{t(customerErrors.name)}</span> : null}
          </label>
          <label>
            {t('estimate.businessName')}
            <input
              type="text"
              value={session.customer.businessName}
              onChange={(event) => updateCustomerField('businessName', event.target.value)}
            />
          </label>
          <label>
            {t('estimate.mobileNo')}
            <input
              type="tel"
              value={session.customer.mobile}
              onChange={(event) => updateCustomerField('mobile', event.target.value)}
            />
            {customerErrors.mobile ? <span className="field-error">{t(customerErrors.mobile)}</span> : null}
          </label>
          <label>
            {t('estimate.email')}
            <input
              type="email"
              value={session.customer.email}
              onChange={(event) => updateCustomerField('email', event.target.value)}
            />
            {customerErrors.email ? <span className="field-error">{t(customerErrors.email)}</span> : null}
          </label>
        </div>
      </section>

      {isAdmin ? (
        <DataSeeder
          onSeedComplete={() => setCatalogRefreshToken((prev) => prev + 1)}
          onEstimateLoaded={(nextSession) => {
            if (!nextSession) return;
            setSession(nextSession);
            persistCurrentEstimateSession(nextSession);
            upsertHistoryEntry(nextSession);
          }}
        />
      ) : null}

      <Calculator
        estimateNo={session.estimateNo}
        settings={settings}
        onAddLineItem={handleAddLineItem}
        validateCustomer={validateCustomer}
        prefillItem={editingItem}
        refreshToken={catalogRefreshToken}
      />

      <section className="estimate-items" id="estimate-items">
        <div className="section-title">
          <h2>{t('estimate.itemsTitle')}</h2>
          <p>{t('estimate.itemsSubtitle')}</p>
        </div>
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
                <th>{t('table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-cell">
                    {t('estimate.noItems')}
                  </td>
                </tr>
              ) : (
                tableRows.map((item) => (
                  <tr key={item.lineId}>
                    <td>{item.rowIndex}</td>
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
                    <td>
                      <div className="action-buttons">
                        <button
                          type="button"
                          className="icon-button"
                          title={t('estimate.actionView')}
                          aria-label={t('estimate.actionView')}
                          onClick={() => handleViewItem(item)}
                        >
                          👁
                        </button>
                        <button
                          type="button"
                          className="icon-button"
                          title={t('estimate.actionEdit')}
                          aria-label={t('estimate.actionEdit')}
                          onClick={() => handleEditItem(item)}
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          className="icon-button danger"
                          title={t('estimate.actionRemove')}
                          aria-label={t('estimate.actionRemove')}
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
                  <td colSpan="5">{t('estimate.totals')}</td>
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
            <h2>{t('estimate.receiptPreviewTitle')}</h2>
            <p className="subtext">{t('estimate.receiptPreviewSubtitle')}</p>
          </div>
          <div className="receipt-actions no-print">
            <button type="button" className="primary" onClick={handlePrint} disabled={!canPrint}>
              {t('estimate.printReceipt')}
            </button>
            {!canPrint ? (
              <span className="helper-text">{t('estimate.addItemsToPrint')}</span>
            ) : null}
            {isCustomerMissing ? (
              <span className="helper-text warn">
                {t('estimate.recommendCustomer')}
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
