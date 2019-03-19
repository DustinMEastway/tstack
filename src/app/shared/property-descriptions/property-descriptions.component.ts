import { Component, Input } from '@angular/core';

import { PropertyDescription } from 'app/entities';

@Component({
	selector: 'app-property-descriptions',
	templateUrl: './property-descriptions.component.html',
	styleUrls: ['./property-descriptions.component.scss']
})
export class PropertyDescriptionsComponent {
	@Input() properties: PropertyDescription[];
}
