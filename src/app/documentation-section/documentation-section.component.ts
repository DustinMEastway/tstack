import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { TskDynamicContentComponent } from '@tstack/client';
import { BehaviorSubject } from 'rxjs';

import { DocumentationSection } from 'app/entities';

@Component({
	selector: 'app-documentation-section',
	templateUrl: './documentation-section.component.html',
	styleUrls: ['./documentation-section.component.scss']
})
export class DocumentationSectionComponent implements OnInit {
	@ViewChild(TskDynamicContentComponent) componentContainer: TskDynamicContentComponent;
	private _section = new BehaviorSubject<DocumentationSection>(null);

	@Input()
	get section(): DocumentationSection {
		return this._section.value;
	}
	set section(section: DocumentationSection) {
		this._section.next(section);
	}

	constructor() {}

	ngOnInit(): void {
		this._section.subscribe(() => {
			// TODO: set up the dynamically generated component
		});
	}
}
