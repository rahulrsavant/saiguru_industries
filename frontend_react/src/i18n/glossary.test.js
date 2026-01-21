import { applyGlossary } from './glossary';

test('applies glossary replacements for Hindi and Marathi', () => {
  expect(applyGlossary('Pipe Bolt Angle', 'hi')).toBe('पाईप बोल्ट अँगल');
  expect(applyGlossary('Sheet and Nut', 'mr')).toBe('शीट and नट');
});

test('does not replace inside other words', () => {
  expect(applyGlossary('Pipeline', 'hi')).toBe('Pipeline');
});

test('skips glossary for English', () => {
  expect(applyGlossary('Pipe', 'en')).toBe('Pipe');
});
