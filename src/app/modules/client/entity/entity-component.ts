import { Input } from '@angular/core';

import { Entity } from '../../core/entity';
import { EntityComponentMode } from './entity-component-mode';

/** component used to add, edit & view an entity */
export class EntityComponent {
	/** @property entity to add, edit or view */
	@Input() entity: Entity;

	/** @property mode to interact with the entity in */
	@Input() mode: EntityComponentMode;
}
