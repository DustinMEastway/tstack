import { Entity } from '@tstack/core';

import { ComponentSelector } from './component-selector';

export class DocumentationSection extends Entity {
	componentSelector?: ComponentSelector;
	data?: any;
	description?: string;
	title: string;
}
