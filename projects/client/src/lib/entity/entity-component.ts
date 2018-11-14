import { Input } from '@angular/core';
import { Entity } from '@tstack/core';

import { EntityComponentMode } from './entity-component-mode';

/** component used to add, edit & view an entity */
export class EntityComponent {
	/** @prop entity to add, edit or view */
	@Input() entity: Entity;

	/** @prop mode to interact with the entity in */
	@Input() mode: EntityComponentMode;
}
