import { Injectable } from '@angular/core';
import { TskDynamicContentComponent } from '@tstack/client';
import { Type } from '@tstack/core';

import { ComponentSelector } from 'app/entities';

export interface DynamicComponent<T = any> {
	setData?(data: T): void;
}

@Injectable({ providedIn: 'root' })
export class DynamicContentService {
	protected static dynamicComponents: { [selector: string]: Type<DynamicComponent> } = {};

	static addDynamicComponent(selector: string, component: Type<DynamicComponent>, overwriteExisting: boolean = false): void {
		if (!overwriteExisting && DynamicContentService.dynamicComponents[selector] != null) {
			throw new Error(`DynamicComponent with selector '${selector} already exists, use the`
				+ ` overwriteExisting flag if this is intentional`);
		}

		DynamicContentService.dynamicComponents[selector] = component;
	}

	getComponentBySelector(selector: string): Type<any> {
		return DynamicContentService.dynamicComponents[selector] || null;
	}

	setComponentBySelector(dynamicComponent: TskDynamicContentComponent, selector: ComponentSelector, data?: any): void {
		if (!this.trySetComponentBySelector(dynamicComponent, selector, data)) {
			throw new Error(`Unable to dynamically create component with unknown selector '${selector}'`);
		}
	}

	trySetComponentBySelector(dynamicComponent: TskDynamicContentComponent, selector: ComponentSelector, data?: any): boolean {
		const componentType = this.getComponentBySelector(selector);
		const foundComponentType = componentType != null;

		if (foundComponentType) {
			const component = dynamicComponent.updateContent<DynamicComponent>(componentType).instance;

			if (typeof component.setData === 'function') {
				component.setData(data);
			}
		}

		return foundComponentType;
	}
}
