import { Component } from '@angular/core';

@Component({
	selector: 'app-client-screen',
	templateUrl: './client-screen.component.html',
	styleUrls: ['./client-screen.component.scss']
})
export class ClientScreenComponent {
	private _title = 'Client';

	get title(): string {
		return this._title;
	}
}
