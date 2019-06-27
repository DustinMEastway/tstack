import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { getTestObjectWithHost, Page } from '@tstack/client/testing';
import { getValue } from '@tstack/core';

import { TskReadonlyFieldComponent } from './readonly-field.component';

class Foo {
	fooId: number;
	bar: string;
}

@Component({
	template: `
		<tsk-readonly-field
			[appearance]="appearance"
			[displayWith]="displayWith"
			[placeholder]="placeholder"
			[value]="value">
		</tsk-readonly-field>`
})
class TestHostComponent {
	@ViewChild(TskReadonlyFieldComponent, { static: false }) component: TskReadonlyFieldComponent;
	appearance: MatFormFieldAppearance = 'legacy';
	displayWith = 'bar';
	placeholder = 'Foobar:';
	value: Foo | Foo[];
	valueArray: Foo[];

	constructor() {
		this.valueArray = [
			{ fooId: 1, bar: 'Foo' },
			{ fooId: 2, bar: 'Foobar' },
			{ fooId: 3, bar: 'Bar' }
		];
		this.value = this.valueArray[0];
	}
}

class TestPage extends Page<TestHostComponent> {
	get valueDivs(): HTMLInputElement[] { return this.queryAll('.mat-form-field-autofill-control div'); }

	constructor(protected _fixture: ComponentFixture<TestHostComponent>) { super(); }
}

describe('AutocompleteComponent', () => {
	let component: TskReadonlyFieldComponent;
	let fixture: ComponentFixture<TestHostComponent>;
	let host: TestHostComponent;
	let page: TestPage;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				NoopAnimationsModule
			],
			declarations: [
				TskReadonlyFieldComponent,
				TestHostComponent
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		({ component, fixture, host, page } = getTestObjectWithHost(TestHostComponent, 'component', TestPage));

		fixture.detectChanges();
	});

	afterEach(() => {
		fixture.destroy();
	});

	describe('initialization', () => {
		it('should create', () => {
			// arrange / act / assert
			expect(component).toBeTruthy();
		});

		it('should accept appearance as an input', () => {
			// arrange / act / assert
			expect(component.appearance).toBeDefined();
			expect(component.appearance).toEqual(host.appearance);
		});

		it('should accept displayWith as an input', () => {
			// arrange / act / assert
			expect(component.displayWith).toBeDefined();
			expect(typeof component.displayWith).toEqual('function');
			expect(component.displayWithFunction(host.value)).toBe(getValue(host.value, host.displayWith));
		});

		it('should accept placeholder as an input', () => {
			// arrange / act / assert
			expect(component.placeholder).toBeDefined();
			expect(component.placeholder).toEqual(host.placeholder);
		});

		it('should accept value as an input', () => {
			// arrange / act / assert
			expect(component.value).toBeDefined();
			expect(component.valueArray.length).toEqual(1);
			expect(component.valueArray[0]).toEqual(host.value);
		});

		it('should get full value if displayWith is undefined', () => {
			// arrange / act
			component.displayWith = undefined;

			// assert
			expect(component.displayWithFunction(host.value)).toEqual(host.value as any);
		});

		it('should get full value if displayWith is null', () => {
			// arrange / act
			component.displayWith = null;

			// assert
			expect(component.displayWithFunction(host.value)).toEqual(host.value as any);
		});

		it('should display value using displayWith property', () => {
			// arrange / act / assert
			expect(page.valueDivs.length).toEqual(1);
			expect(page.valueDivs[0].textContent.trim()).toEqual(getValue(host.value, host.displayWith));
		});
	});
});
