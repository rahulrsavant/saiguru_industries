import { defaultShapeDiagram, shapeDiagramMap } from '../constants/shapeDiagramMap';
import useGlossaryTranslation from '../i18n/useGlossaryTranslation';

const ShapeDiagramCard = ({ shapeKey }) => {
  const { t } = useGlossaryTranslation();
  const diagram = shapeDiagramMap[shapeKey] || defaultShapeDiagram;

  const label = diagram.labelKey ? t(diagram.labelKey) : '';
  const alt = diagram.altKey ? t(diagram.altKey) : '';

  return (
    <aside className="shape-diagram-card no-print" aria-live="polite">
      <div className="shape-diagram-frame">
        <img className="shape-diagram-image" src={diagram.src} alt={alt} />
      </div>
      <div className="shape-diagram-label">{label}</div>
    </aside>
  );
};

export default ShapeDiagramCard;
