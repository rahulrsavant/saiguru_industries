import { useEffect, useMemo, useState } from 'react';
import { DEFAULT_QUANTITY } from '../data/metalCalculatorConfig';
import { currencyCode } from '../constants/currency';
import { formatCurrency } from '../utils/formatCurrency';
import { API_BASE_URL } from '../utils/apiConfig';
import { authFetch } from '../utils/authFetch';
import ShapeDiagramCard from './ShapeDiagramCard';

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

const DIAGRAM_KEY_BY_CALCULATOR_ID = {
  rolled_pipe_round: 'pipe_round',
  rolled_pipe_square: 'pipe_square',
  rolled_pipe_rectangular: 'pipe_rectangular',
  rolled_angle_equal: 'angle_equal',
  rolled_angle_unequal: 'angle_unequal',
  rolled_channel_c: 'channel_c',
  rolled_channel_u: 'channel_u',
  rolled_beam_i: 'beam_i',
  rolled_beam_t: 'beam_t',
  rolled_flat_bar: 'flat_bar',
  rolled_round_bar: 'round_bar',
  rolled_sheet: 'sheet',
  rolled_square_bar: 'square_bar',
  rolled_rebar: 'rebar',
  fastener_bolt_hex: 'bolt_hex',
  fastener_nut_hex: 'nut_hex',
  fastener_screw_machine: 'screw_machine',
};

const parseNumber = (value) => {
  if (value === '' || value === null || value === undefined) return NaN;
  return Number.parseFloat(String(value).replace(',', '.'));
};

const toMeters = (value, unit) => {
  switch (unit) {
    case 'mm':
      return value / 1000;
    case 'cm':
      return value / 100;
    case 'm':
      return value;
    case 'in':
      return value * 0.0254;
    case 'ft':
      return value * 0.3048;
    default:
      return NaN;
  }
};

const buildDimensionState = (calculator) => {
  if (!calculator) return {};
  return calculator.fields.reduce((accumulator, field) => {
    let unit = field.defaultUnit || field.allowedUnits?.[0] || 'mm';
    if (calculator.id === 'rolled_sheet' && field.key === 'length') {
      unit = 'm';
    }
    accumulator[field.key] = { value: '', unit };
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

const buildDimensionsSummary = (calculator, dimensions) => {
  if (!calculator?.fields) return 'n/a';
  const summary = calculator.fields
    .map((field) => {
      const entry = dimensions[field.key];
      if (!entry || entry.value === '') return null;
      return `${field.label}: ${entry.value} ${entry.unit}`;
    })
    .filter(Boolean)
    .join(', ');
  return summary || 'n/a';
};

const buildDimensionsPayload = (calculator, dimensions) => {
  if (!calculator?.fields) return {};
  return calculator.fields.reduce((accumulator, field) => {
    const entry = dimensions[field.key];
    if (entry?.value === '' || entry?.value == null) return accumulator;
    const numericValue = parseNumber(entry.value);
    if (!Number.isFinite(numericValue)) return accumulator;
    accumulator[field.key] = { value: numericValue, unit: entry.unit };
    return accumulator;
  }, {});
};

const Calculator = ({ estimateNo, settings, onAddLineItem, validateCustomer, prefillItem }) => {
  const [catalog, setCatalog] = useState(null);
  const [catalogError, setCatalogError] = useState('');
  const [densityCatalog, setDensityCatalog] = useState(null);
  const [densityError, setDensityError] = useState('');
  const [metal, setMetal] = useState('');
  const [alloy, setAlloy] = useState('');
  const [activeCalculatorId, setActiveCalculatorId] = useState('');
  const [activeMenuLabel, setActiveMenuLabel] = useState('');
  const [piecesOrQty, setPiecesOrQty] = useState(DEFAULT_QUANTITY);
  const [mode, setMode] = useState('QTY_TO_WEIGHT');
  const [dimensions, setDimensions] = useState({});
  const [sheetTotalWeightKg, setSheetTotalWeightKg] = useState('');
  const [pricePerMeter, setPricePerMeter] = useState('');
  const [pricePerTon, setPricePerTon] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debugEnabled, setDebugEnabled] = useState(false);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const response = await authFetch(`${API_BASE_URL}/api/catalog`);
        if (!response.ok) {
          throw new Error('Unable to load catalog.');
        }
        const data = await response.json();
        setCatalog(data);
      } catch (fetchError) {
        setCatalogError(fetchError.message || 'Unable to load catalog.');
      }
    };

    const fetchDensityCatalog = async () => {
      try {
        const response = await authFetch(`${API_BASE_URL}/api/density-catalog`);
        if (!response.ok) {
          throw new Error('Unable to load density catalog.');
        }
        const data = await response.json();
        setDensityCatalog(data);
        const defaultMetal = data?.metals?.[0];
        if (defaultMetal) {
          setMetal(defaultMetal.id);
          setAlloy(defaultMetal.alloys?.[0]?.id || '');
        }
      } catch (fetchError) {
        setDensityError(fetchError.message || 'Unable to load density catalog.');
      }
    };

    fetchCatalog();
    fetchDensityCatalog();
  }, []);

  useEffect(() => {
    if (!prefillItem || !catalog || !densityCatalog) return;
    const calculator = catalog.calculators?.find((entry) => entry.id === prefillItem.shape?.id);
    if (calculator) {
      setActiveCalculatorId(calculator.id);
      setActiveMenuLabel(calculator.menuLabel);
    }
    const metalIdFromItem = prefillItem.metal?.id;
    let nextMetalId = metalIdFromItem;
    if (!nextMetalId && densityCatalog?.metals) {
      const metalMatch = densityCatalog.metals.find((entry) =>
        entry.alloys?.some((alloyEntry) => alloyEntry.id === prefillItem.alloy?.id)
      );
      nextMetalId = metalMatch?.id || '';
    }
    if (nextMetalId) {
      setMetal(nextMetalId);
    }
    if (prefillItem.alloy?.id) {
      setAlloy(prefillItem.alloy.id);
    }
    if (prefillItem.mode) {
      setMode(prefillItem.mode);
    }
    if (prefillItem.pieces != null) {
      setPiecesOrQty(String(prefillItem.pieces));
    }
    const baseDimensions = buildDimensionState(calculator);
    const filledDimensions = { ...baseDimensions };
    Object.entries(prefillItem.dimensions || {}).forEach(([key, value]) => {
      if (!filledDimensions[key]) return;
      filledDimensions[key] = {
        ...filledDimensions[key],
        value: value?.value ?? '',
        unit: value?.unit || filledDimensions[key].unit,
      };
    });
    setDimensions(filledDimensions);
    setResult(null);
    setError('');
  }, [prefillItem, catalog, densityCatalog]);

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

  const metals = densityCatalog?.metals ?? [];
  const selectedMetal = useMemo(
    () => metals.find((entry) => entry.id === metal) || metals[0] || null,
    [metals, metal]
  );
  const alloys = selectedMetal?.alloys ?? [];
  const selectedAlloy = useMemo(
    () => alloys.find((entry) => entry.id === alloy) || alloys[0] || null,
    [alloys, alloy]
  );
  const densityGcm3 = selectedAlloy?.density ?? null;

  useEffect(() => {
    if (!selectedMetal) return;
    const isAlloyValid = selectedMetal.alloys?.some((entry) => entry.id === alloy);
    if (!isAlloyValid) {
      setAlloy(selectedMetal.alloys?.[0]?.id || '');
    }
  }, [selectedMetal, alloy]);

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

  const handleMetalChange = (nextMetalId) => {
    setMetal(nextMetalId);
    const nextMetal = metals.find((entry) => entry.id === nextMetalId);
    setAlloy(nextMetal?.alloys?.[0]?.id || '');
    setError('');
  };

  const handleAlloyChange = (nextAlloyId) => {
    setAlloy(nextAlloyId);
    setError('');
  };

  const validateForm = () => {
    if (!activeCalculator) {
      return { message: 'Select a calculator.', fieldErrors: {} };
    }

    const nextFieldErrors = {};
    if (!metal || !alloy) {
      return { message: 'Select a metal and alloy.', fieldErrors: nextFieldErrors };
    }
    if (!Number.isFinite(densityGcm3) || densityGcm3 <= 0) {
      return { message: 'Select a metal and alloy with a valid density.', fieldErrors: nextFieldErrors };
    }

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

  const performCalculation = async () => {
    const validation = validateForm();
    setFieldErrors(validation.fieldErrors);
    if (validation.message) {
      setError(validation.message);
      setResult(null);
      return null;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        calculatorId: activeCalculator.id,
        metal,
        alloy,
        piecesOrQty: parseNumber(piecesOrQty),
        mode,
        debug: debugEnabled,
        dimensions: activeCalculator.fields.map((field) => ({
          key: field.key,
          value: parseNumber(dimensions[field.key].value),
          unit: dimensions[field.key].unit,
        })),
      };

      const response = await authFetch(`${API_BASE_URL}/api/calculate`, {
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
      return data;
    } catch (fetchError) {
      setResult(null);
      setError(fetchError.message || 'Unable to calculate weight.');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCalculate = async () => {
    await performCalculation();
  };

  const handleReset = () => {
    const defaultMetal = densityCatalog?.metals?.[0];
    setMetal(defaultMetal?.id || '');
    setAlloy(defaultMetal?.alloys?.[0]?.id || '');
    setPiecesOrQty(DEFAULT_QUANTITY);
    setDimensions(buildDimensionState(activeCalculator));
    setSheetTotalWeightKg('');
    setPricePerMeter('');
    setPricePerTon('');
    setFieldErrors({});
    setResult(null);
    setError('');
  };

  useEffect(() => {
    const hasDimensions = Object.values(dimensions).some((entry) => entry?.value !== '' && entry?.value != null);
    const hasInput = hasDimensions || parseNumber(piecesOrQty) > 0;
    if (!hasInput) return;
    const validation = validateForm();
    setFieldErrors(validation.fieldErrors);
    if (validation.message) {
      setError(validation.message);
      setResult(null);
      return;
    }
    performCalculation();
  }, [metal, alloy]);

  const handleMenuSelect = (menuLabel) => {
    setActiveMenuLabel(menuLabel);
    const menu = menuItems.find((item) => item.menuLabel === menuLabel);
    if (menu) {
      setActiveCalculatorId(menu.calculators[0].id);
    }
  };

  const isFasteners = activeCalculator?.category === 'FASTENERS';
  const isWeightToQty = mode === 'WEIGHT_TO_QTY';
  const isSheet = activeCalculator?.id === 'rolled_sheet';
  const shapeDiagramKey = useMemo(() => {
    if (!activeCalculator) return 'unknown';
    return DIAGRAM_KEY_BY_CALCULATOR_ID[activeCalculator.id] || 'unknown';
  }, [activeCalculator]);
  const visibleFields = useMemo(() => {
    if (!activeCalculator?.fields) return [];
    if (!isSheet) return activeCalculator.fields;
    return activeCalculator.fields.filter((field) => field.key !== 'length');
  }, [activeCalculator, isSheet]);

  const sheetMetrics = useMemo(() => {
    if (!isSheet) return null;
    const widthEntry = dimensions.width;
    const thicknessEntry = dimensions.thickness;
    if (!widthEntry || !thicknessEntry) return null;
    const width = parseNumber(widthEntry.value);
    const thickness = parseNumber(thicknessEntry.value);
    const densityGcm3Value = Number.isFinite(densityGcm3) ? densityGcm3 : NaN;
    const densityKgM3 = Number.isFinite(densityGcm3Value) ? densityGcm3Value * 1000 : NaN;
    if (!Number.isFinite(width) || !Number.isFinite(thickness) || !Number.isFinite(densityKgM3)) return null;
    const widthM = toMeters(width, widthEntry.unit);
    const thicknessM = toMeters(thickness, thicknessEntry.unit);
    if (!Number.isFinite(widthM) || !Number.isFinite(thicknessM) || widthM <= 0 || thicknessM <= 0 || densityKgM3 <= 0) {
      return null;
    }
    const weightPerMeter = densityKgM3 * widthM * thicknessM;
    const lengthEntry = dimensions.length;
    const lengthValue = lengthEntry ? parseNumber(lengthEntry.value) : NaN;
    const lengthM = Number.isFinite(lengthValue) ? toMeters(lengthValue, lengthEntry.unit) : NaN;
    const totalWeightForLength = Number.isFinite(lengthM) ? lengthM * weightPerMeter : NaN;
    const totalWeightInput = parseNumber(sheetTotalWeightKg);
    const totalLengthForWeight = Number.isFinite(totalWeightInput) ? totalWeightInput / weightPerMeter : NaN;
    const pricePerMeterValue = parseNumber(pricePerMeter);
    const pricePerTonValue = parseNumber(pricePerTon);
    const lengthPerTon = 1000 / weightPerMeter;
    const costPerTonFromPricePerMeter = Number.isFinite(pricePerMeterValue)
      ? pricePerMeterValue * lengthPerTon
      : NaN;
    const pricePerMeterFromTonPrice = Number.isFinite(pricePerTonValue)
      ? pricePerTonValue / lengthPerTon
      : NaN;
    return {
      weightPerMeter,
      totalWeightForLength,
      totalLengthForWeight,
      costPerTonFromPricePerMeter,
      pricePerMeterFromTonPrice,
    };
  }, [densityGcm3, dimensions, isSheet, pricePerMeter, pricePerTon, sheetTotalWeightKg]);

  const formatMetric = (value, digits = 3) => (Number.isFinite(value) ? value.toFixed(digits) : 'n/a');

  const handleAddToEstimate = async () => {
    if (isSubmitting) return;
    const customerOk = validateCustomer ? validateCustomer() : true;
    if (!customerOk) {
      setError('Customer details are required before adding items.');
      return;
    }
    const calculation = await performCalculation();
    if (!calculation || !activeCalculator) return;

    const lineItem = {
      lineId: `line_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      estimateNo,
      metal: {
        id: selectedMetal?.id || '',
        label: selectedMetal?.label || '',
      },
      alloy: {
        id: selectedAlloy?.id || '',
        label: selectedAlloy?.label || '',
      },
      shape: {
        id: activeCalculator.id,
        label: activeCalculator.subtypeLabel
          ? `${activeCalculator.menuLabel} - ${activeCalculator.subtypeLabel}`
          : activeCalculator.menuLabel,
      },
      pieces: parseNumber(piecesOrQty),
      mode,
      unitSystem: settings?.unitSystem || 'metric',
      dimensions: buildDimensionsPayload(activeCalculator, dimensions),
      dimensionsSummary: buildDimensionsSummary(activeCalculator, dimensions),
      calculation: {
        weightKg: calculation.weightKg ?? null,
        quantity: calculation.quantity ?? null,
        unitWeightKg: calculation.unitWeightKg ?? null,
        volumeM3: calculation.volumeM3 ?? null,
      },
      densityGcm3: densityGcm3 ?? null,
      createdAt: new Date().toISOString(),
    };

    if (onAddLineItem) {
      onAddLineItem(lineItem);
    }
  };

  if (catalogError || densityError) {
    return (
      <section className="calculator">
        <div className="error-box">{catalogError || densityError}</div>
      </section>
    );
  }

  return (
    <section className="calculator" id="calculator">
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
                Metal
                <select value={metal} onChange={(event) => handleMetalChange(event.target.value)}>
                  {metals.map((entry) => (
                    <option key={entry.id} value={entry.id}>
                      {entry.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Alloy
                <select value={alloy} onChange={(event) => handleAlloyChange(event.target.value)}>
                  {alloys.map((entry) => (
                    <option key={entry.id} value={entry.id}>
                      {entry.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Density (g/cm3)
                <input type="text" value={densityGcm3 ?? ''} readOnly />
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
                  Quantity to Weight
                </label>
                <label>
                  <input
                    type="radio"
                    name="mode"
                    value="WEIGHT_TO_QTY"
                    checked={mode === 'WEIGHT_TO_QTY'}
                    onChange={() => setMode('WEIGHT_TO_QTY')}
                  />
                  Weight to Quantity
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
              {visibleFields.map((field) => (
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

            {isSheet ? (
              <div className="sheet-pricing">
                <div className="dimension-title">Pricing</div>
                <div className="field-row">
                  <label>
                    Length (m)
                    <div className="input-unit">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={dimensions.length?.value ?? ''}
                        onChange={(event) => updateDimensionValue('length', event.target.value)}
                      />
                      <span className="unit-label">m</span>
                    </div>
                  </label>
                  <label>
                    Total weight (kg)
                    <input
                      type="text"
                      inputMode="decimal"
                      value={sheetTotalWeightKg}
                      onChange={(event) => setSheetTotalWeightKg(event.target.value)}
                    />
                  </label>
                </div>
                <div className="field-row">
                  <label>
                    Price per 1 meter ({currencyCode})
                    <input
                      type="text"
                      inputMode="decimal"
                      value={pricePerMeter}
                      onChange={(event) => setPricePerMeter(event.target.value)}
                    />
                  </label>
                  <label>
                    Price per ton ({currencyCode})
                    <input
                      type="text"
                      inputMode="decimal"
                      value={pricePerTon}
                      onChange={(event) => setPricePerTon(event.target.value)}
                    />
                  </label>
                </div>
              </div>
            ) : null}

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
              <button
                type="button"
                className="secondary"
                onClick={handleAddToEstimate}
                disabled={isSubmitting}
              >
                Add to Estimate
              </button>
            </div>
          </div>

          <div className="result-section">
            <ShapeDiagramCard shapeKey={shapeDiagramKey} />
            <div className="result-card">
              <div className="result-label">{isWeightToQty ? 'Estimated Quantity' : 'Calculated Weight'}</div>
              <div className="result-value">
                {isWeightToQty
                  ? `${result?.quantity ? result.quantity.toFixed(4) : '0.0000'} pcs`
                  : `${result?.weightKg ? result.weightKg.toFixed(4) : '0.0000'} kg`}
              </div>
              <div className="result-meta">
                {activeCalculator ? `Calculator: ${activeCalculator.menuLabel}` : 'Select a calculator'}
              </div>
            </div>

            <div className="result-details">
              <div>
                <span>Volume</span>
                <strong>{result?.volumeM3 ? result.volumeM3.toFixed(4) : '0.0000'} m3</strong>
              </div>
              <div>
                <span>Unit weight</span>
                <strong>{result?.unitWeightKg ? result.unitWeightKg.toFixed(4) : '0.0000'} kg</strong>
              </div>
              <div>
                <span>{isWeightToQty ? 'Input Weight' : 'Quantity'}</span>
                <strong>{piecesOrQty || DEFAULT_QUANTITY}</strong>
              </div>
            </div>

            {isSheet ? (
              <div className="sheet-metrics">
                <div>
                  <span>Weight of 1 meter</span>
                  <strong>{`${formatMetric(sheetMetrics?.weightPerMeter, 3)} kg`}</strong>
                </div>
                <div>
                  <span>{`Cost of a ton at a price of ${formatCurrency(pricePerMeter)} per meter`}</span>
                  <strong>{formatCurrency(sheetMetrics?.costPerTonFromPricePerMeter)}</strong>
                </div>
                <div>
                  <span>{`Price per meter of sheet at the cost of a ton ${formatCurrency(pricePerTon)}`}</span>
                  <strong>{formatCurrency(sheetMetrics?.pricePerMeterFromTonPrice)}</strong>
                </div>
                <div>
                  <span>{`Total weight of ${dimensions.length?.value || '__'} meters of sheet, kg`}</span>
                  <strong>{formatMetric(sheetMetrics?.totalWeightForLength, 3)}</strong>
                </div>
                <div>
                  <span>{`Total length of ${sheetTotalWeightKg || '__'} kilograms of sheet, m`}</span>
                  <strong>{formatMetric(sheetMetrics?.totalLengthForWeight, 2)}</strong>
                </div>
              </div>
            ) : null}

            <div className="result-note">
              Units are normalized to centimeters internally. Final values are rounded for display.
            </div>

            {debugEnabled && result ? (
              <div className="debug-section">
                <div className="debug-title">Debug details</div>
                <div className="debug-grid">
                  <div>
                    <span>Density (g/cm3)</span>
                    <strong>{result.densityGPerCm3 ?? 'N/A'}</strong>
                  </div>
                  <div>
                    <span>Unit Weight (kg)</span>
                    <strong>{result.unitWeightKg ?? 'N/A'}</strong>
                  </div>
                  <div>
                    <span>Raw Volume (m3)</span>
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
    </section>
  );
};

export default Calculator;
