import { Component, OnInit } from '@angular/core';

import { Documentation } from 'app/entities';
import { ObjectIsBetweenComponent } from 'app/examples';

@Component({
	selector: 'app-object-screen',
	templateUrl: './object-screen.component.html',
	styleUrls: ['./object-screen.component.scss']
})
export class ObjectScreenComponent implements OnInit {
	private _isBetweenDocumentation: Documentation[];

	get isBetweenDocumentation(): Documentation[] {
		return this._isBetweenDocumentation;
	}

	ngOnInit(): void {
		this._isBetweenDocumentation = Documentation.cast<Documentation[]>([
			{
				name: 'Demo',
				description: 'Play around with various inputs to see what the function would output',
				examples: [
					{
						name: 'TS',
						content: ObjectIsBetweenComponent
					}
				]
			}
		]);
	}
}
