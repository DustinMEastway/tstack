import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavMenuScreenComponent } from './nav-menu-screen.component';

describe('NavMenuScreenComponent', () => {
	let component: NavMenuScreenComponent;
	let fixture: ComponentFixture<NavMenuScreenComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ NavMenuScreenComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(NavMenuScreenComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
