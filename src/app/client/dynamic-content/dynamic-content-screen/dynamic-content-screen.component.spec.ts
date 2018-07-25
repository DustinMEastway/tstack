import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicContentScreenComponent } from './dynamic-content-screen.component';

describe('DynamicContentScreenComponent', () => {
	let component: DynamicContentScreenComponent;
	let fixture: ComponentFixture<DynamicContentScreenComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ DynamicContentScreenComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DynamicContentScreenComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
