# Metal Calculator Architecture (Phase 1)

## 1) Menu tree + submenus

### Rolled metal calculators
- **Round bar**
- **Square bar**
- **Flat bar**
- **Sheet**
- **Pipe**
  - Round
  - Square
  - Rectangular
- **Rebar**
- **Angle**
  - Equal
  - Unequal
- **Channel**
  - C
  - U
- **Beam**
  - I
  - T

### Fasteners
- **Bolt**
  - Hex (initial)
- **Screw**
  - Machine (initial)
- **Nut**
  - Hex (initial)

## 2) Calculator catalog: fields, units, validation

Field definitions follow the catalog JSON (`calculator-catalog.json`) and are rendered dynamically in the UI.

### Rolled (examples)
- **Round bar**
  - Diameter (DIAMETER): mm/cm/m/in/ft, required, min 0.01
  - Length (LENGTH): mm/cm/m/in/ft, required, min 0.01
- **Square bar**
  - Side (LENGTH): mm/cm/m/in/ft, required, min 0.01
  - Length (LENGTH): mm/cm/m/in/ft, required, min 0.01
- **Flat bar**
  - Width (LENGTH): mm/cm/m/in/ft, required, min 0.01
  - Thickness (THICKNESS): mm/cm/m/in, required, min 0.01
  - Length (LENGTH): mm/cm/m/in/ft, required, min 0.01
- **Sheet**
  - Thickness (THICKNESS): mm/cm/m/in, required, min 0.01
  - Width (LENGTH): mm/cm/m/in/ft, required, min 0.01
  - Length (LENGTH): mm/cm/m/in/ft, required, min 0.01
- **Pipe Round**
  - Outside Diameter (DIAMETER): mm/cm/m/in, required, min 0.01
  - Wall Thickness (THICKNESS): mm/cm/m/in, required, min 0.01
  - Length (LENGTH): mm/cm/m/in/ft, required, min 0.01
  - Additional rule: wall thickness < outside diameter / 2

### Fasteners (initial)
- **Bolt (Hex)**
  - Diameter (DIAMETER): mm/cm/m/in, required, min 0.01
  - Length (LENGTH): mm/cm/m/in/ft, required, min 0.01
- **Screw (Machine)**
  - Diameter (DIAMETER): mm/cm/m/in, required, min 0.01
  - Length (LENGTH): mm/cm/m/in/ft, required, min 0.01
- **Nut (Hex)**
  - Diameter (DIAMETER): mm/cm/m/in, required, min 0.01
  - Thickness (THICKNESS): mm/cm/m/in, required, min 0.01

## 3) Canonical internal unit system

- Length: **mm**
- Volume: **m³**
- Density: **kg/m³**
- Weight: **kg**

All inputs are normalized to mm in the backend (UnitConverter), and formulas compute in full precision.

## 4) Output strategy

- **Raw values** are returned from calculations (full precision).
- **Display values** are rounded (currently to 4 decimals) for UI display.
- **No early rounding**: rounding is applied only after the final raw calculation.

## 5) API design

### GET /catalog
Returns the catalog definition with menu labels, calculators, fields, and allowed units.

**Response (conceptual)**
```json
{
  "unitSystem": {
    "lengthBase": "mm",
    "volumeBase": "m3",
    "densityBase": "kg/m3",
    "weightBase": "kg"
  },
  "calculators": [
    {
      "id": "rolled_round_bar",
      "category": "ROLLED",
      "menuLabel": "Round bar",
      "subtypeLabel": null,
      "formulaKey": "ROUND_BAR",
      "fields": [
        {
          "key": "diameter",
          "label": "Diameter",
          "unitType": "DIAMETER",
          "allowedUnits": ["mm", "cm", "m", "in", "ft"],
          "defaultUnit": "mm",
          "required": true,
          "minValue": 0.01
        }
      ]
    }
  ]
}
```

### POST /calculate
Takes calculator and material identifiers, quantity or weight input, and dimensions.

**Request**
```json
{
  "calculatorId": "rolled_round_bar",
  "materialId": "steel",
  "piecesOrQty": 3,
  "mode": "QTY_TO_WEIGHT",
  "dimensions": [
    { "key": "diameter", "value": 10, "unit": "mm" },
    { "key": "length", "value": 1000, "unit": "mm" }
  ]
}
```

**Response**
```json
{
  "weightKg": 18.8496,
  "volumeM3": 0.0024,
  "weightKgRaw": 18.8495559215,
  "volumeM3Raw": 0.0023561944902,
  "quantity": 3,
  "quantityRaw": 3,
  "mode": "QTY_TO_WEIGHT"
}
```

### Fastener bidirectional mode
For fasteners (and any future calculator that needs it), support two modes:
- **QTY_TO_WEIGHT**: quantity → total weight
- **WEIGHT_TO_QTY**: total weight → quantity

## 6) Slice plan (incremental delivery)

1. **Slice 1**: Rolled basic bars (Round bar, Square bar, Flat bar, Sheet)
2. **Slice 2**: Pipes (Round, Square, Rectangular)
3. **Slice 3**: Rebar
4. **Slice 4**: Angle + Channel
5. **Slice 5**: Beam (I + T)
6. **Slice 6**: Fasteners (Bolt, Screw, Nut) — start with D+L, then refine geometry
