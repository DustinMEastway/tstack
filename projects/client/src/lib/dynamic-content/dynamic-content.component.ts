/* todo:
	* refactor to make better use of rxjs
*/

import {
	Component,
	ComponentFactoryResolver,
	ComponentRef,
	Input,
	OnInit,
	Type,
	ViewContainerRef
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { DynamicContentUpdateType } from './dynamic-content-update-type';

type ConfigMethod<ComponentT = any, DataT = any> =
	(dynamicComponent: DynamicContentComponent<ComponentT, DataT>, updateType: DynamicContentUpdateType) => void;

const errorMessages = {
	missingComponentType: 'DynamicContentComponent updateContent error: no component type was provided'
};

/** used to dynamically create Angular entry components */
@Component({
	selector: 'tsk-dynamic-content',
	templateUrl: './dynamic-content.component.html',
})
export class DynamicContentComponent<ComponentT = any, DataT = any> implements OnInit {
	private _componentRef: ComponentRef<ComponentT>;
	private _componentType: Type<ComponentT>;
	private _configMethod: ConfigMethod<ComponentT, DataT>;
	private _data: DataT;
	private _dynamicContentUpdated: BehaviorSubject<DynamicContentUpdateType>;

	get componentRef(): ComponentRef<ComponentT> {
		return this._componentRef;
	}

	@Input()
	get componentType(): Type<ComponentT> {
		return this._componentType;
	}
	set componentType(componentType: Type<ComponentT>) {
		if (this._componentType !== componentType) {
			this._componentType = componentType;
			this.updateContent('componentType');
		}
	}

	@Input()
	get configMethod(): ConfigMethod {
		return this._configMethod;
	}
	set configMethod(configMethod: ConfigMethod) {
		if (this._configMethod !== configMethod) {
			this._configMethod = configMethod;
			this.updateContent('configMethod');
		}
	}

	@Input()
	get data(): DataT {
		return this._data;
	}
	set data(data: DataT) {
		if (this._data !== data) {
			this._data = data;
			this.updateContent('data');
		}
	}

	constructor(private _componentFactoryResolver: ComponentFactoryResolver,
		private _viewContainerRef: ViewContainerRef) {
		this._dynamicContentUpdated = new BehaviorSubject<DynamicContentUpdateType>('manual');
	}

	/**
	 * @method ngOnInit start dynamically creating content after component is fully initialized
	 */
	ngOnInit(): void {
		this._dynamicContentUpdated.subscribe((updateType: DynamicContentUpdateType) => {
			this.updateContent(updateType);
		});
	}

	/**
	 * @method updateContent using the current componentType, configMethod, & data
	 * @param updateType to determine what needs to be updated on the dynamic component
	 */
	updateContent(updateType: DynamicContentUpdateType = 'manual'): void {
		// only swap out the component refrence if the component type is changed or if a manual refresh occurs
		if (updateType === 'componentType' || updateType === 'manual') {
			// throw an erorr if no component type was provided
			if (this.componentType == null) { throw Error(errorMessages.missingComponentType); }

			// clear out the previous component and create a new one with the current component type
			this._viewContainerRef.clear();
			const componentFactory = this._componentFactoryResolver.resolveComponentFactory(this.componentType);
			this._componentRef = this._viewContainerRef.createComponent(componentFactory);
		}

		// call the configuration method if one was provided
		if (typeof this.configMethod === 'function') {
			this.configMethod(this, updateType);
		}
	}
}
