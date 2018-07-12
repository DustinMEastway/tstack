import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteScreenComponent } from './autocomplete-screen.component';

describe('AutocompleteScreenComponent', () => {
	let component: AutocompleteScreenComponent;
	let fixture: ComponentFixture<AutocompleteScreenComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ AutocompleteScreenComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AutocompleteScreenComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
