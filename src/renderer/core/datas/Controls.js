export default {
  UP: {
    key: 'z',
    button: 4,
    axis: 1,
  },
  LEFT: {
    key: 'q',
    button: 7,
    axis: 0,
  },
  DOWN: {
    key: 's',
    button: 6,
    axis: 1,
  },
  RIGHT: {
    key: 'd',
    button: 5,
    axis: 0,
  },
  SHOOT: {
    key: 'l',
    button: 14,
  },
  CHARGE: {
    key: 'm',
    button: 13,
  },
  MODULE: {
    key: ' ',
    button: 15,
  },
  PAUSE: {
    key: 'Escape',
    button: 3,
  },
  DEV_TOOLS: {
    key: api.plateform !== 'darwin' ? '²' : '@',
  },
  DEBUG_TOGGLE_DRAW_HITBOXES: {
    key: '&',
  },
  DEBUG_TOGGLE_DRAW_QUADTREE: {
    key: 'é',
  },
  DEBUG_TOGGLE_DRAW_PATHLINES: {
    key: '"',
  },
  DEBUG_TOGGLE_DRAW_HEALTH_BARS: {
    key: '\'',
  },
};
