import {
	Component,
	ComponentFactoryResolver,
	ComponentRef,
	Input,
	OnInit,
	Output,
	Type,
	ViewContainerRef
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/** used to dynamically create Angular entry components */
@Component({
	selector: 'tsk-dynamic-content',
	template: ''
})
export class TskDynamicContentComponent<ComponentT = any> {
	private _contentChange = new BehaviorSubject<ComponentRef<ComponentT>>(null);
	private _componentTypeChange = new BehaviorSubject<Type<ComponentT>>(null);

	get content(): ComponentRef<ComponentT> {
		return this._contentChange.value;
	}

	@Output()
	get contentChange(): Observable<ComponentRef<ComponentT>> {
		return this._contentChange.asObservable();
	}

	@Input()
	get componentType(): Type<ComponentT> {
		return this._componentTypeChange.value;
	}
	set componentType(componentType: Type<ComponentT>) {
		if (this.componentType !== componentType) {
			this.updateContent(componentType);
		}
	}

	@Output()
	get componentTypeChange(): Observable<Type<ComponentT>> {
		return this._componentTypeChange.asObservable();
	}

	constructor(private _componentFactoryResolver: ComponentFactoryResolver,
		private _viewContainerRef: ViewContainerRef) {
	}

	/**
	 * @method clearContent of the dynamic component
	 */
	clearContent(): void {
		this._viewContainerRef.clear();
		this._contentChange.next(null);
	}

	/**
	 * @method updateContent using the given component type
	 * @param updateType to determine what needs to be updated on the dynamic component
	 */
	updateContent(componentType: Type<ComponentT>): ComponentRef<ComponentT> {
		// clear out the previous component and create a new one with the current component type
		this.clearContent();
		this._componentTypeChange.next(componentType);

		if (componentType) {
			const componentFactory = this._componentFactoryResolver.resolveComponentFactory(componentType);
			const content = this._viewContainerRef.createComponent(componentFactory);
			this._contentChange.next(content);

			return content;
		}
	}
}
