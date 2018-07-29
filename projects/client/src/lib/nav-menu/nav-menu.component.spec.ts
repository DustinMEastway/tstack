import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TskNavMenuComponent } from './nav-menu.component';

describe('TskNavMenuComponent', () => {
	let component: TskNavMenuComponent;
	let fixture: ComponentFixture<TskNavMenuComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ TskNavMenuComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TskNavMenuComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
