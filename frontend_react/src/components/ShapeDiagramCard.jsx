import { defaultShapeDiagram, shapeDiagramMap } from '../constants/shapeDiagramMap';

const ShapeDiagramCard = ({ shapeKey }) => {
  const diagram = shapeDiagramMap[shapeKey] || defaultShapeDiagram;

  return (
    <aside className="shape-diagram-card no-print" aria-live="polite">
      <div className="shape-diagram-frame">
        <img className="shape-diagram-image" src={diagram.src} alt={diagram.alt} />
      </div>
      <div className="shape-diagram-label">{diagram.label}</div>
    </aside>
  );
};

export default ShapeDiagramCard;
