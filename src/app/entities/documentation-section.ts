import { Entity } from '@tstack/core';

import { ComponentSelector } from './component-selector';

export class DocumentationSection extends Entity {
	/** @property componentSelector for the component to dynamically create in the section */
	componentSelector?: ComponentSelector;
	/** @property data to pass into the dynamically created component */
	data?: any;
	/** @property description paragraph describing the section */
	description?: string;
	/** @property display determines if the section is visible */
	display?: boolean;
	/** @property title to display at the top of the section */
	title: string;
}
