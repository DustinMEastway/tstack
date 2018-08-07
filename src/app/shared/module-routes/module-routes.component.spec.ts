import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleRoutesComponent } from './module-routes.component';

describe('ModuleRoutesComponent', () => {
	let component: ModuleRoutesComponent;
	let fixture: ComponentFixture<ModuleRoutesComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ ModuleRoutesComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ModuleRoutesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
