import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { TskDynamicContentComponent } from '@tstack/client';
import { BehaviorSubject } from 'rxjs';

import { DocumentationSection } from 'app/entities';
import { DynamicContentService } from 'app/services';

@Component({
	selector: 'app-documentation-section',
	templateUrl: './documentation-section.component.html',
	styleUrls: ['./documentation-section.component.scss']
})
export class DocumentationSectionComponent implements OnInit {
	@ViewChild(TskDynamicContentComponent) componentContainer: TskDynamicContentComponent;
	private _section = new BehaviorSubject<DocumentationSection>(null);

	get isDisplayed(): boolean {
		return this.section.display !== false;
	}

	@Input()
	get section(): DocumentationSection {
		return this._section.value;
	}
	set section(section: DocumentationSection) {
		this._section.next(section);
	}

	constructor(private _dynamicContentService: DynamicContentService) {}

	ngOnInit(): void {
		this._section.subscribe(section => {
			if (this.isDisplayed && section.componentSelector) {
				this._dynamicContentService.setComponentBySelector(
					this.componentContainer,
					section.componentSelector,
					section.data
				);
			}
		});
	}
}
