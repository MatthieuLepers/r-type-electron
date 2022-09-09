import Global from './stores/AppStore';
import Canvas from './Canvas';
import ScoreBoard from './ScoreBoard';
import EntityScript from './classes/prefabs/EntityScript';

import Random from './classes/Random';

import Runnable from './classes/runnable/Runnable';
import PhysicRunnable from './classes/runnable/PhysicRunnable';

import QuadTree from './classes/geometry/QuadTree';

import PlayerShip from './classes/prefabs/PlayerShip';
import Module from './classes/prefabs/Module';

// import PataPata from './classes/prefabs/enemies/PataPata';
// import BugSpawner from './classes/prefabs/enemies/BugSpawner';
// import Mid from './classes/prefabs/enemies/Mid';
// import Cheetah from './classes/prefabs/enemies/Cheetah';
// import Cytron from './classes/prefabs/enemies/Cytron';
import PowerArmor from './classes/prefabs/enemies/PowerArmor';

import WaveGenerator from './classes/components/WaveGenerator';
// import CompilerBoss from './classes/prefabs/enemies/bosses/CompilerBoss';

/**
 * @author Matthieu LEPERS
 * @version 1.0.0
 */
export default class Game extends EntityScript {
  /**
   * @constructor
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    super();
    this.canvasObj = new Canvas(canvas);
    this.random = new Random();
    this.scoreboard = new ScoreBoard();
    this.entities = {};
    this.quadTree = new QuadTree(0, this.canvasObj.getBounds());
    this.quadTree.clear();

    this.addComponent(WaveGenerator, Game);

    this.canvasObj.init();
    Global.Engine.physicRunnable = new PhysicRunnable();
    Global.Game = this;
  }

  /**
   * @return {HTMLCanvasElement}
   */
  get canvas() {
    return this.canvasObj.canvas;
  }

  /**
   * @return {CanvasRenderingContext2D}
   */
  get ctx() {
    return this.canvasObj.ctx;
  }

  /**
   * @param {Point} position
   * @param {Number} radius
   * @param {...String} tags
   * @return {EntityScript[]}
   */
  findEntities(position, radius, ...tags) {
    return this.findEntitiesByTags(...tags)
      .filter((entity) => Math.sqrt((entity.components.transform.position.x - position.x) ** 2 + (entity.components.transform.position.y - position.y) ** 2) < radius)
    ;
  }

  /**
   * @param  {...String} tags
   * @return {EntityScript[]}
   */
  findEntitiesByTags(...tags) {
    return Object
      .values(this.entities)
      .filter((entity) => entity.hasTag(...tags))
    ;
  }

  /**
   * @param  {...String} tags
   * @return {EntityScript|null}
   */
  findFirstEntityByTags(...tags) {
    const [first] = this.findEntitiesByTags(...tags);
    return first ?? null;
  }

  /**
   * @return {Number}
   */
  uniqid() {
    return Global.Engine.FRAME;
  }

  /**
   * @return {PlayerShip}
   */
  getPlayerList() {
    return Object.values(this.entities).filter((entity) => entity.hasTag('player')
      && !entity.hasTag('isDead')
      && entity.hasComponent('Controller'))
    ;
  }

  start() {
    Global.Engine.resume();
    Global.Engine.addRunnable(new Runnable('rendering', () => this.canvasObj.render(this.canvasObj)));
    Global.Engine.addRunnable(new Runnable('fps', () => {
      this.canvasObj.fillText(Global.Engine.FPS, this.canvas.width - 30, 30, { fontSize: 20, fontFamily: 'Roboto', color: Global.Engine.FPS_COLOR });
    }));

    PlayerShip.new('player1').spawn();
    Module.new().spawn();

    // setTimeout(() => this.components.wavegenerator.generateNextWave(), 2000);
    // PataPata.new().spawn();
    // BugSpawner.new().spawn();
    // Mid.new().spawn();
    // Cheetah.new().spawn();
    // Cytron.new().spawn();
    // PowerArmor.new().spawn();
    setInterval(() => {
      if (!Global.Engine.paused) PowerArmor.new().spawn();
    }, 2000);
    // CompilerBoss.new().spawn();
  }

  reset() {
    Object.values(this.entities).forEach((entity) => { entity.despawn(); });
    Global.Engine.removeRunnableByName('rendering');
    Global.Engine.removeRunnableByName('fps');
    Global.Engine.physicRunnable = null;
    Global.Game = null;
  }
}
