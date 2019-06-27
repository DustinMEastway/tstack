import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { getTestObjectWithHost, Page } from '../../../testing';

import { TskNavMenuConfig } from './nav-menu-config';
import { TskNavMenuComponent } from './nav-menu.component';
import { TskNavMenuModule } from './nav-menu.module';

@Component({
	template: '<tsk-nav-menu (navItemSelected)="onNavItemSelected($event)" [menuConfig]="menuConfig" [navigate]="navigate"></tsk-nav-menu>'
})
class TestHostComponent {
	@ViewChild(TskNavMenuComponent, { static: false }) component: TskNavMenuComponent;
	menuConfig: TskNavMenuConfig;
	navigate: boolean;

	constructor() {
		this.menuConfig = {
			name: 'Foo',
			value: 'foo',
			items: [
				{
					name: 'SubFoo',
					value: 'sub-foo'
				},
				{
					name: 'Bar',
					value: 'bar'
				}
			]
		};

		this.navigate = true;
	}

	onNavItemSelected(): void {}
}

class TestPage extends Page {
	get primaryNavLink(): HTMLAnchorElement { return this.query('div a'); }

	get menuButton(): HTMLBaseElement { return this.query('div button'); }

	constructor(protected _fixture: ComponentFixture<TestHostComponent>) { super(); }
}

class MockRouter {
	navigateByUrl(): void {}
}

describe('AutocompleteComponent', () => {
	let component: TskNavMenuComponent;
	let fixture: ComponentFixture<TestHostComponent>;
	let host: TestHostComponent;
	let page: TestPage;
	let router: MockRouter;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				TskNavMenuModule
			],
			declarations: [
				TestHostComponent
			],
			providers: [
				{ provide: Router, useClass: MockRouter }
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		({ component, fixture, host, page } = getTestObjectWithHost(TestHostComponent, 'component', TestPage));

		fixture.detectChanges();
		router = TestBed.get(Router);
	});

	afterEach(() => {
		fixture.destroy();
	});

	describe('initialization', () => {
		it('should create', () => {
			// arrange / act / assert
			expect(component).toBeTruthy();
		});

		it('should accept menuConfig as an input', () => {
			// arrange / act / assert
			expect(component.menuConfig).toBeDefined();
			expect(component.menuConfig).toBe(host.menuConfig);
		});

		it('should accept navigate as an input', () => {
			// arrange / act / assert
			expect(component.navigate).toBeDefined();
			expect(component.navigate).toEqual(host.navigate);
		});

		it('should display a primary navigation link', () => {
			// arrange / act / assert
			expect(page.primaryNavLink).toBeDefined();
			expect(page.primaryNavLink.textContent.trim()).toEqual(host.menuConfig.name);
		});

		it('should have a menu button if there are items in the menu', () => {
			// arrange / act
			expect(component.menuConfig.items.length).toBeGreaterThan(0);

			// assert
			expect(page.menuButton).toBeDefined();
		});

		it('should not have a menu button if there are not any items in the menu', () => {
			// arrange
			component.menuConfig.items = [];

			// act
			fixture.detectChanges();

			// assert
			expect(page.menuButton).toBeNull();
		});
	});

	describe('onNavItemClick', () => {
		it('should navigate by url when navigate is active', () => {
			// arrange
			const navigateByUrlSpy = spyOn(router, 'navigateByUrl');
			component.navigate = true;

			// act
			component.onNavItemClick([ 'foo', 'bar' ]);

			// assert
			expect(navigateByUrlSpy).toHaveBeenCalledWith('foo/bar');
		});

		it('should not navigate by url when navigate is disabled', () => {
			// arrange
			const navigateByUrlSpy = spyOn(router, 'navigateByUrl');
			component.navigate = false;

			// act
			component.onNavItemClick([ 'foo', 'bar' ]);

			// assert
			expect(navigateByUrlSpy).not.toHaveBeenCalled();
		});

		it('should emit when a nav item is selected', () => {
			// arrange
			const onNavItemSelectedSpy = spyOn(host, 'onNavItemSelected');
			const navParams = [ 'foo', 'bar' ];

			// act
			component.onNavItemClick(navParams);

			// assert
			expect(onNavItemSelectedSpy).toHaveBeenCalledWith(navParams);
		});

		it('should call onNavItemClick when the primary link is clicked', () => {
			// arrange
			const onNavItemClickSpy = spyOn(component, 'onNavItemClick');

			// act
			page.primaryNavLink.click();

			// assert
			expect(onNavItemClickSpy).toHaveBeenCalledWith([ host.menuConfig.value ]);
		});
	});
});
