import { Input } from '@angular/core';

import { Entity } from 'dme-modules/core';

import { EntityComponentMode } from './entity-component-mode';

export abstract class EntityComponent<EntityType extends Entity> {
	/**
	 * entity to add, edit or view
	 */
	@Input() entity: Entity;

	/**
	 * mode to interact with the entity in
	 */
	@Input() mode: EntityComponentMode;
}
