import { Type } from '@angular/core';
import * as express from 'express';

import { IControllerConfiguration, ControllerConfiguration } from 'dme-modules/server';

export class ControllerBase<T> {
	protected _entityType: Type<T>;
	protected _path: string;
	private _configuration: IControllerConfiguration<T>;

	get configuration(): IControllerConfiguration<T> {
		return this._configuration;
	}
	set configuration(configuration: IControllerConfiguration<T>) {
		this._configuration = ControllerConfiguration.createFromInterface(configuration);
	}

	constructor(configuration?: IControllerConfiguration<T>) {
		if (configuration != null) { this.configuration = configuration; }
	}
}
