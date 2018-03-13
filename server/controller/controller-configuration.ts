import { Type } from '@angular/core';

import { mapProperties } from 'dme-modules/core';
import { IControllerConfiguration } from 'dme-modules/server';

export class ControllerConfiguration<T> implements IControllerConfiguration<T> {
	entityType: Type<T>;
	path: string;

	constructor(configuration?: IControllerConfiguration<T>) {
		if (configuration != null) { Object.assign(this, configuration); }
	}

	static createFromInterface<T>(configuration?: IControllerConfiguration<T>): ControllerConfiguration<T> {
		return new this(configuration);
	}
}
