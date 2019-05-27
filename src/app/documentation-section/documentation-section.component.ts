import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-documentation-section',
	templateUrl: './documentation-section.component.html',
	styleUrls: ['./documentation-section.component.scss']
})
export class DocumentationSectionComponent {
	@Input() section: any;
}
