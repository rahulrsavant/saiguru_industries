const GLOSSARY = {
  Pipe: 'पाईप',
  Angle: 'अँगल',
  Bolt: 'बोल्ट',
  Screw: 'स्क्रू',
  Nut: 'नट',
  Washer: 'वॉशर',
  Sheet: 'शीट',
  Plate: 'प्लेट',
  Rod: 'रॉड',
  Bar: 'बार',
  Channel: 'चॅनेल',
  Beam: 'बीम',
  Clamp: 'क्लॅम्प',
  Coupling: 'कपलिंग',
  Thread: 'थ्रेड',
  Fitting: 'फिटिंग',
  Elbow: 'एल्बो',
  Tee: 'टी',
  Union: 'युनियन',
  Valve: 'व्हॉल्व',
  Gauge: 'गेज',
  Rebar: 'रीबार',
};

const GLOSSARY_LANGS = new Set(['hi', 'mr']);

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const applyGlossary = (text, lang) => {
  if (!text || !GLOSSARY_LANGS.has(lang)) return text;
  return Object.entries(GLOSSARY).reduce((accumulator, [english, devanagari]) => {
    const pattern = new RegExp(`\\b${escapeRegExp(english)}\\b`, 'gi');
    return accumulator.replace(pattern, devanagari);
  }, text);
};

export const glossaryTerms = GLOSSARY;
