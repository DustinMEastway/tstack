import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { isBetween } from '@tstack/core';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { DynamicComponent } from 'app/decorators';

@DynamicComponent({ selector: 'examples/core/object-is-between' })
@Component({
	selector: 'app-object-is-between',
	templateUrl: './object-is-between.component.html'
})
export class ObjectIsBetweenComponent implements OnInit {
	private _form: FormGroup;
	private _codeDisplay$: Observable<string>;

	get form(): FormGroup {
		return this._form;
	}

	get codeDisplay$(): Observable<string> {
		return this._codeDisplay$;
	}

	constructor(private _formBuilder: FormBuilder) {}

	ngOnInit(): void {
		this._form = this._formBuilder.group({
			includeMax: true,
			includeMin: true,
			max: 'a',
			min: 'm',
			value: 'c'
		});

		const includeMaxControl = this._form.get('includeMax');
		const includeMinControl = this._form.get('includeMin');
		const maxControl = this._form.get('max');
		const minControl = this._form.get('min');
		const valueControl = this._form.get('value');
		this._codeDisplay$ = combineLatest(
			includeMaxControl.valueChanges.pipe(startWith(includeMaxControl.value)),
			includeMinControl.valueChanges.pipe(startWith(includeMinControl.value)),
			maxControl.valueChanges.pipe(startWith(maxControl.value)),
			minControl.valueChanges.pipe(startWith(minControl.value)),
			valueControl.valueChanges.pipe(startWith(valueControl.value))
		).pipe(
			map(([includeMax, includeMin, max, min, value]) => {
				const endpoints = (includeMax ? (includeMin ? 'both' : 'max') : (includeMin ? 'min' : 'neither'));
				let config = '';
				if (!includeMax || !includeMin) {
					config = `, { endpoints: '${endpoints}' }`;
				}

				return `isBetween('${value}', '${min}', '${max}'` + config + ') = '
					+ isBetween(value, min, max, { endpoints: endpoints });
			})
		);
	}
}
