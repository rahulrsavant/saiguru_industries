import { useEffect, useMemo, useState } from 'react';
import { DEFAULT_QUANTITY } from '../data/metalCalculatorConfig';
import { currencyCode } from '../constants/currency';
import { formatCurrency } from '../utils/formatCurrency';
import { API_BASE_URL } from '../utils/apiConfig';
import { authFetch } from '../utils/authFetch';
import ShapeDiagramCard from './ShapeDiagramCard';
import useGlossaryTranslation from '../i18n/useGlossaryTranslation';
import {
  formatDimensionsSummary,
  translateFieldLabel,
  translateMenuLabel,
  translateSubtypeLabel,
} from '../i18n/catalog';

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

const FieldInput = ({ field, label, value, unit, errorText, onValueChange, onUnitChange }) => (
  <label className={`dimension-field ${errorText ? 'has-error' : ''}`}>
    {label}
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
    {errorText ? <span className="field-error">{errorText}</span> : null}
  </label>
);

const buildDimensionsSummary = (calculator, dimensions, t, lang) => {
  if (!calculator?.fields) return t('general.na');
  const orderKeys = calculator.fields.map((field) => field.key);
  return formatDimensionsSummary(dimensions, t, lang, t('general.na'), orderKeys);
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
  const { t, i18n } = useGlossaryTranslation();
  const [catalog, setCatalog] = useState(null);
  const [catalogErrorKey, setCatalogErrorKey] = useState('');
  const [densityCatalog, setDensityCatalog] = useState(null);
  const [densityErrorKey, setDensityErrorKey] = useState('');
  const [metal, setMetal] = useState('');
  const [alloy, setAlloy] = useState('');
  const [activeCalculatorId, setActiveCalculatorId] = useState('');
  const [catalogQuery, setCatalogQuery] = useState('');
  const [isCatalogOpen, setIsCatalogOpen] = useState(true);
  const [piecesOrQty, setPiecesOrQty] = useState(DEFAULT_QUANTITY);
  const [mode, setMode] = useState('QTY_TO_WEIGHT');
  const [dimensions, setDimensions] = useState({});
  const [sheetTotalWeightKg, setSheetTotalWeightKg] = useState('');
  const [pricePerMeter, setPricePerMeter] = useState('');
  const [pricePerTon, setPricePerTon] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [result, setResult] = useState(null);
  const [errorKey, setErrorKey] = useState('');
  const [errorValues, setErrorValues] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debugEnabled, setDebugEnabled] = useState(false);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const response = await authFetch(`${API_BASE_URL}/api/catalog`);
        if (!response.ok) {
          throw new Error('catalog');
        }
        const data = await response.json();
        setCatalog(data);
        setCatalogErrorKey('');
      } catch (fetchError) {
        setCatalogErrorKey('calculator.errorCatalog');
      }
    };

    const fetchDensityCatalog = async () => {
      try {
        const response = await authFetch(`${API_BASE_URL}/api/density-catalog`);
        if (!response.ok) {
          throw new Error('density');
        }
        const data = await response.json();
        setDensityCatalog(data);
        setDensityErrorKey('');
        const defaultMetal = data?.metals?.[0];
        if (defaultMetal) {
          setMetal(defaultMetal.id);
          setAlloy(defaultMetal.alloys?.[0]?.id || '');
        }
      } catch (fetchError) {
        setDensityErrorKey('calculator.errorDensity');
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
    setErrorKey('');
    setErrorValues(null);
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

  const catalogChips = useMemo(() => {
    if (!catalog?.calculators) return [];
    const withLabels = catalog.calculators.map((calculator) => {
      const menuText = translateMenuLabel(calculator.menuLabel, t, i18n.language);
      const subtypeText = calculator.subtypeLabel
        ? translateSubtypeLabel(calculator.subtypeLabel, t, i18n.language)
        : '';
      const label = subtypeText ? `${menuText} - ${subtypeText}` : menuText;
      const searchText = [
        calculator.menuLabel,
        calculator.subtypeLabel,
        calculator.id,
        menuText,
        subtypeText,
        label,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return { calculator, label, searchText };
    });

    return withLabels.sort((a, b) => {
      const indexA = MENU_ORDER.indexOf(a.calculator.menuLabel);
      const indexB = MENU_ORDER.indexOf(b.calculator.menuLabel);
      const safeIndexA = indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA;
      const safeIndexB = indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB;
      if (safeIndexA !== safeIndexB) {
        return safeIndexA - safeIndexB;
      }
      return (a.calculator.subtypeLabel || '').localeCompare(b.calculator.subtypeLabel || '');
    });
  }, [catalog, t, i18n.language]);

  const filteredCatalogChips = useMemo(() => {
    const query = catalogQuery.trim().toLowerCase();
    if (!query) return catalogChips;
    // Match query against translated labels and raw keys so localized/English terms work.
    return catalogChips.filter((chip) => chip.searchText.includes(query));
  }, [catalogChips, catalogQuery]);

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
      setActiveCalculatorId(defaultMenu.calculators[0].id);
    }
  }, [menuItems, activeCalculatorId]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const mediaQuery = window.matchMedia('(max-width: 720px)');
    const handleChange = () => {
      if (!mediaQuery.matches) {
        setIsCatalogOpen(true);
      }
    };
    handleChange();
    mediaQuery.addEventListener?.('change', handleChange);
    return () => mediaQuery.removeEventListener?.('change', handleChange);
  }, []);

  useEffect(() => {
    setDimensions(buildDimensionState(activeCalculator));
    setFieldErrors({});
    setResult(null);
    setErrorKey('');
    setErrorValues(null);
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
    setErrorKey('');
    setErrorValues(null);
  };

  const handleAlloyChange = (nextAlloyId) => {
    setAlloy(nextAlloyId);
    setErrorKey('');
    setErrorValues(null);
  };

  const validateForm = () => {
    if (!activeCalculator) {
      return { messageKey: 'validation.selectCalculator', fieldErrors: {} };
    }

    const nextFieldErrors = {};
    if (!metal || !alloy) {
      return { messageKey: 'validation.selectMetalAlloy', fieldErrors: nextFieldErrors };
    }
    if (!Number.isFinite(densityGcm3) || densityGcm3 <= 0) {
      return { messageKey: 'validation.selectMetalAlloyDensity', fieldErrors: nextFieldErrors };
    }

    activeCalculator.fields.forEach((field) => {
      const entry = dimensions[field.key];
      if (!entry || entry.value === '') {
        if (field.required) {
          nextFieldErrors[field.key] = { type: 'required', label: field.label };
        }
        return;
      }
      const numericValue = parseNumber(entry.value);
      if (!Number.isFinite(numericValue) || numericValue <= 0) {
        nextFieldErrors[field.key] = { type: 'positive', label: field.label };
        return;
      }
      if (field.minValue && numericValue < field.minValue) {
        nextFieldErrors[field.key] = { type: 'min', label: field.label, min: field.minValue };
      }
    });

    const qtyValue = parseNumber(piecesOrQty);
    if (!Number.isFinite(qtyValue) || qtyValue <= 0) {
      return { messageKey: 'validation.quantityGreaterThanZero', fieldErrors: nextFieldErrors };
    }

    if (mode === 'QTY_TO_WEIGHT' && !Number.isInteger(qtyValue)) {
      return { messageKey: 'validation.quantityInteger', fieldErrors: nextFieldErrors };
    }

    if (Object.keys(nextFieldErrors).length > 0) {
      return { messageKey: 'validation.fixHighlighted', fieldErrors: nextFieldErrors };
    }

    return { messageKey: '', fieldErrors: {} };
  };

  const performCalculation = async () => {
    const validation = validateForm();
    setFieldErrors(validation.fieldErrors);
    if (validation.messageKey) {
      setErrorKey(validation.messageKey);
      setErrorValues(null);
      setResult(null);
      return null;
    }

    setIsSubmitting(true);
    setErrorKey('');
    setErrorValues(null);

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
        throw new Error(errorPayload?.message || 'calculation');
      }

      const data = await response.json();
      setResult(data);
      return data;
    } catch (fetchError) {
      setResult(null);
      if (fetchError.message === 'calculation') {
        setErrorKey('calculator.errorCalculationFailed');
      } else {
        setErrorKey('calculator.errorUnableToCalculate');
      }
      setErrorValues(null);
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
    setErrorKey('');
    setErrorValues(null);
  };

  useEffect(() => {
    const hasDimensions = Object.values(dimensions).some((entry) => entry?.value !== '' && entry?.value != null);
    const hasInput = hasDimensions || parseNumber(piecesOrQty) > 0;
    if (!hasInput) return;
    const validation = validateForm();
    setFieldErrors(validation.fieldErrors);
    if (validation.messageKey) {
      setErrorKey(validation.messageKey);
      setErrorValues(null);
      setResult(null);
      return;
    }
    performCalculation();
  }, [metal, alloy]);

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

  const activeCalculatorLabel = useMemo(() => {
    if (!activeCalculator) return '';
    const menuLabel = translateMenuLabel(activeCalculator.menuLabel, t, i18n.language);
    if (activeCalculator.subtypeLabel) {
      const subtypeLabel = translateSubtypeLabel(activeCalculator.subtypeLabel, t, i18n.language);
      return `${menuLabel} - ${subtypeLabel}`;
    }
    return menuLabel;
  }, [activeCalculator, i18n.language, t]);

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

  const formatMetric = (value, digits = 3) =>
    Number.isFinite(value) ? value.toFixed(digits) : t('general.na');

  const getFieldErrorText = (fieldError) => {
    if (!fieldError) return '';
    const fieldLabel = translateFieldLabel(fieldError.label, t, i18n.language);
    if (fieldError.type === 'required') {
      return t('validation.fieldRequired', { field: fieldLabel });
    }
    if (fieldError.type === 'positive') {
      return t('validation.fieldPositive', { field: fieldLabel });
    }
    if (fieldError.type === 'min') {
      return t('validation.fieldMin', { field: fieldLabel, min: fieldError.min });
    }
    return '';
  };

  const catalogError = catalogErrorKey ? t(catalogErrorKey) : '';
  const densityError = densityErrorKey ? t(densityErrorKey) : '';
  const errorText = errorKey ? t(errorKey, errorValues || {}) : '';

  const handleAddToEstimate = async () => {
    if (isSubmitting) return;
    const customerOk = validateCustomer ? validateCustomer() : true;
    if (!customerOk) {
      setErrorKey('validation.customerRequiredForItems');
      setErrorValues(null);
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
      dimensionsSummary: buildDimensionsSummary(activeCalculator, dimensions, t, i18n.language),
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
          <h1>{t('calculator.title')}</h1>
          <p>{t('calculator.subtitle')}</p>
        </div>

        <div className="calculator-grid catalog-layout">
          <aside className={`menu-panel catalog-panel ${isCatalogOpen ? 'is-open' : 'is-collapsed'}`}>
            <div className="catalog-header">
              <div className="menu-title">{t('catalog.title')}</div>
              <button
                type="button"
                className="catalog-toggle"
                onClick={() => setIsCatalogOpen((prev) => !prev)}
                aria-expanded={isCatalogOpen}
                aria-label={isCatalogOpen ? t('catalog.toggleClose') : t('catalog.toggleOpen')}
                title={isCatalogOpen ? t('catalog.toggleClose') : t('catalog.toggleOpen')}
              >
                {t('catalog.title')}
              </button>
            </div>
            <div className="catalog-body">
              <label className="catalog-search">
                <span className="visually-hidden">{t('catalog.searchPlaceholder')}</span>
                <input
                  type="search"
                  value={catalogQuery}
                  onChange={(event) => setCatalogQuery(event.target.value)}
                  placeholder={t('catalog.searchPlaceholder')}
                />
              </label>
              <div className="catalog-chips">
                {filteredCatalogChips.map((chip) => (
                  <button
                    key={chip.calculator.id}
                    type="button"
                    className={`catalog-chip ${
                      activeCalculatorId === chip.calculator.id ? 'selected' : ''
                    }`}
                    onClick={() => {
                      setActiveCalculatorId(chip.calculator.id);
                    }}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div className="form-section">
            <div className="field-row">
              <label>
                {t('calculator.metal')}
                <select value={metal} onChange={(event) => handleMetalChange(event.target.value)}>
                  {metals.map((entry) => (
                    <option key={entry.id} value={entry.id}>
                      {entry.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {t('calculator.alloy')}
                <select value={alloy} onChange={(event) => handleAlloyChange(event.target.value)}>
                  {alloys.map((entry) => (
                    <option key={entry.id} value={entry.id}>
                      {entry.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {t('calculator.density')}
                <input type="text" value={densityGcm3 ?? ''} readOnly />
              </label>
              <label>
                {t('calculator.calculator')}
                <select
                  value={activeCalculatorId}
                  onChange={(event) => {
                    const nextId = event.target.value;
                    setActiveCalculatorId(nextId);
                  }}
                >
                  {catalog?.calculators?.map((calculator) => (
                    <option key={calculator.id} value={calculator.id}>
                      {translateMenuLabel(calculator.menuLabel, t, i18n.language)}{' '}
                      {calculator.subtypeLabel
                        ? `- ${translateSubtypeLabel(calculator.subtypeLabel, t, i18n.language)}`
                        : ''}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {isFasteners ? (
              <div className="mode-toggle">
                <span>{t('calculator.mode')}</span>
                <label>
                  <input
                    type="radio"
                    name="mode"
                    value="QTY_TO_WEIGHT"
                    checked={mode === 'QTY_TO_WEIGHT'}
                    onChange={() => setMode('QTY_TO_WEIGHT')}
                  />
                  {t('calculator.qtyToWeight')}
                </label>
                <label>
                  <input
                    type="radio"
                    name="mode"
                    value="WEIGHT_TO_QTY"
                    checked={mode === 'WEIGHT_TO_QTY'}
                    onChange={() => setMode('WEIGHT_TO_QTY')}
                  />
                  {t('calculator.weightToQty')}
                </label>
              </div>
            ) : null}

            <div className="field-row">
              <label>
                {isWeightToQty ? t('calculator.totalWeightKg') : t('calculator.quantity')}
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
              <div className="dimension-title">{t('calculator.dimensions')}</div>
              {visibleFields.map((field) => (
                <FieldInput
                  key={field.key}
                  field={field}
                  label={translateFieldLabel(field.label, t, i18n.language)}
                  value={dimensions[field.key]?.value ?? ''}
                  unit={dimensions[field.key]?.unit ?? field.defaultUnit}
                  errorText={getFieldErrorText(fieldErrors[field.key])}
                  onValueChange={(value) => updateDimensionValue(field.key, value)}
                  onUnitChange={(unit) => updateDimensionUnit(field.key, unit)}
                />
              ))}
            </div>

            {isSheet ? (
              <div className="sheet-pricing">
                <div className="dimension-title">{t('calculator.pricing')}</div>
                <div className="field-row">
                  <label>
                    {t('calculator.lengthM')}
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
                    {t('calculator.totalWeightLabel')}
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
                    {t('calculator.pricePerMeter', { currency: currencyCode })}
                    <input
                      type="text"
                      inputMode="decimal"
                      value={pricePerMeter}
                      onChange={(event) => setPricePerMeter(event.target.value)}
                    />
                  </label>
                  <label>
                    {t('calculator.pricePerTon', { currency: currencyCode })}
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

            {errorText ? <div className="error-box">{errorText}</div> : null}

            <label className="debug-toggle">
              <input
                type="checkbox"
                checked={debugEnabled}
                onChange={(event) => setDebugEnabled(event.target.checked)}
              />
              {t('calculator.enableDebug')}
            </label>

            <div className="action-row">
              <button type="button" className="primary" onClick={handleCalculate} disabled={isSubmitting}>
                {isSubmitting ? t('calculator.calculating') : t('calculator.calculate')}
              </button>
              <button type="button" className="secondary" onClick={handleReset}>
                {t('calculator.reset')}
              </button>
              <button
                type="button"
                className="secondary"
                onClick={handleAddToEstimate}
                disabled={isSubmitting}
              >
                {t('calculator.addToEstimate')}
              </button>
            </div>
          </div>

          <div className="result-section">
            <ShapeDiagramCard shapeKey={shapeDiagramKey} />
            <div className="result-card">
              <div className="result-label">
                {isWeightToQty ? t('calculator.estimatedQuantity') : t('calculator.calculatedWeight')}
              </div>
              <div className="result-value">
                {isWeightToQty
                  ? `${result?.quantity ? result.quantity.toFixed(4) : '0.0000'} pcs`
                  : `${result?.weightKg ? result.weightKg.toFixed(4) : '0.0000'} kg`}
              </div>
              <div className="result-meta">
                {activeCalculator
                  ? t('calculator.resultCalculator', { label: activeCalculatorLabel })
                  : t('calculator.selectCalculator')}
              </div>
            </div>

            <div className="result-details">
              <div>
                <span>{t('calculator.volume')}</span>
                <strong>{result?.volumeM3 ? result.volumeM3.toFixed(4) : '0.0000'} m3</strong>
              </div>
              <div>
                <span>{t('calculator.unitWeight')}</span>
                <strong>{result?.unitWeightKg ? result.unitWeightKg.toFixed(4) : '0.0000'} kg</strong>
              </div>
              <div>
                <span>{isWeightToQty ? t('calculator.inputWeight') : t('calculator.quantity')}</span>
                <strong>{piecesOrQty || DEFAULT_QUANTITY}</strong>
              </div>
            </div>

            {isSheet ? (
              <div className="sheet-metrics">
                <div>
                  <span>{t('calculator.weightOfOneMeter')}</span>
                  <strong>{`${formatMetric(sheetMetrics?.weightPerMeter, 3)} kg`}</strong>
                </div>
                <div>
                  <span>
                    {t('calculator.costOfTonAtPricePerMeter', { price: formatCurrency(pricePerMeter) })}
                  </span>
                  <strong>{formatCurrency(sheetMetrics?.costPerTonFromPricePerMeter)}</strong>
                </div>
                <div>
                  <span>
                    {t('calculator.pricePerMeterFromTon', { price: formatCurrency(pricePerTon) })}
                  </span>
                  <strong>{formatCurrency(sheetMetrics?.pricePerMeterFromTonPrice)}</strong>
                </div>
                <div>
                  <span>
                    {t('calculator.totalWeightOfLength', { length: dimensions.length?.value || '__' })}
                  </span>
                  <strong>{formatMetric(sheetMetrics?.totalWeightForLength, 3)}</strong>
                </div>
                <div>
                  <span>
                    {t('calculator.totalLengthOfWeight', { weight: sheetTotalWeightKg || '__' })}
                  </span>
                  <strong>{formatMetric(sheetMetrics?.totalLengthForWeight, 2)}</strong>
                </div>
              </div>
            ) : null}

            <div className="result-note">
              {t('calculator.resultNote')}
            </div>

            {debugEnabled && result ? (
              <div className="debug-section">
                <div className="debug-title">{t('calculator.debugDetails')}</div>
                <div className="debug-grid">
                  <div>
                    <span>{t('calculator.densityGcm3')}</span>
                    <strong>{result.densityGPerCm3 ?? t('general.na')}</strong>
                  </div>
                  <div>
                    <span>{t('calculator.unitWeightKg')}</span>
                    <strong>{result.unitWeightKg ?? t('general.na')}</strong>
                  </div>
                  <div>
                    <span>{t('calculator.rawVolumeM3')}</span>
                    <strong>{result.volumeM3Raw ?? t('general.na')}</strong>
                  </div>
                  <div>
                    <span>{t('calculator.rawWeightKg')}</span>
                    <strong>{result.weightKgRaw ?? t('general.na')}</strong>
                  </div>
                  <div>
                    <span>{t('calculator.rawQuantity')}</span>
                    <strong>{result.quantityRaw ?? piecesOrQty}</strong>
                  </div>
                </div>
                <div className="debug-dims">
                  <div className="debug-title">{t('calculator.normalizedDimensions')}</div>
                  {result.normalizedDimensionsMm ? (
                    <ul>
                      {Object.entries(result.normalizedDimensionsMm).map(([key, value]) => (
                        <li key={key}>{`${key}: ${value}`}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="debug-empty">{t('calculator.noNormalizedDimensions')}</div>
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
