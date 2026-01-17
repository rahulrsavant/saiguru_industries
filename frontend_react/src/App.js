import { useMemo, useState } from 'react';
import './App.css';

function App() {
  const [material, setMaterial] = useState('steel');
  const [density, setDensity] = useState(7850);
  const [widthMm, setWidthMm] = useState('');
  const [thicknessMm, setThicknessMm] = useState('');
  const [lengthValue, setLengthValue] = useState('');
  const [lengthUnit, setLengthUnit] = useState('m');

  const parsedWidthMm = Number.parseFloat(String(widthMm).replace(',', '.'));
  const parsedThicknessMm = Number.parseFloat(String(thicknessMm).replace(',', '.'));
  const parsedLength = Number.parseFloat(String(lengthValue).replace(',', '.'));

  const lengthMeters = useMemo(() => {
    if (!Number.isFinite(parsedLength)) return 0;
    if (lengthUnit === 'ft') return parsedLength * 0.3048;
    if (lengthUnit === 'in') return parsedLength * 0.0254;
    return parsedLength;
  }, [parsedLength, lengthUnit]);

  const weightPerMeter = useMemo(() => {
    if (!Number.isFinite(parsedWidthMm) || !Number.isFinite(parsedThicknessMm)) return 0;
    const widthM = parsedWidthMm / 1000;
    const thicknessM = parsedThicknessMm / 1000;
    return density * widthM * thicknessM;
  }, [density, parsedWidthMm, parsedThicknessMm]);

  const totalWeight = useMemo(() => weightPerMeter * lengthMeters, [weightPerMeter, lengthMeters]);

  const sidebarItems = [
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

  const tableRows = [
    { dim: 'Sheet 500x1.5', width: 500, thick: 1.5, weight: 5.888, meters: 169.8, density: 7850 },
    { dim: 'Sheet 500x2.2', width: 500, thick: 2.2, weight: 8.635, meters: 115.8, density: 7850 },
    { dim: 'Sheet 500x3', width: 500, thick: 3, weight: 11.775, meters: 84.9, density: 7850 },
    { dim: 'Sheet 500x3.8', width: 500, thick: 3.8, weight: 14.915, meters: 67.7, density: 7850 },
    { dim: 'Sheet 500x4', width: 500, thick: 4, weight: 15.7, meters: 63.7, density: 7850 },
    { dim: 'Sheet 500x5.3', width: 500, thick: 5.3, weight: 20.803, meters: 48.1, density: 7850 },
    { dim: 'Sheet 500x8', width: 500, thick: 8, weight: 31.4, meters: 31.8, density: 7850 },
    { dim: 'Sheet 530x1.3', width: 530, thick: 1.3, weight: 5.409, meters: 184.9, density: 7850 },
  ];

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
          <a href="#metal">Metal products</a>
          <a href="#fasteners">Fasteners</a>
        </nav>
        <div className="topbar-right">
          <span className="lang">English</span>
          <button className="ghost">Get widget for your website</button>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-title">Catalog</div>
          <ul>
            {sidebarItems.map((item) => (
              <li key={item}>
                <span className="icon" />
                {item}
              </li>
            ))}
          </ul>
        </aside>

        <main className="content">
          <div className="breadcrumbs">
            <a href="#metal">Metal Weight Calculator</a>
            <span>›</span>
            <span>Weight of sheet of steel and other metals</span>
          </div>

          <h1>Metal sheet weight calculator</h1>
          <p className="subtitle">
            Dimensions and weight of sheet products from hot-rolled, galvanized, stainless steel and other metals and alloys
          </p>

          <div className="panel">
            <div className="tabs">
              <button className="tab active">Sheet / Plate</button>
              <button className="tab">By dimensions</button>
              <button className="tab">Browse standard</button>
            </div>

            <div className="panel-body">
              <div className="panel-left">
                <p className="panel-note">
                  Thin and heavy plate in the form of sheets and wide sheet strips, produced by rolling or forging.
                </p>
                <button className="accent">Add to bookmarks</button>
              </div>

              <div className="panel-form">
                <div className="row">
                  <label>
                    Material
                    <select value={material} onChange={(event) => setMaterial(event.target.value)}>
                      <option value="steel">Steel</option>
                      <option value="aluminum">Aluminum</option>
                      <option value="copper">Copper</option>
                    </select>
                  </label>
                  <label>
                    Density
                    <select value={String(density)} onChange={(event) => setDensity(Number(event.target.value))}>
                      <option value="7850">Carbon steel 7850 kg/m³</option>
                      <option value="7900">Stainless steel 7900 kg/m³</option>
                      <option value="2700">Aluminum 2700 kg/m³</option>
                    </select>
                  </label>
                </div>

                <div className="row">
                  <label>
                    Width a
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="mm."
                      value={widthMm}
                      onChange={(event) => setWidthMm(event.target.value)}
                    />
                  </label>
                  <label>
                    Thickness s
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="mm."
                      value={thicknessMm}
                      onChange={(event) => setThicknessMm(event.target.value)}
                    />
                  </label>
                </div>

                <div className="row">
                  <label>
                    Length
                    <div className="input-group">
                      <input
                        type="text"
                        inputMode="decimal"
                        placeholder="0"
                        value={lengthValue}
                        onChange={(event) => setLengthValue(event.target.value)}
                      />
                      <select value={lengthUnit} onChange={(event) => setLengthUnit(event.target.value)}>
                        <option value="m">m</option>
                        <option value="ft">ft</option>
                        <option value="in">in</option>
                      </select>
                    </div>
                  </label>
                  <label>
                    Total weight
                    <input type="text" value={totalWeight ? totalWeight.toFixed(3) : ''} placeholder="kg." readOnly />
                  </label>
                </div>

                <div className="row">
                  <label>
                    Price per 1 meter
                    <input type="text" placeholder="$" />
                  </label>
                  <label>
                    Price per ton
                    <input type="text" placeholder="$" />
                  </label>
                </div>
              </div>

              <div className="panel-diagram">
                <div className="panel-metrics">
                  <div className="metrics-title">Sheet {parsedWidthMm || 0}×{parsedThicknessMm || 0}</div>
                  <div className="metrics-sub">Density {density} kg/m³</div>
                  <div className="metrics-label">weight of 1 meter:</div>
                  <div className="metrics-value">{weightPerMeter ? weightPerMeter.toFixed(3) : '0.000'} kg.</div>
                </div>
                <svg viewBox="0 0 200 120" aria-hidden="true">
                  <path d="M30 80 L120 30 L180 60 L90 110 Z" fill="none" stroke="#1b1b1b" strokeWidth="2" />
                  <line x1="30" y1="80" x2="90" y2="110" stroke="#ef6c00" strokeWidth="3" />
                  <line x1="30" y1="80" x2="120" y2="30" stroke="#1b1b1b" strokeWidth="2" />
                  <line x1="90" y1="110" x2="180" y2="60" stroke="#1b1b1b" strokeWidth="2" />
                  <text x="18" y="88" fontSize="12">a</text>
                  <text x="105" y="24" fontSize="12">s</text>
                  <text x="160" y="72" fontSize="12">l</text>
                </svg>
              </div>
            </div>

            <div className="panel-footer">
              <div className="calc-results">
                <p>Cost of a ton at a price of __ per meter, $:</p>
                <p>Price per meter of sheet at the cost of a ton __, $:</p>
                <p>Total weight of {lengthMeters ? lengthMeters.toFixed(2) : '0'} meters of sheet, kg.:</p>
                <p>Total length of 1000 kilograms of sheet, m.:</p>
              </div>
              <div className="calc-values">
                <span>n/a</span>
                <span>n/a</span>
                <span>{totalWeight ? totalWeight.toFixed(3) : '0.000'}</span>
                <span>{weightPerMeter ? (1000 / weightPerMeter).toFixed(2) : 'n/a'}</span>
              </div>
            </div>
          </div>

          <div className="rating-row">
            <a href="#error">Error report</a>
            <div className="stars">★★★★☆</div>
            <div className="rating-meta">4.4 of 5, Total ratings: 165</div>
            <a href="#about">About</a>
            <a href="#widget">Get widget for your website</a>
          </div>

          <p className="body-copy">
            Weight of a running meter of steel sheet and rolled products is calculated on the basis of reference
            information according to standards or according to a simple geometric formula ρy = ρ · a · s, where ρ is
            the flatness of steel 7850 kg/m³; s - metal thickness; in mm; a - sheet width in mm.
          </p>

          <h2>Tables of weight of steel sheet according to technical standards from different steel grades</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Sheet dimensions</th>
                  <th>Width a</th>
                  <th>Thickness s</th>
                  <th>Weight of 1 meter of the sheet</th>
                  <th>Meters of 1 ton</th>
                  <th>Density, kg / m³</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row) => (
                  <tr key={row.dim}>
                    <td>{row.dim}</td>
                    <td>{row.width}</td>
                    <td>{row.thick}</td>
                    <td>{row.weight.toFixed(4)} kg.</td>
                    <td>{row.meters} m.</td>
                    <td>{row.density}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
