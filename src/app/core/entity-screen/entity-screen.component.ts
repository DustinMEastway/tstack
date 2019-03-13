import { Component } from '@angular/core';

import { PropertyDescriptions } from 'app/shared/property-descriptions/property-descriptions';

const staticProperties: PropertyDescriptions[] = [
	{
		name: 'cast',
		description: 'Cast can be used to convert an object, or an array of objects into the given type'
	},
	{
		name: 'clone',
		description: 'Clone assigns values from the provided object to the entity allowing you to assign values on construction'
	}
];

@Component({
	selector: 'app-entity-screen',
	templateUrl: './entity-screen.component.html',
	styleUrls: ['./entity-screen.component.scss']
})
export class EntityScreenComponent {
	get staticProperties(): PropertyDescriptions[] {
		return staticProperties;
	}
}
