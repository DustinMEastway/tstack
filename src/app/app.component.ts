import { OverlayContainer } from '@angular/cdk/overlay';
import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	title = 'TStack';
	private _themeClass = '';

	get themeClass(): string {
		return this._themeClass;
	}

	constructor(private _domSanitizer: DomSanitizer, private _matIconRegistry: MatIconRegistry, private _overlayContainer: OverlayContainer) {
		this._matIconRegistry.addSvgIcon(
			'github',
			this._domSanitizer.bypassSecurityTrustResourceUrl('../assets/github.svg')
		);
	}

	changeTheme(): void {
		if (this._themeClass === '') {
			this._themeClass = 'dark-theme';
			this._overlayContainer.getContainerElement().classList.add(this.themeClass);
		} else {
			this._overlayContainer.getContainerElement().classList.remove(this.themeClass);
			this._themeClass = '';
		}
	}
}
