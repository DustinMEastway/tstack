import { Type } from '@angular/core';

export interface IControllerConfiguration<T> {
	entityType: Type<T>;
	path: string;
}
