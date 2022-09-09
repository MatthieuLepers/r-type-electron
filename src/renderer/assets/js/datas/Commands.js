import DebugDrawPathCommand from './Commands/debug/DrawPath';
import DebugDrawHitboxCommand from './Commands/debug/DrawHitbox';
import DebugDrawQuadTreeCommand from './Commands/debug/DrawQuadTree';
import DebugDrawHealthBarsCommand from './Commands/debug/DrawHealthBars';

export default {
  debug: {
    drawPath: {
      usage: 'debug.drawPath <boolean>',
      argumentSuggestions: {
        arg0: () => ['true', 'false', '1', '0'],
      },
      clazz: DebugDrawPathCommand,
    },
    drawHitbox: {
      usage: 'debug.drawHitbox <boolean>',
      argumentSuggestions: {
        arg0: () => ['true', 'false', '1', '0'],
      },
      clazz: DebugDrawHitboxCommand,
    },
    drawQuadTree: {
      usage: 'debug.drawQuadTree <boolean>',
      argumentSuggestions: {
        arg0: () => ['true', 'false', '1', '0'],
      },
      clazz: DebugDrawQuadTreeCommand,
    },
    drawHealthBars: {
      usage: 'debug.drawHealthBars <boolean>',
      argumentSuggestions: {
        arg0: () => ['true', 'false', '1', '0'],
      },
      clazz: DebugDrawHealthBarsCommand,
    },
  },
};
