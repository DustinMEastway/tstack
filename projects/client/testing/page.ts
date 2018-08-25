import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

/** base page test pages can use to access helper functions */
export abstract class Page<FixtureT = any> {
	protected abstract _fixture: ComponentFixture<FixtureT>;

	protected get _debugElement(): DebugElement {
		return this._fixture.debugElement;
	}

	protected get _nativeElement(): HTMLElement {
		return this._fixture.nativeElement;
	}

	protected query<T extends HTMLElement>(selector: string): T {
		return this._nativeElement.querySelector(selector);
	}

	protected queryAll<T extends HTMLElement>(selector: string): T[] {
		return this._nativeElement.querySelectorAll(selector) as any;
	}

	protected queryAllByCss<T extends HTMLElement>(selector: string): T[] {
		return this._debugElement.queryAll(By.css(selector)).map(de => de.nativeElement);
	}

	protected queryByCss<T extends HTMLElement>(selector: string): T {
		return this._debugElement.query(By.css(selector)).nativeElement;
	}
}
