import { Entity } from '@tstack/core';

import { DocumentationSection } from './documentation-section';

export class Documentation extends Entity {
	title: string;
	description?: string;
	sections?: DocumentationSection[];
}
