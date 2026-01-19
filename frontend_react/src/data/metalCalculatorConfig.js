export const UNIT_OPTIONS = [
  { value: 'in', label: 'in' },
  { value: 'ft', label: 'ft' },
  { value: 'yd', label: 'yd' },
  { value: 'mm', label: 'mm' },
  { value: 'cm', label: 'cm' },
  { value: 'm', label: 'm' },
];

export const ALLOY_OPTIONS = [
  { value: 'steel', label: 'Steel' },
  { value: 'aluminum_1100', label: 'Aluminum 1100' },
  { value: 'aluminum_2011', label: 'Aluminum 2011' },
  { value: 'aluminum_2014', label: 'Aluminum 2014' },
  { value: 'aluminum_2017', label: 'Aluminum 2017' },
  { value: 'aluminum_2024', label: 'Aluminum 2024' },
  { value: 'aluminum_3003', label: 'Aluminum 3003' },
  { value: 'aluminum_5005', label: 'Aluminum 5005' },
  { value: 'aluminum_5052', label: 'Aluminum 5052' },
  { value: 'aluminum_5056', label: 'Aluminum 5056' },
  { value: 'aluminum_5083', label: 'Aluminum 5083' },
  { value: 'aluminum_5086', label: 'Aluminum 5086' },
  { value: 'aluminum_6061', label: 'Aluminum 6061' },
  { value: 'aluminum_6063', label: 'Aluminum 6063' },
  { value: 'aluminum_7050', label: 'Aluminum 7050' },
  { value: 'aluminum_7075', label: 'Aluminum 7075' },
  { value: 'aluminum_7178', label: 'Aluminum 7178' },
  { value: 'stainless_steel_300', label: 'Stainless Steel 300 Series' },
  { value: 'stainless_steel_400', label: 'Stainless Steel 400 Series' },
  { value: 'nickel_200', label: 'Nickel 200' },
  { value: 'nickel_400', label: 'Nickel 400' },
  { value: 'nickel_r_405', label: 'Nickel R-405' },
  { value: 'nickel_k_500', label: 'Nickel K-500' },
  { value: 'nickel_600', label: 'Nickel 600' },
  { value: 'nickel_625', label: 'Nickel 625' },
  { value: 'nickel_800h', label: 'Nickel 800H' },
  { value: 'nickel_800at', label: 'Nickel 800AT' },
  { value: 'nickel_825', label: 'Nickel 825' },
  { value: 'nickel_330', label: 'Nickel 330' },
  { value: 'nickel_20', label: 'Nickel 20' },
  { value: 'nickel_c_276', label: 'Nickel C-276' },
  { value: 'nickel_254smo', label: 'Nickel 254SMO' },
  { value: 'magnesium', label: 'Magnesium' },
  { value: 'beryllium', label: 'Beryllium' },
  { value: 'titanium', label: 'Titanium' },
  { value: 'zirconium', label: 'Zirconium' },
  { value: 'cast_iron', label: 'Cast Iron' },
  { value: 'zinc', label: 'Zinc' },
  { value: 'brass', label: 'Brass' },
  { value: 'copper', label: 'Copper' },
  { value: 'columbium_niobium', label: 'Columbium (Niobium)' },
  { value: 'molybdenum', label: 'Molybdenum' },
  { value: 'lead', label: 'Lead' },
  { value: 'silver', label: 'Silver' },
  { value: 'tantalum', label: 'Tantalum' },
  { value: 'tungsten', label: 'Tungsten' },
  { value: 'gold', label: 'Gold' },
];

export const SHAPE_OPTIONS = [
  {
    value: 'round_bar',
    label: 'Round Bar',
    fields: [
      { key: 'diameter', label: 'Diameter', defaultUnit: 'in' },
      { key: 'length', label: 'Length', defaultUnit: 'in' },
    ],
  },
  {
    value: 'square_bar',
    label: 'Square Bar',
    fields: [
      { key: 'width', label: 'Width', defaultUnit: 'in' },
      { key: 'thickness', label: 'Thickness', defaultUnit: 'in' },
      { key: 'length', label: 'Length', defaultUnit: 'in' },
    ],
  },
  {
    value: 'hexagonal_bar',
    label: 'Hexagonal Bar',
    fields: [
      { key: 'across_flats', label: 'Across Flats (AF)', defaultUnit: 'in' },
      { key: 'length', label: 'Length', defaultUnit: 'in' },
    ],
  },
  {
    value: 'octagonal_bar',
    label: 'Octagonal Bar',
    fields: [
      { key: 'across_flats', label: 'Across Flats (AF)', defaultUnit: 'in' },
      { key: 'length', label: 'Length', defaultUnit: 'in' },
    ],
  },
  {
    value: 'flat_bar',
    label: 'Flat Bar',
    fields: [
      { key: 'width', label: 'Width', defaultUnit: 'in' },
      { key: 'thickness', label: 'Thickness', defaultUnit: 'in' },
      { key: 'length', label: 'Length', defaultUnit: 'in' },
    ],
  },
  {
    value: 'sheet',
    label: 'Sheet',
    fields: [
      { key: 'thickness', label: 'Thickness', defaultUnit: 'in' },
      { key: 'width', label: 'Width', defaultUnit: 'in' },
      { key: 'length', label: 'Length', defaultUnit: 'in' },
    ],
  },
  {
    value: 'plate',
    label: 'Plate',
    fields: [
      { key: 'thickness', label: 'Thickness', defaultUnit: 'in' },
      { key: 'width', label: 'Width', defaultUnit: 'in' },
      { key: 'length', label: 'Length', defaultUnit: 'in' },
    ],
  },
  {
    value: 'tubular',
    label: 'Tubular (Tube / Pipe)',
    fields: [
      { key: 'outside_diameter', label: 'Outside Diameter (OD)', defaultUnit: 'in' },
      { key: 'wall_thickness', label: 'Wall Thickness', defaultUnit: 'in' },
      { key: 'length', label: 'Length', defaultUnit: 'in' },
    ],
  },
  {
    value: 'circular',
    label: 'Circular Disk',
    fields: [
      { key: 'diameter', label: 'Diameter', defaultUnit: 'in' },
      { key: 'thickness', label: 'Thickness', defaultUnit: 'in' },
    ],
  },
  {
    value: 'ring',
    label: 'Ring',
    fields: [
      { key: 'outside_diameter', label: 'Outside Diameter (OD)', defaultUnit: 'in' },
      { key: 'inside_diameter', label: 'Inside Diameter (ID)', defaultUnit: 'in' },
      { key: 'thickness', label: 'Thickness', defaultUnit: 'in' },
    ],
  },
];

export const DEFAULT_ALLOY = 'steel';
export const DEFAULT_SHAPE = 'round_bar';
export const DEFAULT_PIECES = 1;
