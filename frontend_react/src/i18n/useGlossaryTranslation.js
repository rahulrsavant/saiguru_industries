import { useTranslation } from 'react-i18next';
import { applyGlossary } from './glossary';

const useGlossaryTranslation = () => {
  const { t, i18n } = useTranslation();
  const tGlossary = (key, options) => applyGlossary(t(key, options), i18n.language);
  return { t: tGlossary, i18n };
};

export default useGlossaryTranslation;
