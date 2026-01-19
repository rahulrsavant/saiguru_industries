import { useEffect, useMemo, useState } from 'react';
import './App.css';
import { ALLOY_OPTIONS, DEFAULT_ALLOY, DEFAULT_QUANTITY } from './data/metalCalculatorConfig';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
const MENU_ORDER = [
  'Pipe',
  'Angle',
  'Rebar',
  'Beam',
  'Channel',
  'Flat bar',
  'Sheet',
  'Square bar',
  'Round bar',
  'Bolt',
  'Screw',
  'Nut',
];

const parseNumber = (value) => {
  if (value === '' || value === null || value === undefined) return NaN;
  return Number.parseFloat(String(value).replace(',', '.'));
};

const buildDimensionState = (calculator) => {
  if (!calculator) return {};
  return calculator.fields.reduce((accumulator, field) => {
    accumulator[field.key] = { value: '', unit: field.defaultUnit || field.allowedUnits?.[0] || 'mm' };
    return accumulator;
  }, {});
};

const FieldInput = ({ field, value, unit, error, onValueChange, onUnitChange }) => (
  <label className={`dimension-field ${error ? 'has-error' : ''}`}>
    {field.label}
    <div className="input-unit">
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
      />
      <select value={unit} onChange={(event) => onUnitChange(event.target.value)}>
        {field.allowedUnits.map((allowedUnit) => (
          <option key={allowedUnit} value={allowedUnit}>
            {allowedUnit}
          </option>
        ))}
      </select>
    </div>
    {error ? <span className="field-error">{error}</span> : null}
  </label>
);

function App() {
  const [catalog, setCatalog] = useState(null);
  const [catalogError, setCatalogError] = useState('');
  const [alloy, setAlloy] = useState(DEFAULT_ALLOY);
  const [activeCalculatorId, setActiveCalculatorId] = useState('');
  const [activeMenuLabel, setActiveMenuLabel] = useState('');
  const [piecesOrQty, setPiecesOrQty] = useState(DEFAULT_QUANTITY);
  const [mode, setMode] = useState('QTY_TO_WEIGHT');
  const [dimensions, setDimensions] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debugEnabled, setDebugEnabled] = useState(false);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/catalog`);
        if (!response.ok) {
          throw new Error('Unable to load catalog.');
        }
        const data = await response.json();
        setCatalog(data);
      } catch (fetchError) {
        setCatalogError(fetchError.message || 'Unable to load catalog.');
      }
    };

    fetchCatalog();
  }, []);

  const menuItems = useMemo(() => {
    if (!catalog?.calculators) return [];
    const map = new Map();
    catalog.calculators.forEach((calculator) => {
      if (!map.has(calculator.menuLabel)) {
        map.set(calculator.menuLabel, {
          menuLabel: calculator.menuLabel,
          category: calculator.category,
          calculators: [],
        });
      }
      map.get(calculator.menuLabel).calculators.push(calculator);
    });

    const items = Array.from(map.values());
    items.forEach((item) => {
      item.calculators.sort((a, b) => (a.subtypeLabel || '').localeCompare(b.subtypeLabel || ''));
    });
    items.sort((a, b) => {
      const indexA = MENU_ORDER.indexOf(a.menuLabel);
      const indexB = MENU_ORDER.indexOf(b.menuLabel);
      const safeIndexA = indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA;
      const safeIndexB = indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB;
      return safeIndexA - safeIndexB;
    });
    return items;
  }, [catalog]);

  const activeCalculator = useMemo(() => {
    if (!catalog?.calculators) return null;
    return catalog.calculators.find((calculator) => calculator.id === activeCalculatorId) || null;
  }, [catalog, activeCalculatorId]);

  useEffect(() => {
    if (!menuItems.length) return;
    if (!activeCalculatorId) {
      const defaultMenu = menuItems[0];
      setActiveMenuLabel(defaultMenu.menuLabel);
      setActiveCalculatorId(defaultMenu.calculators[0].id);
    }
  }, [menuItems, activeCalculatorId]);

  useEffect(() => {
    setDimensions(buildDimensionState(activeCalculator));
    setFieldErrors({});
    setResult(null);
    setError('');
    if (activeCalculator?.category !== 'FASTENERS') {
      setMode('QTY_TO_WEIGHT');
    }
  }, [activeCalculator]);

  const updateDimensionValue = (key, value) => {
    setDimensions((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        value,
      },
    }));
  };

  const updateDimensionUnit = (key, unit) => {
    setDimensions((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        unit,
      },
    }));
  };

  const validateForm = () => {
    if (!activeCalculator) {
      return { message: 'Select a calculator.', fieldErrors: {} };
    }

    const nextFieldErrors = {};
    activeCalculator.fields.forEach((field) => {
      const entry = dimensions[field.key];
      if (!entry || entry.value === '') {
        if (field.required) {
          nextFieldErrors[field.key] = `${field.label} is required.`;
        }
        return;
      }
      const numericValue = parseNumber(entry.value);
      if (!Number.isFinite(numericValue) || numericValue <= 0) {
        nextFieldErrors[field.key] = `${field.label} must be a positive number.`;
        return;
      }
      if (field.minValue && numericValue < field.minValue) {
        nextFieldErrors[field.key] = `${field.label} must be at least ${field.minValue}.`;
      }
    });

    const qtyValue = parseNumber(piecesOrQty);
    if (!Number.isFinite(qtyValue) || qtyValue <= 0) {
      return { message: 'Quantity or weight must be greater than zero.', fieldErrors: nextFieldErrors };
    }

    if (mode === 'QTY_TO_WEIGHT' && !Number.isInteger(qtyValue)) {
      return { message: 'Quantity must be a positive integer.', fieldErrors: nextFieldErrors };
    }

    if (Object.keys(nextFieldErrors).length > 0) {
      return { message: 'Fix the highlighted fields.', fieldErrors: nextFieldErrors };
    }

    return { message: '', fieldErrors: {} };
  };

  const handleCalculate = async () => {
    const validation = validateForm();
    setFieldErrors(validation.fieldErrors);
    if (validation.message) {
      setError(validation.message);
      setResult(null);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        calculatorId: activeCalculator.id,
        materialId: alloy,
        piecesOrQty: parseNumber(piecesOrQty),
        mode,
        debug: debugEnabled,
        dimensions: activeCalculator.fields.map((field) => ({
          key: field.key,
          value: parseNumber(dimensions[field.key].value),
          unit: dimensions[field.key].unit,
        })),
      };

      const response = await fetch(`${API_BASE_URL}/api/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null);
        throw new Error(errorPayload?.message || 'Calculation failed.');
      }

      const data = await response.json();
      setResult(data);
    } catch (fetchError) {
      setResult(null);
      setError(fetchError.message || 'Unable to calculate weight.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setAlloy(DEFAULT_ALLOY);
    setPiecesOrQty(DEFAULT_QUANTITY);
    setDimensions(buildDimensionState(activeCalculator));
    setFieldErrors({});
    setResult(null);
    setError('');
  };

  const handleMenuSelect = (menuLabel) => {
    setActiveMenuLabel(menuLabel);
    const menu = menuItems.find((item) => item.menuLabel === menuLabel);
    if (menu) {
      setActiveCalculatorId(menu.calculators[0].id);
    }
  };

  const isFasteners = activeCalculator?.category === 'FASTENERS';
  const isWeightToQty = mode === 'WEIGHT_TO_QTY';

  if (catalogError) {
    return <div className="app"><div className="error-box">{catalogError}</div></div>;
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark" />
          <div>
            <div className="brand-name">SAIGURU INDUSTRIES</div>
            <div className="brand-sub">Metal products calculator</div>
          </div>
        </div>
        <nav className="topnav">
          <a href="#calculator">Metal Weight Calculator</a>
          <a href="#alloys">Alloys</a>
        </nav>
        <div className="topbar-right">
          <span className="lang">English</span>
          <button type="button" className="ghost">Get widget for your website</button>
        </div>
      </header>

      <main className="calculator" id="calculator">
        <section className="calculator-card">
          <div className="calculator-header">
            <h1>Metal Weight Calculator</h1>
            <p>Calculate weight using catalog-driven calculators with precise unit conversions.</p>
          </div>

          <div className="calculator-grid catalog-layout">
            <aside className="menu-panel">
              <div className="menu-title">Catalog</div>
              {menuItems.map((menu) => (
                <div key={menu.menuLabel} className="menu-group">
                  <button
                    type="button"
                    className={`menu-item ${activeMenuLabel === menu.menuLabel ? 'active' : ''}`}
                    onClick={() => handleMenuSelect(menu.menuLabel)}
                  >
                    {menu.menuLabel}
                  </button>
                  {activeMenuLabel === menu.menuLabel && menu.calculators.length > 1 ? (
                    <div className="submenu">
                      {menu.calculators.map((calculator) => (
                        <button
                          key={calculator.id}
                          type="button"
                          className={`submenu-item ${activeCalculatorId === calculator.id ? 'active' : ''}`}
                          onClick={() => setActiveCalculatorId(calculator.id)}
                        >
                          {calculator.subtypeLabel || calculator.menuLabel}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </aside>

            <div className="form-section">
              <div className="field-row">
                <label>
                  Alloy / Material
                  <select value={alloy} onChange={(event) => setAlloy(event.target.value)}>
                    {ALLOY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Calculator
                  <select
                    value={activeCalculatorId}
                    onChange={(event) => {
                      const nextId = event.target.value;
                      const nextCalculator = catalog?.calculators?.find((entry) => entry.id === nextId);
                      if (nextCalculator) {
                        setActiveMenuLabel(nextCalculator.menuLabel);
                      }
                      setActiveCalculatorId(nextId);
                    }}
                  >
                    {catalog?.calculators?.map((calculator) => (
                      <option key={calculator.id} value={calculator.id}>
                        {calculator.menuLabel} {calculator.subtypeLabel ? `- ${calculator.subtypeLabel}` : ''}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {isFasteners ? (
                <div className="mode-toggle">
                  <span>Mode</span>
                  <label>
                    <input
                      type="radio"
                      name="mode"
                      value="QTY_TO_WEIGHT"
                      checked={mode === 'QTY_TO_WEIGHT'}
                      onChange={() => setMode('QTY_TO_WEIGHT')}
                    />
                    Quantity → Weight
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="mode"
                      value="WEIGHT_TO_QTY"
                      checked={mode === 'WEIGHT_TO_QTY'}
                      onChange={() => setMode('WEIGHT_TO_QTY')}
                    />
                    Weight → Quantity
                  </label>
                </div>
              ) : null}

              <div className="field-row">
                <label>
                  {isWeightToQty ? 'Total Weight (kg)' : 'Quantity'}
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={piecesOrQty}
                    onChange={(event) => setPiecesOrQty(event.target.value)}
                  />
                </label>
              </div>

              <div className="dimension-section">
                <div className="dimension-title">Dimensions</div>
                {activeCalculator?.fields.map((field) => (
                  <FieldInput
                    key={field.key}
                    field={field}
                    value={dimensions[field.key]?.value ?? ''}
                    unit={dimensions[field.key]?.unit ?? field.defaultUnit}
                    error={fieldErrors[field.key]}
                    onValueChange={(value) => updateDimensionValue(field.key, value)}
                    onUnitChange={(unit) => updateDimensionUnit(field.key, unit)}
                  />
                ))}
              </div>

              {error ? <div className="error-box">{error}</div> : null}

              <label className="debug-toggle">
                <input
                  type="checkbox"
                  checked={debugEnabled}
                  onChange={(event) => setDebugEnabled(event.target.checked)}
                />
                Enable debug output
              </label>

              <div className="action-row">
                <button type="button" className="primary" onClick={handleCalculate} disabled={isSubmitting}>
                  {isSubmitting ? 'Calculating...' : 'Calculate'}
                </button>
                <button type="button" className="secondary" onClick={handleReset}>
                  Reset
                </button>
              </div>
            </div>

            <div className="result-section">
              <div className="result-card">
                <div className="result-label">{isWeightToQty ? 'Estimated Quantity' : 'Calculated Weight'}</div>
                <div className="result-value">
                  {isWeightToQty
                    ? `${result?.quantity ? result.quantity.toFixed(4) : '0.0000'} pcs`
                    : `${result?.weightKg ? result.weightKg.toFixed(4) : '0.0000'} kg`}
                </div>
                <div className="result-meta">
                  {activeCalculator
                    ? `Calculator: ${activeCalculator.menuLabel}`
                    : 'Select a calculator'}
                </div>
              </div>

              <div className="result-details">
                <div>
                  <span>Volume</span>
                  <strong>{result?.volumeM3 ? result.volumeM3.toFixed(4) : '0.0000'} m³</strong>
                </div>
                <div>
                  <span>{isWeightToQty ? 'Input Weight' : 'Quantity'}</span>
                  <strong>{piecesOrQty || DEFAULT_QUANTITY}</strong>
                </div>
              </div>

              <div className="result-note">
                Units are normalized to millimeters internally. Final values are rounded for display.
              </div>

              {debugEnabled && result ? (
                <div className="debug-section">
                  <div className="debug-title">Debug details</div>
                  <div className="debug-grid">
                    <div>
                      <span>Density (kg/m³)</span>
                      <strong>{result.densityKgM3 ?? 'N/A'}</strong>
                    </div>
                    <div>
                      <span>Raw Volume (m³)</span>
                      <strong>{result.volumeM3Raw ?? 'N/A'}</strong>
                    </div>
                    <div>
                      <span>Raw Weight (kg)</span>
                      <strong>{result.weightKgRaw ?? 'N/A'}</strong>
                    </div>
                    <div>
                      <span>Raw Quantity</span>
                      <strong>{result.quantityRaw ?? piecesOrQty}</strong>
                    </div>
                  </div>
                  <div className="debug-dims">
                    <div className="debug-title">Normalized Dimensions (mm)</div>
                    {result.normalizedDimensionsMm ? (
                      <ul>
                        {Object.entries(result.normalizedDimensionsMm).map(([key, value]) => (
                          <li key={key}>{`${key}: ${value}`}</li>
                        ))}
                      </ul>
                    ) : (
                      <div className="debug-empty">No normalized dimensions returned.</div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
