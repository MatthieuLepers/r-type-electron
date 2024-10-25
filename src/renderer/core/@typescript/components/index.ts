import AttachedEntities from '@renderer/core/@typescript/components/AttachedEntities';
import ChargedShooter from '@renderer/core/@typescript/components/ChargedShooter';
import Controller from '@renderer/core/@typescript/components/Controller';
import Cooldown from '@renderer/core/@typescript/components/Cooldown';
import Debug from '@renderer/core/@typescript/components/Debug';
import EventEmitter from '@renderer/core/@typescript/components/EventEmitter';
import Health from '@renderer/core/@typescript/components/Health';
import Locomotor from '@renderer/core/@typescript/components/Locomotor';
import Looker from '@renderer/core/@typescript/components/Looker';
import LootDropper from '@renderer/core/@typescript/components/LootDropper';
import Physics from '@renderer/core/@typescript/components/Physics';
import RocketLauncher from '@renderer/core/@typescript/components/RocketLauncher';
import ScoreBoard from '@renderer/core/@typescript/components/ScoreBoard';
import Shooter from '@renderer/core/@typescript/components/Shooter';
import SoundEmitter from '@renderer/core/@typescript/components/SoundEmitter';
import Sprite from '@renderer/core/@typescript/components/Sprite';
import Synchronizer from '@renderer/core/@typescript/components/Synchronizer';
import Transform from '@renderer/core/@typescript/components/Transform';
import WaveGenerator from '@renderer/core/@typescript/components/WaveGenerator';

export type Components = {
  attachedentities: AttachedEntities,
  chargedshooter: ChargedShooter,
  controller: Controller,
  cooldown: Cooldown<any>,
  debug: Debug,
  eventemitter: EventEmitter<any>,
  health: Health,
  locomotor: Locomotor,
  looker: Looker,
  lootdropper: LootDropper,
  physics: Physics,
  rocketlauncher: RocketLauncher,
  scoreboard: ScoreBoard,
  shooter: Shooter,
  soundemitter: SoundEmitter,
  sprite: Sprite,
  synchronizer: Synchronizer,
  transform: Transform,
  wavegenerator: WaveGenerator,
};

export type ComponentsKeys = keyof Components;

export type ComponentsValues = Components[ComponentsKeys];
