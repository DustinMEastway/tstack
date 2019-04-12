import { Component, OnInit } from '@angular/core';

import { Documentation } from 'app/entities';
import { ArrayHasDuplicatesComponent } from 'app/examples';

@Component({
	selector: 'app-array-screen',
	templateUrl: './array-screen.component.html',
	styleUrls: ['./array-screen.component.scss']
})
export class ArrayScreenComponent implements OnInit {
	private _hasDuplicatesDocumentation: Documentation[];

	get hasDuplicatesDocumentation(): Documentation[] {
		return this._hasDuplicatesDocumentation;
	}

	constructor() { }

	ngOnInit(): void {
		this._hasDuplicatesDocumentation = Documentation.cast<Documentation[]>([
			{
				name: 'Demo',
				description: 'Play around with various inputs to see what the function will output',
				examples: [
					{
						name: 'TS',
						content: ArrayHasDuplicatesComponent
					}
				]
			}
		]);
	}
}
