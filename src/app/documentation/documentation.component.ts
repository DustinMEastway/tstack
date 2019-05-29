import { Component, Input } from '@angular/core';

import { Documentation } from 'app/entities';

@Component({
	selector: 'app-documentation',
	templateUrl: './documentation.component.html',
	styleUrls: ['./documentation.component.scss']
})
export class DocumentationComponent {
	@Input() documentation: Documentation;
}
