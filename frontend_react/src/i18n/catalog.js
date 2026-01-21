import { applyGlossary } from './glossary';

const MENU_LABEL_KEYS = {
  Pipe: 'catalog.menu.pipe',
  Angle: 'catalog.menu.angle',
  Rebar: 'catalog.menu.rebar',
  Beam: 'catalog.menu.beam',
  Channel: 'catalog.menu.channel',
  'Flat bar': 'catalog.menu.flatBar',
  Sheet: 'catalog.menu.sheet',
  'Square bar': 'catalog.menu.squareBar',
  'Round bar': 'catalog.menu.roundBar',
  Bolt: 'catalog.menu.bolt',
  Screw: 'catalog.menu.screw',
  Nut: 'catalog.menu.nut',
};

const SUBTYPE_LABEL_KEYS = {
  Round: 'catalog.subtype.round',
  Square: 'catalog.subtype.square',
  Rectangular: 'catalog.subtype.rectangular',
  Equal: 'catalog.subtype.equal',
  Unequal: 'catalog.subtype.unequal',
  C: 'catalog.subtype.c',
  U: 'catalog.subtype.u',
  I: 'catalog.subtype.i',
  T: 'catalog.subtype.t',
  Hex: 'catalog.subtype.hex',
  Machine: 'catalog.subtype.machine',
};

const FIELD_LABEL_KEYS = {
  Diameter: 'catalog.field.diameter',
  Length: 'catalog.field.length',
  Width: 'catalog.field.width',
  Side: 'catalog.field.side',
  Thickness: 'catalog.field.thickness',
  'Outside Diameter (OD)': 'catalog.field.outsideDiameter',
  'Outside Width': 'catalog.field.outsideWidth',
  'Outside Height': 'catalog.field.outsideHeight',
  'Wall Thickness': 'catalog.field.wallThickness',
  Height: 'catalog.field.height',
  Leg: 'catalog.field.leg',
  'Leg A': 'catalog.field.legA',
  'Leg B': 'catalog.field.legB',
  'Flange Width': 'catalog.field.flangeWidth',
  'Flange Thickness': 'catalog.field.flangeThickness',
  'Web Thickness': 'catalog.field.webThickness',
};

const DIMENSION_KEY_LABEL_KEYS = {
  diameter: 'catalog.field.diameter',
  length: 'catalog.field.length',
  width: 'catalog.field.width',
  thickness: 'catalog.field.thickness',
  side: 'catalog.field.side',
  outside_diameter: 'catalog.field.outsideDiameter',
  outside_width: 'catalog.field.outsideWidth',
  outside_height: 'catalog.field.outsideHeight',
  wall_thickness: 'catalog.field.wallThickness',
  height: 'catalog.field.height',
  leg: 'catalog.field.leg',
  leg_a: 'catalog.field.legA',
  leg_b: 'catalog.field.legB',
  flange_width: 'catalog.field.flangeWidth',
  flange_thickness: 'catalog.field.flangeThickness',
  web_thickness: 'catalog.field.webThickness',
};

const translateWithGlossary = (label, lang) => applyGlossary(label, lang || 'en');

export const translateMenuLabel = (label, t, lang) => {
  if (!label) return '';
  const key = MENU_LABEL_KEYS[label];
  const resolved = key ? t(key) : label;
  return translateWithGlossary(resolved, lang);
};

export const translateSubtypeLabel = (label, t, lang) => {
  if (!label) return '';
  const key = SUBTYPE_LABEL_KEYS[label];
  const resolved = key ? t(key) : label;
  return translateWithGlossary(resolved, lang);
};

export const translateFieldLabel = (label, t, lang) => {
  if (!label) return '';
  const key = FIELD_LABEL_KEYS[label];
  const resolved = key ? t(key) : label;
  return translateWithGlossary(resolved, lang);
};

export const translateDimensionKey = (key, t, lang) => {
  if (!key) return '';
  const labelKey = DIMENSION_KEY_LABEL_KEYS[key];
  const resolved = labelKey ? t(labelKey) : key;
  return translateWithGlossary(resolved, lang);
};

export const translateShapeLabel = (label, t, lang) => {
  if (!label) return '';
  if (label.includes(' - ')) {
    const [menuLabel, subtypeLabel] = label.split(' - ');
    const menuText = translateMenuLabel(menuLabel, t, lang);
    const subtypeText = translateSubtypeLabel(subtypeLabel, t, lang);
    return `${menuText} - ${subtypeText}`;
  }
  return translateMenuLabel(label, t, lang);
};

export const formatDimensionsSummary = (dimensions, t, lang, fallback = null, orderKeys = null) => {
  if (!dimensions || Object.keys(dimensions).length === 0) {
    return fallback || t('general.na');
  }
  const entries = orderKeys
    ? orderKeys.map((key) => [key, dimensions[key]])
    : Object.entries(dimensions);
  return entries
    .filter(([, value]) => value && value.value !== '' && value.value !== null && value.value !== undefined)
    .map(([key, value]) => {
      const label = translateDimensionKey(key, t, lang);
      const unit = value?.unit || '';
      return `${label}: ${value.value} ${unit}`.trim();
    })
    .join(', ') || t('general.na');
};
