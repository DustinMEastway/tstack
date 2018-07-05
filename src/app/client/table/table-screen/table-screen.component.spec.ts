import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableScreenComponent } from './table-screen.component';

describe('TableScreenComponent', () => {
	let component: TableScreenComponent;
	let fixture: ComponentFixture<TableScreenComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ TableScreenComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TableScreenComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
