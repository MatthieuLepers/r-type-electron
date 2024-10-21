import type { IAttachedEntities } from '@renderer/core/classes/components/typescript/AttachedEntities/i';
import type { IEventEmitter } from '@renderer/core/classes/components/typescript/EventEmitter/i';
import type { IChargedShooter } from '@renderer/core/classes/components/typescript/ChargedShooter/i';
import type { IController } from '@renderer/core/classes/components/typescript/Controller/i';
import type { ICooldown } from '@renderer/core/classes/components/typescript/Cooldown/i';
import type { IDebug } from '@renderer/core/classes/components/typescript/Debug/i';
import type { IHealth } from '@renderer/core/classes/components/typescript/Health/i';
import type { ILocomotor } from '@renderer/core/classes/components/typescript/Locomotor/i';
import type { ILooker } from '@renderer/core/classes/components/typescript/Looker/i';
import type { ILootDropper } from '@renderer/core/classes/components/typescript/LootDropper/i';
import type { IPhysics } from '@renderer/core/classes/components/typescript/Physics/i';
import type { IRocketLauncher } from '@renderer/core/classes/components/typescript/RocketLauncher/i';
import type { IScoreBoard } from '@renderer/core/classes/components/typescript/ScoreBoard/i';
import type { IShooter } from '@renderer/core/classes/components/typescript/Shooter/i';
import type { ISoundEmitter } from '@renderer/core/classes/components/typescript/SoundEmitter/i';
import type { ISprite } from '@renderer/core/classes/components/typescript/Sprite/i';
import type { ISynchronizer } from '@renderer/core/classes/components/typescript/Synchronizer/i';
import type { ITransform } from '@renderer/core/classes/components/typescript/Transform/i';
import type { IWaveGenerator } from '@renderer/core/classes/components/typescript/WaveGenerator/i';
import type EntityScript from '@renderer/core/classes/prefabs/EntityScript';
import type PhysicEntityScript from '@renderer/core/classes/prefabs/PhysicEntityScript';

export type TEntityScript = EntityScript
& IAttachedEntities
& IEventEmitter
& IChargedShooter
& IController
& ICooldown
& IDebug
& IHealth
& ILocomotor
& ILooker
& ILootDropper
& IRocketLauncher
& IScoreBoard
& IShooter
& ISoundEmitter
& ISprite
& ISynchronizer
& ITransform
& IWaveGenerator
;

export type TPhysicEntityScript = PhysicEntityScript
& IAttachedEntities
& IEventEmitter
& IChargedShooter
& IController
& ICooldown
& IDebug
& IHealth
& ILocomotor
& ILooker
& ILootDropper
& IPhysics
& IRocketLauncher
& IScoreBoard
& IShooter
& ISoundEmitter
& ISprite
& ISynchronizer
& ITransform
& IWaveGenerator
;
