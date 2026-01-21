import pipeRound from '../assets/shape-diagrams/pipe_round.svg';
import pipeSquare from '../assets/shape-diagrams/pipe_square.svg';
import pipeRectangular from '../assets/shape-diagrams/pipe_rectangular.svg';
import angleEqual from '../assets/shape-diagrams/angle_equal.svg';
import angleUnequal from '../assets/shape-diagrams/angle_unequal.svg';
import channelC from '../assets/shape-diagrams/channel_c.svg';
import channelU from '../assets/shape-diagrams/channel_u.svg';
import beamI from '../assets/shape-diagrams/beam_i.svg';
import beamT from '../assets/shape-diagrams/beam_t.svg';
import flatBar from '../assets/shape-diagrams/flat_bar.svg';
import roundBar from '../assets/shape-diagrams/round_bar.svg';
import sheet from '../assets/shape-diagrams/sheet.svg';
import squareBar from '../assets/shape-diagrams/square_bar.svg';
import rebar from '../assets/shape-diagrams/rebar.svg';
import boltHex from '../assets/shape-diagrams/bolt_hex.svg';
import nutHex from '../assets/shape-diagrams/nut_hex.svg';
import screwMachine from '../assets/shape-diagrams/screw_machine.svg';
import noDiagram from '../assets/shape-diagrams/no_diagram.svg';

export const shapeDiagramMap = {
  pipe_round: {
    label: 'Round Pipe Diagram',
    src: pipeRound,
    alt: 'Round pipe dimensions diagram',
  },
  pipe_square: {
    label: 'Square Pipe Diagram',
    src: pipeSquare,
    alt: 'Square pipe dimensions diagram',
  },
  pipe_rectangular: {
    label: 'Rectangular Pipe Diagram',
    src: pipeRectangular,
    alt: 'Rectangular pipe dimensions diagram',
  },
  angle_equal: {
    label: 'Equal Angle Diagram',
    src: angleEqual,
    alt: 'Equal angle dimensions diagram',
  },
  angle_unequal: {
    label: 'Unequal Angle Diagram',
    src: angleUnequal,
    alt: 'Unequal angle dimensions diagram',
  },
  channel_c: {
    label: 'Channel C Diagram',
    src: channelC,
    alt: 'Channel C dimensions diagram',
  },
  channel_u: {
    label: 'Channel U Diagram',
    src: channelU,
    alt: 'Channel U dimensions diagram',
  },
  beam_i: {
    label: 'I Beam Diagram',
    src: beamI,
    alt: 'I beam dimensions diagram',
  },
  beam_t: {
    label: 'T Beam Diagram',
    src: beamT,
    alt: 'T beam dimensions diagram',
  },
  flat_bar: {
    label: 'Flat Bar Diagram',
    src: flatBar,
    alt: 'Flat bar dimensions diagram',
  },
  round_bar: {
    label: 'Round Bar Diagram',
    src: roundBar,
    alt: 'Round bar dimensions diagram',
  },
  sheet: {
    label: 'Sheet Diagram',
    src: sheet,
    alt: 'Sheet thickness and width diagram',
  },
  square_bar: {
    label: 'Square Bar Diagram',
    src: squareBar,
    alt: 'Square bar dimensions diagram',
  },
  rebar: {
    label: 'Rebar Diagram',
    src: rebar,
    alt: 'Rebar diameter diagram',
  },
  bolt_hex: {
    label: 'Hex Bolt Diagram',
    src: boltHex,
    alt: 'Hex bolt dimensions diagram',
  },
  nut_hex: {
    label: 'Hex Nut Diagram',
    src: nutHex,
    alt: 'Hex nut dimensions diagram',
  },
  screw_machine: {
    label: 'Machine Screw Diagram',
    src: screwMachine,
    alt: 'Machine screw dimensions diagram',
  },
};

export const defaultShapeDiagram = {
  label: 'No diagram available',
  src: noDiagram,
  alt: 'No diagram available',
};
