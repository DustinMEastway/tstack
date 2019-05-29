import { Component, Input } from '@angular/core';

import { DocumentationSection } from 'app/entities';

@Component({
	selector: 'app-documentation-section',
	templateUrl: './documentation-section.component.html',
	styleUrls: ['./documentation-section.component.scss']
})
export class DocumentationSectionComponent {
	@Input() section: DocumentationSection;
}
