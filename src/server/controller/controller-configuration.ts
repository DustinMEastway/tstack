import { Type } from '@angular/core';

import { mapProperties } from '../../core';

/**
 * configuration for a controller of an api endpoint
 */
export interface ControllerConfiguration<T> {
	/** @property {Type<T>} entityType for the controller to work with */
	entityType: Type<T>;

	/** @property {string} path to the base api endpoint */
	path: string;
}
