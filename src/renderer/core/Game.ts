import Global from '@renderer/core/stores/AppStore';
import Canvas from '@renderer/core/Canvas';
import ScoreBoard from '@renderer/core/ScoreBoard';
import { mix } from '@renderer/core/@types/Mixable';

import Class from '@renderer/core/@typescript/Class';
import { EventEmitterMixin } from '@renderer/core/@typescript/components/EventEmitter/mixin';
import { SoundEmitterMixin } from '@renderer/core/@typescript/components/SoundEmitter/mixin';
import { WaveGeneratorMixin } from '@renderer/core/@typescript/components/WaveGenerator/mixin';
import Runnable from '@renderer/core/@typescript/runnable/Runnable';
import PhysicRunnable from '@renderer/core/@typescript/runnable/PhysicRunnable';
import type EntityScript from '@renderer/core/@typescript/prefabs/EntityScript';
import PlayerShip from '@renderer/core/@typescript/prefabs/PlayerShip';
import Module from '@renderer/core/@typescript/prefabs/Module';
import PowerArmor from '@renderer/core/@typescript/prefabs/enemies/PowerArmor';
import type Point from '@renderer/core/@typescript/geometry/Point';
import QuadTree from '@renderer/core/@typescript/geometry/QuadTree';

export default class Game extends mix(Class)
  .with(EventEmitterMixin)
  .with(SoundEmitterMixin)
  .with(WaveGeneratorMixin) {
  public canvasObj: Canvas;

  public scoreboard: ScoreBoard = new ScoreBoard();

  public entities: Record<string, EntityScript> = {};

  public quadTree: QuadTree;

  constructor(canvas: HTMLCanvasElement) {
    super();
    this.canvasObj = new Canvas(canvas);
    this.quadTree = new QuadTree(0, this.canvasObj.getBounds());
    this.quadTree.clear();

    Global.Engine.physicRunnable = new PhysicRunnable();
    Global.Game = this;

    this.on('gameOver', () => {
      this.playSound('ambient/gameover');
      this.components.wavegenerator.enabled = false;
    });
  }

  get canvas(): HTMLCanvasElement {
    return this.canvasObj.canvas;
  }

  get ctx(): CanvasRenderingContext2D {
    return this.canvasObj.ctx;
  }

  findEntities(position: Point, radius: number, ...tags: Array<string>): Array<EntityScript> {
    return this.findEntitiesByTags(...tags)
      .filter((entity) => Math.sqrt((entity.components.transform.position.x - position.x) ** 2 + (entity.components.transform.position.y - position.y) ** 2) < radius)
    ;
  }

  findEntitiesByTags(...tags: Array<string>): Array<EntityScript> {
    return Object
      .values(this.entities)
      .filter((entity) => entity.hasTag(...tags))
    ;
  }

  findFirstEntityByTags(...tags: Array<string>): EntityScript | null {
    const [first] = this.findEntitiesByTags(...tags);
    return first ?? null;
  }

  uniqid(): number {
    return Global.Engine.FRAME;
  }

  getPlayerList(): Array<PlayerShip> {
    return Object
      .values(this.entities)
      .filter((entity) => entity.hasTag('player') && !entity.hasTag('isDead') && entity.hasComponent('Controller')) as Array<PlayerShip>
    ;
  }

  start() {
    Global.Engine.resume();
    Global.Engine.addRunnable(new Runnable('rendering', () => this.canvasObj.render(), true));
    Global.Engine.addRunnable(new Runnable('fps', () => {
      this.canvasObj.fillText(Global.Engine.FPS.toString(), this.canvas.width - 30, 30, {
        fontSize: '20',
        fontFamily: 'Roboto',
        color: Global.Engine.FPS_COLOR,
      });
    }));

    new PlayerShip('player1').spawn();
    new Module().spawn();

    setTimeout(() => {
      this.components.wavegenerator.generateNextWave();
      new PowerArmor().spawn();
    }, 2000);
  }

  reset() {
    Object.values(this.entities).forEach((entity) => { entity.despawn(); });
    Global.Engine.removeRunnableByName('rendering');
    Global.Engine.removeRunnableByName('fps');
    Global.Engine.removeRunnableByName('debug');
    Global.Engine.physicRunnable = null;
    Global.Game = null;
    this.components.wavegenerator.enabled = true;
  }
}
