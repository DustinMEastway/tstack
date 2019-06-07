import { Injectable } from '@angular/core';
import { TskDynamicContentComponent } from '@tstack/client';

import { ComponentSelector } from 'app/entities';
import { LinkComponent } from 'app/link/link.component';
import { MarkdownComponent } from 'app/markdown/markdown.component';
import { TableComponent } from 'app/table/table.component';

@Injectable({
	providedIn: 'root'
})
export class DynamicContentService {
	getComponentBySelector(selector: 'table'): TableComponent;
	getComponentBySelector(selector: 'link'): LinkComponent;
	getComponentBySelector(selector: 'markdown'): MarkdownComponent;
	getComponentBySelector(selector: string): null;
	getComponentBySelector(selector: ComponentSelector): any {
		switch (selector) {
			case 'table':
				return TableComponent;
			case 'link':
				return LinkComponent;
			case 'markdown':
				return MarkdownComponent;
			default:
				return null;
		}
	}

	setComponentBySelector(dynamicComponent: TskDynamicContentComponent, selector: ComponentSelector, data: any): void {
		if (!this.trySetComponentBySelector(dynamicComponent, selector, data)) {
			console.error(`Unable to dynamically create component with unknown selector "${selector}"`);
		}
	}

	trySetComponentBySelector(dynamicComponent: TskDynamicContentComponent, selector: ComponentSelector, data: any): boolean {
		const component = dynamicComponent.updateContent<any>(this.getComponentBySelector(selector)).instance;
		if (selector === 'link') {
			(component as LinkComponent).setData(data);
		} else if (selector === 'table') {
			(component as TableComponent).setData(data);
		} else if (selector === 'markdown') {
			(component as MarkdownComponent).setData(data);
		} else {
			return false;
		}

		return true;
	}
}
