import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { getTestObjectWithHost, Page } from '@tstack/client/testing';
import { getValue } from '@tstack/core';
import { Subject } from 'rxjs';

import { TskOption } from '../option/option';

import { TskAutocompleteComponent } from './autocomplete.component';
import { TskAutocompleteModule } from './autocomplete.module';
import { TskFilterConfig } from './filter-config';

class Foo {
	fooId: number;
	bar: string;
}

@Component({
	template: `
		<tsk-autocomplete
			[appearance]="appearance"
			[autoSelect]="autoSelect"
			[caseSensitive]="caseSensitive"
			[disabled]="disabled"
			[filter]="filter"
			[filterType]="filterType"
			[maxDisplayedOptions]="maxDisplayedOptions"
			[options]="options | async"
			[optionValues]="optionValues | async"
			[placeholder]="placeholder"
			[showCaseSensitive]="showCaseSensitive"
			[showFilterType]="showFilterType"
			[viewProperty]="viewProperty">
		</tsk-autocomplete>`
})
class TestHostComponent {
	@ViewChild(TskAutocompleteComponent, { static: false }) component: TskAutocompleteComponent<Foo>;
	appearance: MatFormFieldAppearance = 'fill';
	autoSelect = true;
	caseSensitive = false;
	disabled = false;
	filter = 'fo';
	filterType: 'contains' | 'startsWith' = 'contains';
	maxDisplayedOptions = 50;
	mockValues: Foo[];
	options = new Subject<TskOption<Foo>[]>();
	optionValues = new Subject<Foo[]>();
	placeholder = 'Foo:';
	showCaseSensitive = true;
	showFilterType = true;
	viewProperty = 'bar';

	constructor() {
		this.mockValues = [
			{ fooId: 1, bar: 'Foo' },
			{ fooId: 2, bar: 'Foobar' },
			{ fooId: 3, bar: 'Bar' }
		];
	}
}

class TestPage extends Page<TestHostComponent> {
	get filterInput(): HTMLInputElement { return this.query('input'); }

	get caseSensitiveButton(): HTMLButtonElement {
		for (const button of this.suffixButtons) {
			if (button.textContent.trim() === 'Aa') {
				return button;
			}
		}

		return null;
	}

	get filterTypeButton(): HTMLButtonElement {
		for (const button of this.suffixButtons) {
			if (button.textContent.trim() === this._component.component.filterTypeIcon) {
				return button;
			}
		}

		return null;
	}

	get suffixButtons(): HTMLButtonElement[] { return this.queryAll('div[matsuffix] button'); }

	constructor(protected _fixture: ComponentFixture<TestHostComponent>) { super(); }
}

describe('AutocompleteComponent', () => {
	let component: TskAutocompleteComponent<Foo>;
	let fixture: ComponentFixture<TestHostComponent>;
	let host: TestHostComponent;
	let page: TestPage;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				NoopAnimationsModule,
				TskAutocompleteModule
			],
			declarations: [
				TestHostComponent
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		TskAutocompleteComponent.maxDisplayedOptions = 50;
		({ component, fixture, host, page } = getTestObjectWithHost(TestHostComponent, 'component', TestPage));
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

		it('should set the placeholder value on the input', () => {
			// arrange / act / assert
			expect(page.filterInput.placeholder).toEqual(host.placeholder);
		});

		it('should accept autoSelect as an input', () => {
			// arrange / act / assert
			expect(component.autoSelect).toBeDefined();
			expect(component.autoSelect).toEqual(host.autoSelect);
		});

		it('should set autoSelect to true if an empty string is provided', () => {
			// arrange
			host.autoSelect = '' as any;

			// act
			fixture.detectChanges();

			// assert
			expect(component.autoSelect).toEqual(true);
		});

		it('should accept caseSensitive as an input', () => {
			// arrange / act / assert
			expect(component.caseSensitive).toBeDefined();
			expect(component.caseSensitive).toEqual(host.caseSensitive);
		});

		it('should set caseSensitive to true if an empty string is provided', () => {
			// arrange
			host.caseSensitive = '' as any;

			// act
			fixture.detectChanges();

			// assert
			expect(component.caseSensitive).toEqual(true);
		});

		it('should accept disabled as an input', () => {
			// arrange / act / assert
			expect(component.disabled).toBeDefined();
			expect(component.disabled).toEqual(host.disabled);
		});

		it('should set disabled to true if an empty string is provided', () => {
			// arrange
			host.disabled = '' as any;

			// act
			fixture.detectChanges();

			// assert
			expect(component.disabled).toEqual(true);
		});

		it('should enable the input when disabled is false', () => {
			// arrange
			host.disabled = false;

			// act
			fixture.detectChanges();

			// assert
			expect(page.filterInput.disabled).toEqual(false);
		});

		it('should disable the input when disabled is true', () => {
			// arrange
			host.disabled = true;

			// act
			fixture.detectChanges();

			// assert
			expect(page.filterInput.disabled).toEqual(true);
		});

		it('should accept filter as an input', () => {
			// arrange / act / assert
			expect(component.filter).toBeDefined();
			expect(component.filter).toEqual(host.filter);
		});

		it('should accept filterType as an input', () => {
			// arrange / act / assert
			expect(component.filterType).toBeDefined();
			expect(component.filterType).toEqual(host.filterType);
		});

		it('should have a filterTypeIcon of format_align_center  when filterType is contains', () => {
			// arrange
			host.filterType = 'contains';

			// act
			fixture.detectChanges();

			// assert
			expect(component.filterTypeIcon).toEqual('format_align_center');
			expect(page.filterTypeButton.textContent).toEqual('format_align_center');
		});

		it('should have a filterTypeIcon of format_align_left  when filterType is startsWith', () => {
			// arrange
			host.filterType = 'startsWith';

			// act
			fixture.detectChanges();

			// assert
			expect(component.filterTypeIcon).toEqual('format_align_left');
			expect(page.filterTypeButton.textContent).toEqual('format_align_left');
		});

		it('should accept maxDisplayedOptions as an input', () => {
			// arrange / act / assert
			expect(component.maxDisplayedOptions).toBeDefined();
			expect(component.maxDisplayedOptions).toEqual(host.maxDisplayedOptions);
		});

		it('should accept -1 as a valid maxDisplayedOptions', () => {
			// arrange
			host.maxDisplayedOptions = -1;

			// act
			fixture.detectChanges();

			// assert
			expect(component.maxDisplayedOptions).toBeDefined();
			expect(component.maxDisplayedOptions).toEqual(host.maxDisplayedOptions);
		});

		it('should default maxDisplayedOptions if one is not provided', () => {
			// arrange
			host.maxDisplayedOptions = null;

			// act
			fixture.detectChanges();

			// assert
			expect(component.maxDisplayedOptions).toBeDefined();
			expect(component.maxDisplayedOptions).toEqual(TskAutocompleteComponent.maxDisplayedOptions);
		});

		it('should accept options as an input', () => {
			// arrange
			host.options.next(TskOption.createOptions(host.mockValues, host.viewProperty));

			// act
			fixture.detectChanges();

			// assert
			expect(component.options).toBeDefined();
			expect(component.options.length).toEqual(host.mockValues.length);
			component.options.forEach((option, index) => {
				expect(option.viewValue).toEqual(getValue(host.mockValues[index], host.viewProperty));
				expect(option.value).toEqual(host.mockValues[index]);
			});
		});

		it('should accept optionValues as an input', () => {
			// arrange
			host.optionValues.next(host.mockValues);

			// act
			fixture.detectChanges();

			// assert
			expect(component.optionValues).toBeDefined();
			expect(component.optionValues.length).toEqual(host.mockValues.length);
			component.optionValues.forEach((optionValue, index) => {
				expect(optionValue).toEqual(host.mockValues[index]);
			});
		});

		it('should create options from optionValues', () => {
			// arrange
			host.optionValues.next(host.mockValues);

			// act
			fixture.detectChanges();

			// assert
			expect(component.options).toBeDefined();
			expect(component.options.length).toEqual(host.mockValues.length);
			component.options.forEach((option, index) => {
				expect(option.viewValue).toEqual(getValue(host.mockValues[index], host.viewProperty));
				expect(option.value).toEqual(host.mockValues[index]);
			});
		});

		it('should accept placeholder as an input', () => {
			// arrange / act / assert
			expect(component.placeholder).toBeDefined();
			expect(component.placeholder).toEqual(host.placeholder);
		});

		it('should accept showCaseSensitive as an input', () => {
			// arrange / act / assert
			expect(component.showCaseSensitive).toBeDefined();
			expect(component.showCaseSensitive).toEqual(host.showCaseSensitive);
		});

		it('should set showCaseSensitive to true if an empty string is provided', () => {
			// arrange
			host.showCaseSensitive = '' as any;

			// act
			fixture.detectChanges();

			// assert
			expect(component.showCaseSensitive).toEqual(true);
		});

		it('should display the case sensitive button when showCaseSensitive is true', () => {
			// arrange
			host.showCaseSensitive = true;

			// act
			fixture.detectChanges();

			// assert
			expect(page.caseSensitiveButton).toBeTruthy();
		});

		it('should not display the case sensitive button when showCaseSensitive is false', () => {
			// arrange
			host.showCaseSensitive = false;

			// act
			fixture.detectChanges();

			// assert
			expect(page.caseSensitiveButton).toBeNull();
		});

		it('should accept showFilterType as an input', () => {
			// arrange / act / assert
			expect(component.showFilterType).toBeDefined();
			expect(component.showFilterType).toEqual(host.showFilterType);
		});

		it('should set showFilterType to true if an empty string is provided', () => {
			// arrange
			host.showFilterType = '' as any;

			// act
			fixture.detectChanges();

			// assert
			expect(component.showFilterType).toEqual(true);
		});

		it('should display the filter type button when showFilterType is true', () => {
			// arrange
			host.showFilterType = true;

			// act
			fixture.detectChanges();

			// assert
			expect(page.filterTypeButton).toBeTruthy();
		});

		it('should not display the filter type button when showFilterType is false', () => {
			// arrange
			host.showFilterType = false;

			// act
			fixture.detectChanges();

			// assert
			expect(page.filterTypeButton).toBeNull();
		});

		it('should accept viewProperty as an input', () => {
			// arrange / act / assert
			expect(component.viewProperty).toBeDefined();
			expect(component.viewProperty).toEqual(host.viewProperty);
		});
	});

	describe('filterConfig', () => {
		beforeEach(() => {
			host.options.next(TskOption.createOptions(host.mockValues, 'bar'));
			fixture.detectChanges();
		});

		it('should emit caseSensitiveChange when caseSensitive is changed', () => {
			// arrange
			const expectedValue = true;
			let actualValue: boolean;
			component.caseSensitiveChange.subscribe(caseSensitive => { actualValue = caseSensitive; });

			// act
			component.caseSensitive = expectedValue;

			// assert
			expect(actualValue).toEqual(expectedValue);
		});

		it('should emit filterChange when filter is changed', () => {
			// arrange
			const expectedValue = 'foo';
			let actualValue: string;
			component.filterChange.subscribe(filterText => { actualValue = filterText; });

			// act
			component.filter = expectedValue;

			// assert
			expect(actualValue).toEqual(expectedValue);
		});

		it('should emit filterConfigChange when filterConfig is changed', () => {
			// arrange
			const expectedValue: TskFilterConfig = {
				caseSensitive: !component.caseSensitive,
				maxDisplayedOptions: component.maxDisplayedOptions * 2,
				type: (component.filterType === 'contains') ? 'startsWith' : 'contains',
				value: component.filter + ' 1'
			};
			let actualValue: TskFilterConfig;
			component.filterConfigChange.subscribe(filterConfig => { actualValue = filterConfig; });

			// act
			component.filterConfig = expectedValue;

			// assert
			expect(actualValue).toEqual(expectedValue);
		});

		it('should emit filterTypeChange when filterType is changed', () => {
			// arrange
			// const expectedValue: 'contains' | 'startsWith' = 'contains';
			const expectedValue = (component.filterType === 'contains') ? 'startsWith' : 'contains';
			let actualValue: 'startsWith' | 'contains';
			component.filterTypeChange.subscribe(filterType => { actualValue = filterType; });

			// act
			component.filterType = expectedValue;

			// assert
			expect(actualValue).toEqual(expectedValue);
		});

		it('should set filtered options based on the current configuration', () => {
			// arrange
			const expectedOptions = component.options.slice(1, 2);
			let options: TskOption<Foo>[];
			component.filteredOptions.subscribe(filteredOptions => { options = filteredOptions; });

			// act
			component.filter = component.options[1].viewValue;

			// assert
			expect(options).toEqual(expectedOptions);
		});

		it('should filter options using starts with', () => {
			// arrange
			const expectedStartsWithOptions = component.options.slice(2, 3);
			let options: TskOption<Foo>[];
			component.filteredOptions.subscribe(filteredOptions => { options = filteredOptions; });

			// act
			component.filter = 'b';

			// assert
			expect(options.length).toEqual(2);
			component.filterType = 'startsWith';
			expect(options.length).toEqual(1);
			expect(options).toEqual(expectedStartsWithOptions);
		});

		it('should filter options using starts with', () => {
			// arrange
			const expectedStartsWithOptions = component.options.slice(2, 3);
			let options: TskOption<Foo>[];
			component.filteredOptions.subscribe(filteredOptions => { options = filteredOptions; });

			// act
			component.filter = 'b';

			// assert
			expect(options.length).toEqual(2);
			component.filterType = 'startsWith';
			expect(options.length).toEqual(1);
			expect(options).toEqual(expectedStartsWithOptions);
		});

		it('should allow setting value without a formControl', () => {
			// arrange / act / assert
			expect(() => component.selectedValue = component.optionValues[0]).not.toThrow();
		});

		it('should allow focusing without a formControl', () => {
			// arrange / act / assert
			expect(() => component.onFocus()).not.toThrow();
		});
	});
});
