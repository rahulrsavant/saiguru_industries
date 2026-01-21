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
    labelKey: 'diagram.pipeRound.label',
    src: pipeRound,
    altKey: 'diagram.pipeRound.alt',
  },
  pipe_square: {
    labelKey: 'diagram.pipeSquare.label',
    src: pipeSquare,
    altKey: 'diagram.pipeSquare.alt',
  },
  pipe_rectangular: {
    labelKey: 'diagram.pipeRectangular.label',
    src: pipeRectangular,
    altKey: 'diagram.pipeRectangular.alt',
  },
  angle_equal: {
    labelKey: 'diagram.angleEqual.label',
    src: angleEqual,
    altKey: 'diagram.angleEqual.alt',
  },
  angle_unequal: {
    labelKey: 'diagram.angleUnequal.label',
    src: angleUnequal,
    altKey: 'diagram.angleUnequal.alt',
  },
  channel_c: {
    labelKey: 'diagram.channelC.label',
    src: channelC,
    altKey: 'diagram.channelC.alt',
  },
  channel_u: {
    labelKey: 'diagram.channelU.label',
    src: channelU,
    altKey: 'diagram.channelU.alt',
  },
  beam_i: {
    labelKey: 'diagram.beamI.label',
    src: beamI,
    altKey: 'diagram.beamI.alt',
  },
  beam_t: {
    labelKey: 'diagram.beamT.label',
    src: beamT,
    altKey: 'diagram.beamT.alt',
  },
  flat_bar: {
    labelKey: 'diagram.flatBar.label',
    src: flatBar,
    altKey: 'diagram.flatBar.alt',
  },
  round_bar: {
    labelKey: 'diagram.roundBar.label',
    src: roundBar,
    altKey: 'diagram.roundBar.alt',
  },
  sheet: {
    labelKey: 'diagram.sheet.label',
    src: sheet,
    altKey: 'diagram.sheet.alt',
  },
  square_bar: {
    labelKey: 'diagram.squareBar.label',
    src: squareBar,
    altKey: 'diagram.squareBar.alt',
  },
  rebar: {
    labelKey: 'diagram.rebar.label',
    src: rebar,
    altKey: 'diagram.rebar.alt',
  },
  bolt_hex: {
    labelKey: 'diagram.boltHex.label',
    src: boltHex,
    altKey: 'diagram.boltHex.alt',
  },
  nut_hex: {
    labelKey: 'diagram.nutHex.label',
    src: nutHex,
    altKey: 'diagram.nutHex.alt',
  },
  screw_machine: {
    labelKey: 'diagram.screwMachine.label',
    src: screwMachine,
    altKey: 'diagram.screwMachine.alt',
  },
};

export const defaultShapeDiagram = {
  labelKey: 'diagram.default.label',
  src: noDiagram,
  altKey: 'diagram.default.alt',
};
