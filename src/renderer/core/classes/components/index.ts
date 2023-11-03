import AttachedEntities from '@renderer/core/classes/components/AttachedEntities';
import ChargedShooter from '@renderer/core/classes/components/ChargedShooter';
import Controller from '@renderer/core/classes/components/Controller';
import Cooldown from '@renderer/core/classes/components/Cooldown';
import Debug from '@renderer/core/classes/components/Debug';
import EventEmitter from '@renderer/core/classes/components/EventEmitter';
import Health from '@renderer/core/classes/components/Health';
import Locomotor from '@renderer/core/classes/components/Locomotor';
import Looker from '@renderer/core/classes/components/Looker';
import LootDropper from '@renderer/core/classes/components/LootDropper';
import Physics from '@renderer/core/classes/components/Physics';
import RocketLauncher from '@renderer/core/classes/components/RocketLauncher';
import ScoreBoard from '@renderer/core/classes/components/ScoreBoard';
import Shooter from '@renderer/core/classes/components/Shooter';
import SoundEmitter from '@renderer/core/classes/components/SoundEmitter';
import Sprite from '@renderer/core/classes/components/Sprite';
import Transform from '@renderer/core/classes/components/Transform';
import WaveGenerator from '@renderer/core/classes/components/WaveGenerator';

export type Components = {
  attachedentities: AttachedEntities,
  chargedshooter: ChargedShooter,
  controller: Controller,
  cooldown: Cooldown,
  debug: Debug,
  eventemitter: EventEmitter,
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
  transform: Transform,
  wavegenerator: WaveGenerator,
};

export type ComponentsKeys = keyof Components;

export type ComponentsValues = Components[ComponentsKeys];
