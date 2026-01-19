import { useEffect, useMemo, useState } from 'react';
import './App.css';
import {
  ALLOY_OPTIONS,
  DEFAULT_ALLOY,
  DEFAULT_PIECES,
  DEFAULT_SHAPE,
  SHAPE_OPTIONS,
  UNIT_OPTIONS,
} from './data/metalCalculatorConfig';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const parseNumber = (value) => {
  if (value === '' || value === null || value === undefined) return NaN;
  return Number.parseFloat(String(value).replace(',', '.'));
};

const buildDimensionState = (shapeValue) => {
  const shape = SHAPE_OPTIONS.find((option) => option.value === shapeValue);
  if (!shape) return {};
  return shape.fields.reduce((accumulator, field) => {
    accumulator[field.key] = { value: '', unit: field.defaultUnit };
    return accumulator;
  }, {});
};

function App() {
  const [alloy, setAlloy] = useState(DEFAULT_ALLOY);
  const [shape, setShape] = useState(DEFAULT_SHAPE);
  const [pieces, setPieces] = useState(DEFAULT_PIECES);
  const [dimensions, setDimensions] = useState(() => buildDimensionState(DEFAULT_SHAPE));
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeShape = useMemo(
    () => SHAPE_OPTIONS.find((option) => option.value === shape),
    [shape]
  );

  useEffect(() => {
    setDimensions(buildDimensionState(shape));
    setResult(null);
    setError('');
  }, [shape]);

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
    if (!Number.isInteger(Number(pieces)) || Number(pieces) < 1) {
      return 'Number of pieces must be a positive integer.';
    }

    if (!activeShape) {
      return 'Select a valid shape.';
    }

    for (const field of activeShape.fields) {
      const entry = dimensions[field.key];
      if (!entry) {
        return `${field.label} is required.`;
      }
      const numericValue = parseNumber(entry.value);
      if (!Number.isFinite(numericValue) || numericValue <= 0) {
        return `${field.label} must be a positive number.`;
      }
    }

    return '';
  };

  const handleCalculate = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setResult(null);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        alloy,
        shape,
        pieces: Number(pieces),
        dimensions: activeShape.fields.map((field) => ({
          key: field.key,
          value: parseNumber(dimensions[field.key].value),
          unit: dimensions[field.key].unit,
        })),
      };

      const response = await fetch(`${API_BASE_URL}/api/weight/calculate`, {
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
    setShape(DEFAULT_SHAPE);
    setPieces(DEFAULT_PIECES);
    setDimensions(buildDimensionState(DEFAULT_SHAPE));
    setResult(null);
    setError('');
  };

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
            <p>Calculate weight in pounds for common metal shapes with unit-by-unit conversions.</p>
          </div>

          <div className="calculator-grid">
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
                  Shape
                  <select value={shape} onChange={(event) => setShape(event.target.value)}>
                    {SHAPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="field-row">
                <label>
                  Number of Pieces
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={pieces}
                    onChange={(event) => setPieces(event.target.value)}
                  />
                </label>
              </div>

              <div className="dimension-section">
                <div className="dimension-title">Dimensions</div>
                {activeShape?.fields.map((field) => (
                  <label key={field.key} className="dimension-field">
                    {field.label}
                    <div className="input-unit">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={dimensions[field.key]?.value ?? ''}
                        onChange={(event) => updateDimensionValue(field.key, event.target.value)}
                      />
                      <select
                        value={dimensions[field.key]?.unit ?? field.defaultUnit}
                        onChange={(event) => updateDimensionUnit(field.key, event.target.value)}
                      >
                        {UNIT_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </label>
                ))}
              </div>

              {error ? <div className="error-box">{error}</div> : null}

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
                <div className="result-label">Calculated Weight</div>
                <div className="result-value">
                  {result?.weightLbs ? result.weightLbs.toFixed(3) : '0.000'} lbs
                </div>
                <div className="result-meta">
                  {activeShape ? `Shape: ${activeShape.label}` : 'Select a shape'}
                </div>
              </div>

              <div className="result-details">
                <div>
                  <span>Volume</span>
                  <strong>{result?.volumeIn3 ? result.volumeIn3.toFixed(3) : '0.000'} in³</strong>
                </div>
                <div>
                  <span>Pieces</span>
                  <strong>{pieces || DEFAULT_PIECES}</strong>
                </div>
              </div>

              <div className="result-note">
                Units are converted to inches internally with high precision. Final values are rounded to 3 decimals.
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
