import { Component, OnInit } from '@angular/core';
import { hasDuplicates, HasDuplicatesConfig} from '@tstack/core';

@Component({
	selector: 'app-array-has-duplicates',
	templateUrl: './array-has-duplicates.component.html'
})
export class ArrayHasDuplicatesComponent implements OnInit {
	private _examples: string[];
	private _villians = [
		{ alias: 'Delimiter', name: 'Kate' },
		{ alias: 'Compiler', name: 'Jeff' },
		{ alias: 'C Shark', name: ' Doug' }
	];

	get examples(): string[] {
		return this._examples;
	}

	ngOnInit(): void {
		const staticExamples = [
			this._convertToExample({ data: [ 0, 1, 2 ] }),
			this._convertToExample({ data: [ 0, 1, 0 ] })
		];

		this._examples = staticExamples.concat(
			this._convertToExample({ data: this._villians, config: { property: 'name' } })
		);
	}

	private _convertToExample({ data, config }: { data: any[]; config?: HasDuplicatesConfig; }): string {
		const configString = (!config) ? '' : ', ' + this._stringify(config);

		return `hasDuplicates(${this._stringify(data)}${configString}) = ` + hasDuplicates(data, config);
	}

	private _stringify(data: any): string {
		return JSON.stringify(data)
			.replace(/"(\w+)":/g, '$1: ')
			.replace(/"/g, '\'')
			.replace(/([\{\[\(,])/g, '$1 ')
			.replace(/([\}\]\)])/g, ' $1');
	}
}
