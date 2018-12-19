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
export class TskDynamicContentComponent<ComponentT = any> implements OnInit {
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
			this._componentTypeChange.next(componentType);
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
	 * @method ngOnInit start dynamically creating content after component is fully initialized
	 */
	ngOnInit(): void {
		this.componentTypeChange.subscribe(componentType => { this.updateContent(); });
	}

	/**
	 * @method updateContent using the current componentType, configMethod, & data
	 * @param updateType to determine what needs to be updated on the dynamic component
	 */
	private updateContent(): void {
		// clear out the previous component and create a new one with the current component type
		this._viewContainerRef.clear();
		if (this.componentType) {
			const componentFactory = this._componentFactoryResolver.resolveComponentFactory(this.componentType);
			this._contentChange.next(this._viewContainerRef.createComponent(componentFactory));
		}
	}
}
