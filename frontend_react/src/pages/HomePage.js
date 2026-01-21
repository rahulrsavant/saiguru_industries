import { useNavigate } from 'react-router-dom';
import { createNewEstimateSession } from '../utils/estimateStorage';
import useGlossaryTranslation from '../i18n/useGlossaryTranslation';

const HomePage = () => {
  const navigate = useNavigate();
  const { t } = useGlossaryTranslation();

  const handleStartNew = () => {
    createNewEstimateSession();
    navigate('/estimate');
  };

  return (
    <main className="page page-home">
      <section className="hero-card">
        <div>
          <p className="eyebrow">{t('home.brand')}</p>
          <h1>{t('home.headline')}</h1>
          <p className="hero-sub">
            {t('home.subheadline')}
          </p>
        </div>
        <div className="home-actions">
          <button type="button" className="home-card primary" onClick={handleStartNew}>
            <span>{t('home.startNewEstimate')}</span>
            <small>{t('home.startNewEstimateDesc')}</small>
          </button>
          <button type="button" className="home-card" onClick={() => navigate('/history')}>
            <span>{t('home.history')}</span>
            <small>{t('home.historyDesc')}</small>
          </button>
          <button type="button" className="home-card" onClick={() => navigate('/settings')}>
            <span>{t('home.settings')}</span>
            <small>{t('home.settingsDesc')}</small>
          </button>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
