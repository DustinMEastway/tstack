import { Component, Input } from '@angular/core';

import { PropertyDescriptions } from './property-descriptions';

@Component({
	selector: 'app-property-descriptions',
	templateUrl: './property-descriptions.component.html',
	styleUrls: ['./property-descriptions.component.scss']
})
export class PropertyDescriptionsComponent {
	@Input() properties: PropertyDescriptions[];
}
