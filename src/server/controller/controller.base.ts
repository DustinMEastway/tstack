import { Type } from '@angular/core';
import * as express from 'express';

import { ControllerConfiguration } from './controller-configuration';

export class ControllerBase<T> {
	protected _entityType: Type<T>;
	protected _path: string;
	private _configuration: ControllerConfiguration<T>;

	get configuration(): ControllerConfiguration<T> {
		return this._configuration;
	}
	set configuration(configuration: ControllerConfiguration<T>) {
		this._configuration = configuration;
	}

	constructor(configuration?: ControllerConfiguration<T>) {
		this.configuration = configuration;
	}
}
