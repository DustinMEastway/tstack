import { Injectable } from '@angular/core';
import { TskDynamicContentComponent, TskReadonlyFieldComponent } from '@tstack/client';

import { ComponentSelector } from 'app/entities';
import { TableComponent } from 'app/table/table.component';

@Injectable({
	providedIn: 'root'
})
export class DynamicContentService {
	setComponentBySelector(dynamicComponent: TskDynamicContentComponent, selector: ComponentSelector, data: any): void {
		if (selector === 'table') {
			const component = dynamicComponent.updateContent(TableComponent).instance;
			component.setData(data);
		} else if (selector === 'markdown') {
			const component = dynamicComponent.updateContent(TskReadonlyFieldComponent).instance;
			component.value = data;
		} else {
			console.error(`Unable to dynamically create component with unknown selector "${selector}"`);
		}
	}
}
