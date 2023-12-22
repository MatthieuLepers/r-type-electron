import { reactive } from 'vue';

import Global from '@renderer/core/stores/AppStore';
import Canvas from '@renderer/core/Canvas';
import ScoreBoard from '@renderer/core/ScoreBoard';
import EntityScript from '@renderer/core/classes/prefabs/EntityScript';

import Random from '@renderer/core/classes/Random';

import Runnable from '@renderer/core/classes/runnable/Runnable';
import PhysicRunnable from '@renderer/core/classes/runnable/PhysicRunnable';

import QuadTree from '@renderer/core/classes/geometry/QuadTree';

import PlayerShip from '@renderer/core/classes/prefabs/PlayerShip';
import Module from '@renderer/core/classes/prefabs/Module';

// import PataPata from '@renderer/core/classes/prefabs/enemies/PataPata';
// import BugSpawner from '@renderer/core/classes/prefabs/enemies/BugSpawner';
// import Mid from '@renderer/core/classes/prefabs/enemies/Mid';
// import Cheetah from '@renderer/core/classes/prefabs/enemies/Cheetah';
// import Cytron from '@renderer/core/classes/prefabs/enemies/Cytron';
import PowerArmor from '@renderer/core/classes/prefabs/enemies/PowerArmor';

import WaveGenerator from '@renderer/core/classes/components/WaveGenerator';
// import CompilerBoss from '@renderer/core/classes/prefabs/enemies/bosses/CompilerBoss';

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
    this.entities = reactive({});
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
    return Object
      .values(this.entities)
      .filter((entity) => entity.hasTag('player') && !entity.hasTag('isDead') && entity.hasComponent('Controller'))
    ;
  }

  start() {
    Global.Engine.resume();
    Global.Engine.addRunnable(new Runnable('rendering', () => this.canvasObj.render(this.canvasObj), true));
    Global.Engine.addRunnable(new Runnable('fps', () => {
      this.canvasObj.fillText(Global.Engine.FPS, this.canvas.width - 30, 30, { fontSize: 20, fontFamily: 'Roboto', color: Global.Engine.FPS_COLOR });
    }), true);

    PlayerShip.new('player1').spawn();
    Module.new().spawn();

    setTimeout(() => {
      this.components.wavegenerator.generateNextWave();
      PowerArmor.new().spawn();
    }, 2000);
    // PataPata.new().spawn();
    // BugSpawner.new().spawn();
    // Mid.new().spawn();
    // Cheetah.new().spawn();
    // Cytron.new().spawn();
    // PowerArmor.new().spawn();
    // setInterval(() => {
    //   if (!Global.Engine.paused && !Global.devToolsOpen) PowerArmor.new().spawn();
    // }, 2000);
    // CompilerBoss.new().spawn();
  }

  reset() {
    Object.values(this.entities).forEach((entity) => { entity.despawn(); });
    Global.Engine.removeRunnableByName('rendering');
    Global.Engine.removeRunnableByName('fps');
    Global.Engine.removeRunnableByName('debug');
    Global.Engine.physicRunnable = null;
    Global.Game = null;
  }
}
